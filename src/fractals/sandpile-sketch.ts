import * as p5 from "p5";

import { PlayableSketch } from "../services/playable-sketch";
import { Color, COLORS, setBackground, setFillColor, setStrokeColor } from "../utils/color";
import { getNeighbourCells } from "../utils/grid-helper";
import { createDefaultMatrix } from "../utils/list-helpers";
import { isOutOfBounds } from "../utils/numbers";
import { Point } from "../utils/points";
import { drawHexagon, drawSquare } from "../utils/shape-drawer-helpers";

const W = 600;
const H = 600;
const CELL_SIZE = 1;
const NB_COLS = Math.floor(W / CELL_SIZE);
const NB_ROWS = Math.floor(H / CELL_SIZE);
const NB_ITERATIONS_PER_DRAW = 100;
const MARGIN_LEFT = 0;
const MARGIN_TOP = 20;

// TODO only compute 1/4
export class SandpileSketch extends PlayableSketch {
    private cells: number[][];
    private isHexaGrid: boolean = false;

    public setup(p: p5): void {
        this.p5js = p;
        this.p5js.createCanvas(W, H);
        this.resetGrid();
    }

    public resetGrid(): void {
        this.cells = createDefaultMatrix(NB_COLS, NB_ROWS, () => 0);
        this.cells[Math.floor(NB_COLS / 2)][Math.floor(NB_ROWS / 2)] = -1; // +infinity
        this.drawGrid();
    }

    public draw(): void {
        for (let i = 0; i < NB_ITERATIONS_PER_DRAW; i++) {
            this.toppleSand();
        }

        this.drawGrid();
    }

    private drawGrid(): void {
        setBackground(this.p5js, COLORS.White);

        this.p5js.noStroke();
        for (let i = 0; i < NB_ROWS; i++) {
            for (let j = 0; j < NB_COLS; j++) {
                this.drawPoint(i, j);
            }
        }

        setStrokeColor(this.p5js, COLORS.Black);
        this.p5js.noFill();
        this.p5js.rect(MARGIN_LEFT, MARGIN_TOP, NB_COLS * CELL_SIZE, NB_ROWS * CELL_SIZE);
    }

    private toppleSand(): void {
        const cellsMaxValue = this.cellsMaxValue;
        const newCells = createDefaultMatrix(NB_COLS, NB_ROWS, (i, j) => this.cells[i][j]);
        for (let i = 0; i < NB_ROWS; i++) {
            for (let j = 0; j < NB_COLS; j++) {
                if (this.cells[i][j] >= 0 && this.cells[i][j] < cellsMaxValue) {
                    continue;
                }

                if (this.cells[i][j] >= cellsMaxValue) {
                    newCells[i][j] -= cellsMaxValue;
                }

                this.getNeighbourCells(i, j).map(({ x, y }) => {
                    if (!isOutOfBounds(x, 0, NB_ROWS)
                        && !isOutOfBounds(y, 0, NB_COLS)
                        && this.cells[x][y] >= 0)
                    {
                            newCells[x][y]++;
                    }
                });
            }
        }

        this.cells = newCells;
    }

    private getNeighbourCells(i: number, j: number): Point[] {
        return this.isHexaGrid
            ? getNeighbourCells(i, j, true)
            : [
                { x: i, y: j - 1 },
                { x: i, y: j + 1 },
                { x: i - 1, y: j },
                { x: i + 1, y: j },
            ];
    }

    private drawPoint(i: number, j: number): void {
        const sandCount = this.cells[i][j];
        setFillColor(this.p5js, this.getSandCountColor(sandCount));

        if (this.isHexaGrid) {
            drawHexagon(this.p5js, j, i, CELL_SIZE, MARGIN_LEFT, MARGIN_TOP);
        } else {
            drawSquare(this.p5js, j, i, CELL_SIZE, MARGIN_LEFT, MARGIN_TOP);
        }
    }

    private getSandCountColor(sandCount: number): Color {
        switch (sandCount) {
            case -1: return COLORS.Black;
            case 3: return COLORS.Blue;
            case 2: return COLORS.Red;
            case 1: return COLORS.Yellow;
            case 0:
            default: return COLORS.White;
        }
    }

    private get cellsMaxValue(): number {
        return this.isHexaGrid ? 6 : 4;
    }
}
