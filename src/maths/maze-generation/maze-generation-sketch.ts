import * as p5 from "p5";

import { ProcessingSketch } from "../../services/processing.service";
import { Color, COLORS, setBackground, setFillColor } from "../../utils/color";
import { Point } from "../../utils/points";
import { RandomTraversalAlgorithm } from "./algorithms/random-traversal-algorithm";
import { Cell, Direction, GenerationStatus, MazeGenerationAlgorithm, MazePath, PathStatus } from "./model";

const NB_COLUMNS = 80;
const NB_ROWS = 50;
const CELL_SIDE = 5;

const WIDTH = CELL_SIDE * (2 * NB_COLUMNS + 1);
const HEIGHT = CELL_SIDE * (2 * NB_ROWS + 1);

export class MazeGenerationSketch implements ProcessingSketch {
    private p5js: p5;
    private algorithm: MazeGenerationAlgorithm;

    private isRunningGeneration = false;

    public setup(p: p5): void {
        this.p5js = p;
        this.p5js.createCanvas(WIDTH, HEIGHT);
        setBackground(this.p5js, COLORS.Black);
        this.p5js.noLoop();

        this.algorithm = new RandomTraversalAlgorithm(
            NB_COLUMNS,
            NB_ROWS,
            (cell) => this.onUpdateCell(cell),
            (path) => this.onUpdatePath(path),
        );

        this.startGeneration();
    }

    public reset = (): void => {
        this.stopGeneration();
        setBackground(this.p5js, COLORS.Black);
        this.algorithm.initialize();
    }

    public togglePlayPause = (): void => {
        if (this.isRunningGeneration) {
            this.stopGeneration();
        } else {
            this.startGeneration();
        }
    }

    public playOneStep = (): void => {
        if (this.isRunningGeneration) {
            this.stopGeneration();
        }

        this.draw();
    }

    public skipGeneration = (): void => {
        this.stopGeneration();

        if (this.algorithm.getGenerationStatus() === GenerationStatus.Uninitialized) {
            this.algorithm.initialize();
        }

        while (this.algorithm.getGenerationStatus() === GenerationStatus.Ongoing) {
            this.algorithm.computeOneStep();
        }
    }

    public draw(): void {
        switch (this.algorithm.getGenerationStatus()) {
            case GenerationStatus.Uninitialized:
                this.algorithm.initialize();
                return;
            case GenerationStatus.Ongoing:
                this.algorithm.computeOneStep();
                return;
            case GenerationStatus.Completed:
                console.log("FINISHED");
                this.isRunningGeneration = false;
                return;
            case GenerationStatus.Error:
            default:
                console.log("ERROR");
                this.isRunningGeneration = false;
                return;
        }
    }

    private startGeneration(): void {
        this.isRunningGeneration = true;
        this.p5js.loop();
    }

    private stopGeneration(): void {
        this.isRunningGeneration = false;
        this.p5js.noLoop();
    }

    private onUpdateCell(cell: Cell): void {
        this.drawCellOrPath(this.getCellCoordinates(cell), this.getCellColor(cell));
    }

    private onUpdatePath(path: MazePath): void {
        this.drawCellOrPath(this.getPathCoordinates(path), this.getPathColor(path));
    }

    private drawCellOrPath(point: Point, color: Color): void {
        this.p5js.noStroke();
        setFillColor(this.p5js, color);
        this.p5js.rect(CELL_SIDE * point.x, CELL_SIDE * point.y, CELL_SIDE, CELL_SIDE);
    }

    private getCellCoordinates(cell: Cell): Point {
        return {
            x: 1 + 2 * cell.column,
            y: 1 + 2 * cell.row,
        };
    }

    private getCellColor(cell: Cell): Color {
        return cell.isExplored ? COLORS.White : COLORS.Black;
    }

    private getPathCoordinates(path: MazePath): Point {
        const { x, y } = this.getCellCoordinates(path.cell);
        return {
            x: x + (path.direction === Direction.Right ? 1 : 0),
            y: y + (path.direction === Direction.Bottom ? 1 : 0),
        };
    }

    private getPathColor(path: MazePath): Color {
        switch (path.status) {
            case PathStatus.Empty:
                return COLORS.White;
            case PathStatus.Focused:
                return COLORS.Red;
            case PathStatus.Filled:
                return COLORS.Black;
            default:
                throw new Error("Unknown color");
        }
    }
}