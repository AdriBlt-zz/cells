import * as p5 from "p5";
import { ProcessingSketch } from "../../services/processing.service";
import { Color, COLORS, getColorBetween, setFillColor, setStrokeColor } from "../../utils/color";
import { isStatisticallyNull } from "../../utils/numbers";
import { Vector } from "../../utils/vector";

interface RayCastingProjection {
    column: number;
    top: number;
    bottom: number;
    pixelColor: Color;
}

interface Player {
    // x and y start position
    position: Vector;
    // initial direction vector
    direction: Vector;
    // the 2d raycaster version of camera plane
    plane: Vector;
}

export interface CellProperties {
    color?: Color;
    canGoThroughOverwrite?: boolean;
    onEnteringCell?: () => void;
    isOutOfBound?: boolean;
}

interface CellPropertiesWithCoordinates extends CellProperties {
    i: number;
    j: number;
}

interface RayCastingGameProps {
    playerInitialPosition: Vector,
    playerInitialDirection: Vector,
    getCellProperties: (i: number, j: number) => CellProperties,
    ceilingColor: Color;
    floorColor: Color;
}

const WIDTH = 1200;
const HEIGHT = 800;

const FRAME_TIME = 0.01;
const MOVE_SPEED = 5 * FRAME_TIME; // the constant value is in squares/second
const ROT_SPEED = 3 * FRAME_TIME; // the constant value is in radians/second

export class RayCastingSketch implements ProcessingSketch {
    public player: Player;
    private p5js: p5;

    constructor(
        private properties: RayCastingGameProps,
    ) {
        this.player = {
            position: this.properties.playerInitialPosition.copy(),
            direction: this.properties.playerInitialDirection.copy(),
            plane: this.properties.playerInitialDirection.rotate(-Math.PI / 2).mult(0.66),
        };
    }

    public setup(p: p5): void {
        this.p5js = p;
        this.p5js.createCanvas(WIDTH, HEIGHT);
    }

    public draw(): void {
        this.updatePosition();
        this.drawScreen();
    }

    private updatePosition(): void {
        const isRunning = this.p5js.keyIsDown(this.p5js.SHIFT);
        const rotSpeed = isRunning ? ROT_SPEED / 2 : ROT_SPEED;
        const moveSpeed = isRunning ? MOVE_SPEED * 2 : MOVE_SPEED;

        const currentCell = this.cellProps(
            this.player.position.x,
            this.player.position.y,
        );

        if (this.p5js.keyIsDown(this.p5js.LEFT_ARROW)) {
            this.player.direction = this.player.direction.rotate(rotSpeed);
            this.player.plane = this.player.plane.rotate(rotSpeed);
        }
        if (this.p5js.keyIsDown(this.p5js.RIGHT_ARROW)) {
            this.player.direction = this.player.direction.rotate(-rotSpeed);
            this.player.plane = this.player.plane.rotate(-rotSpeed);
        }
        
        const posX = this.player.position.x;
        const posY = this.player.position.y;
        const deltaX = this.player.direction.x * moveSpeed;
        const deltaY = this.player.direction.y * moveSpeed;
        if (this.p5js.keyIsDown(this.p5js.UP_ARROW)) {
        // move forward if no wall in front of you
            if (this.canGoThroughCell(posX + deltaX, posY)) {
                this.player.position.x += deltaX;
            }

            if (this.canGoThroughCell(posX, posY + deltaY)) {
                this.player.position.y += deltaY;
            }
        }
        if (this.p5js.keyIsDown(this.p5js.DOWN_ARROW)) {
            // move backwards if no wall behind you
            if (this.canGoThroughCell(posX - deltaX, posY)) {
                this.player.position.x -= deltaX;
            }

            if (this.canGoThroughCell(posX, posY - deltaY)) {
                this.player.position.y -= deltaY;
            }
        }
        
        const updatedCell = this.cellProps(
            this.player.position.x,
            this.player.position.y,
        );

        if (updatedCell.onEnteringCell
            && currentCell.i !== updatedCell.i
            && currentCell.j !== updatedCell.j) {
            updatedCell.onEnteringCell();
        }
    }

