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

export interface RayCastingGameProps {
    playerPosition: Vector,
    playerDirection: Vector,
    getCellProperties: (i: number, j: number) => CellProperties,
    ceilingColor: Color;
    floorColor: Color;
    showMapInfo?: { nbRows: number, nbCols: number };
}

const WIDTH = 1200;
const HEIGHT = 800;

const MAP_CELL_SIDE = 5;

const FRAME_TIME = 0.01;
const MOVE_SPEED = 5 * FRAME_TIME; // the constant value is in squares/second
const ROT_SPEED = 3 * FRAME_TIME; // the constant value is in radians/second

export class RayCastingSketch implements ProcessingSketch {
    private p5js: p5;
    private previousPosition: { i: number, j: number } | null;
    private mapColor: Color[][] = [];

    constructor(
        public properties: RayCastingGameProps,
    ) {}

    public setup(p: p5): void {
        this.p5js = p;
        this.p5js.createCanvas(WIDTH, 2 * HEIGHT);
    }

    public draw(): void {
        this.updatePosition();
        this.drawScreen();

        this.drawMap();
    }

    private updatePosition(): void {
        const isRunning = this.p5js.keyIsDown(this.p5js.SHIFT);
        const rotSpeed = isRunning ? ROT_SPEED / 2 : ROT_SPEED;
        const moveSpeed = isRunning ? MOVE_SPEED * 2 : MOVE_SPEED;

        const { playerPosition, playerDirection } = this.properties;

        this.previousPosition = this.cellProps(playerPosition.x, playerPosition.y);

        if (this.p5js.keyIsDown(this.p5js.LEFT_ARROW)) {
            playerDirection.rotate(rotSpeed);
        }
        if (this.p5js.keyIsDown(this.p5js.RIGHT_ARROW)) {
            playerDirection.rotate(-rotSpeed);
        }

        const deltaX = playerDirection.x * moveSpeed;
        const deltaY = playerDirection.y * moveSpeed;
        if (this.p5js.keyIsDown(this.p5js.UP_ARROW)) {
            // move forward if no wall in front of you
            if (this.canGoThroughCell(playerPosition.x + deltaX, playerPosition.y)) {
                playerPosition.x += deltaX;
            }

            if (this.canGoThroughCell(playerPosition.x, playerPosition.y + deltaY)) {
                playerPosition.y += deltaY;
            }
        }
        if (this.p5js.keyIsDown(this.p5js.DOWN_ARROW)) {
            // move backwards if no wall behind you
            if (this.canGoThroughCell(playerPosition.x - deltaX, playerPosition.y)) {
                playerPosition.x -= deltaX;
            }

            if (this.canGoThroughCell(playerPosition.x, playerPosition.y - deltaY)) {
                playerPosition.y -= deltaY;
            }
        }

        const updatedCell = this.cellProps(playerPosition.x, playerPosition.y);

        if (updatedCell.onEnteringCell
            && this.previousPosition.i !== updatedCell.i
            && this.previousPosition.j !== updatedCell.j) {
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

    private computeProjection(column: number): RayCastingProjection | null {
        const { playerPosition, playerDirection } = this.properties

        // calculate ray position and direction
        const cameraX = 2 * column / WIDTH - 1; // x-coordinate in camera space
        const projectionPlane = playerDirection.copy().rotate(-Math.PI / 2).mult(0.66);
        const rayDirection = projectionPlane.mult(cameraX).add(playerDirection);

        // which box of the map we're in
        let mapX = Math.floor(playerPosition.x);
        let mapY = Math.floor(playerPosition.y);

        // length of ray from one x or y-side to next x or y-side
        const isNullRayDirX = isStatisticallyNull(rayDirection.x);
        const isNullRayDirY = isStatisticallyNull(rayDirection.y);
        const deltaDistX = isNullRayDirY ? 0 : isNullRayDirX ? 1 : Math.abs(1 / rayDirection.x);
        const deltaDistY = isNullRayDirX ? 0 : isNullRayDirY ? 1 : Math.abs(1 / rayDirection.y);

        // length of ray from current position to next x or y-side
        let sideDistX: number;
        let sideDistY: number;

        // what direction to step in x or y-direction (either +1 or -1)
        let stepX: number;
        let stepY: number;

        // calculate step and initial sideDist
        if (rayDirection.x < 0) {
            stepX = -1;
            sideDistX = (playerPosition.x - mapX) * deltaDistX;
        } else {
            stepX = 1;
            sideDistX = (mapX + 1.0 - playerPosition.x) * deltaDistX;
        }

        if (rayDirection.y < 0) {
            stepY = -1;
            sideDistY = (playerPosition.y - mapY) * deltaDistY;
        } else {
            stepY = 1;
            sideDistY = (mapY + 1.0 - playerPosition.y) * deltaDistY;
        }

        let isVerticalSurface: boolean; // was a NS or a EW wall hit?

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
            ? (mapY - playerPosition.y + (1 - stepY) / 2) / rayDirection.y
            : (mapX - playerPosition.x + (1 - stepX) / 2) / rayDirection.x;

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
            column,
            top: drawStart,
            bottom: drawEnd,
            pixelColor: color,
        }
    }

    private canGoThroughCell(x: number, y: number): boolean {
        const props = this.cellProps(x, y);

        if (props.canGoThroughOverwrite !== undefined) {
            return props.canGoThroughOverwrite;
        }

        return !props.isOutOfBound && !props.color;
    }

    private cellProps(x: number, y: number): CellPropertiesWithCoordinates {
        const i = Math.floor(x);
        const j = Math.floor(y);
        return { i, j, ...this.properties.getCellProperties(i, j) };
    }

    private drawMap(): void {
        if (!this.properties.showMapInfo) {
            return;
        }

        if (this.mapColor.length === 0) {
            this.mapColor = this.getMap();

            this.p5js.noStroke();
            setFillColor(this.p5js, COLORS.White);
            this.p5js.rect(0, HEIGHT, WIDTH, HEIGHT);

            for (let i = 0; i < this.mapColor.length; i++) {
                for (let j = 0; j < this.mapColor[i].length; j++) {
                    this.drawCellFromMap(i, j);
                }
            }
        } else if (this.previousPosition) {
            const { i, j } = this.previousPosition;
            this.mapColor[i][j] = this.getCellColor(i, j);
            this.drawCellFromMap(i, j);

            const playerI = Math.floor(this.properties.playerPosition.x);
            const playerJ = Math.floor(this.properties.playerPosition.y);
            this.mapColor[playerI][playerJ] = COLORS.Red;
            this.drawCellFromMap(playerI, playerJ);
        }
    }

    private drawCellFromMap(i: number, j: number): void {
        this.p5js.noStroke();
        setFillColor(this.p5js, this.mapColor[i][j]);
        this.p5js.rect(
            j * MAP_CELL_SIDE,
            HEIGHT + MAP_CELL_SIDE + i * MAP_CELL_SIDE,
            MAP_CELL_SIDE,
            MAP_CELL_SIDE
        );
    }

    private getMap(): Color[][] {
        if (!this.properties.showMapInfo) {
            return [];
        }

        const map: Color[][] = [];
        for (let i = 0; i < this.properties.showMapInfo.nbRows; i++) {
            const line: Color[] = [];
            for (let j = 0; j < this.properties.showMapInfo.nbCols; j++) {
                line.push(this.getCellColor(i, j));
            }
            map.push(line);
        }

        const playerI = Math.floor(this.properties.playerPosition.x);
        const playerJ = Math.floor(this.properties.playerPosition.y);
        map[playerI][playerJ] = COLORS.Red;

        return map;
    }

    private getCellColor(i: number, j: number): Color {
        const cellProps = this.properties.getCellProperties(i, j);
        return cellProps && cellProps.color || this.properties.floorColor;
    }
}