    private drawScreen(): void {
        this.p5js.noStroke();

        // Ceiling
        setFillColor(this.p5js, this.properties.ceilingColor);
        this.p5js.rect(0, 0, WIDTH, HEIGHT / 2);
        // Floor
        setFillColor(this.p5js, this.properties.floorColor);
        this.p5js.rect(0, HEIGHT / 2, WIDTH, HEIGHT / 2);

        for (let j = 0; j < WIDTH; j++) {
            const projection = this.computeProjection(j);
            if (projection) {
                setFillColor(this.p5js, projection.pixelColor);
                this.p5js.rect(j, projection.top, 1, projection.bottom - projection.top);
            }
        }

        this.p5js.strokeWeight(1);
        this.p5js.noFill();
        setStrokeColor(this.p5js, COLORS.Black);
        this.p5js.rect(0, 0, WIDTH, HEIGHT);
    }

    private computeProjection(j: number): RayCastingProjection | null {
        const posX = this.player.position.x;
        const posY = this.player.position.y;
        const dirX = this.player.direction.x;
        const dirY = this.player.direction.y;
        const planeX = this.player.plane.x;
        const planeY = this.player.plane.y;
            
        // calculate ray position and direction
        const cameraX = 2 * j / WIDTH - 1; // x-coordinate in camera space
        const rayDirX = dirX + planeX * cameraX;
        const rayDirY = dirY + planeY * cameraX;

        // which box of the map we're in
        let mapX = Math.floor(posX);
        let mapY = Math.floor(posY);

        // length of ray from current position to next x or y-side
        let sideDistX: number;
        let sideDistY: number;

        // length of ray from one x or y-side to next x or y-side
        const isNullRayDirX = isStatisticallyNull(rayDirX);
        const isNullRayDirY = isStatisticallyNull(rayDirY);
        const deltaDistX = isNullRayDirY ? 0 : isNullRayDirX ? 1 : Math.abs(1 / rayDirX);
        const deltaDistY = isNullRayDirX ? 0 : isNullRayDirY ? 1 : Math.abs(1 / rayDirY);

        // what direction to step in x or y-direction (either +1 or -1)
        let stepX: number;
        let stepY: number;

        let isVerticalSurface: boolean; // was a NS or a EW wall hit?
    
        // calculate step and initial sideDist
        if (rayDirX < 0) {
            stepX = -1;
            sideDistX = (posX - mapX) * deltaDistX;
        } else {
            stepX = 1;
            sideDistX = (mapX + 1.0 - posX) * deltaDistX;
        }

        if (rayDirY < 0) {
            stepY = -1;
            sideDistY = (posY - mapY) * deltaDistY;
        } else {
            stepY = 1;
            sideDistY = (mapY + 1.0 - posY) * deltaDistY;
        }
            
        // perform DDA
        while (true) {
            // jump to next map square, OR in x-direction, OR in y-direction
            if (sideDistX < sideDistY) {
                sideDistX += deltaDistX;
                mapX += stepX;
                isVerticalSurface = false;
            } else {
                sideDistY += deltaDistY;
                mapY += stepY;
                isVerticalSurface = true;
            }

            const cellProps = this.cellProps(mapX, mapY);
            // Check if ray has hit a wall
            if (!!cellProps.color || cellProps.isOutOfBound) {
                break;
            };
        } 

        // Calculate distance projected on camera direction (Euclidean distance will give fisheye effect!)
        const perpWallDist = (isVerticalSurface) 
            ? (mapY - posY + (1 - stepY) / 2) / rayDirY
            : (mapX - posX + (1 - stepX) / 2) / rayDirX;

        // Calculate height of line to draw on screen
        const lineHeight = Math.floor(HEIGHT / perpWallDist);

        // calculate lowest and highest pixel to fill in current stripe
        let drawStart = (HEIGHT - lineHeight) / 2;
        if (drawStart < 0) {
            drawStart = 0;
        }

        let drawEnd = (HEIGHT + lineHeight) / 2;
        if (drawEnd >= HEIGHT) {
            drawEnd = HEIGHT - 1;
        }

        let color = this.cellProps(mapX, mapY).color;
        if (!color) {
            return null;
        }

        if (isVerticalSurface) {
            // give x and y sides different brightness
            color = getColorBetween(color, COLORS.Black); // division by 2
        }

        return {
            column: j,
            top: drawStart,
            bottom: drawEnd,
            pixelColor: color,
        }
    }

    private canGoThroughCell(i: number, j: number): boolean {
        const props = this.cellProps(i, j);

        if (props.canGoThroughOverwrite !== undefined) {
            return props.canGoThroughOverwrite;
        }

        return !props.isOutOfBound && !props.color;
    }

    private cellProps(i: number, j: number): CellPropertiesWithCoordinates {
        return {
            i,
            j,
            ...this.properties.getCellProperties(Math.floor(i), Math.floor(j)),
        };
    }
}