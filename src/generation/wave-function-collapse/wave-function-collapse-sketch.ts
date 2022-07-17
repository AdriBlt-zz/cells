import * as p5 from "p5";

import { PlayableSketch } from "../../services/playable-sketch";
import { COLORS, setBackground, setFillColor, setStrokeColor } from "../../utils/color";
import { drawHexagon, drawSquare } from "../../utils/shape-drawer-helpers";
import { GenerationState, WaveFunctionCollapseEngine, WaveFunctionCollapseInterface } from "./wave-function-collapse-engine";
import { getPlainTilesWFCProps, Tile, WaveFunctionCollapseProps } from "./wave-function-collapse-props";

export enum TileTemplate {
  PlainSquareTiles = 1,
  PlainHexagonTiles = 2,
}

export const DEFAULT_TILE_TEMPLATE = TileTemplate.PlainHexagonTiles;

const W = 900;
const H = 500;
const MARGIN = 10;
const CELL_SIZE = 15;
const STROKE_WEIGHT = 1;
const STROKE_COLOR = COLORS.Black;
const BACKGROUND_COLOR = COLORS.White;

const NB_COLS = Math.floor((W - 2 * MARGIN) / CELL_SIZE);
const NB_ROWS = Math.floor((H - 2 * MARGIN) / CELL_SIZE);

export class WaveFunctionCollapseSketch
  extends PlayableSketch
  implements WaveFunctionCollapseInterface
{
  private engine: WaveFunctionCollapseEngine;
  private props: WaveFunctionCollapseProps;

  constructor() {
    super();
    this.engine = new WaveFunctionCollapseEngine(this, NB_ROWS, NB_COLS);
  }

  public setTemplate(template: TileTemplate): void {
    this.props = this.getWaveFunctionCollapseProps(template);
    this.resetGrid();
  }

  public setup(p: p5): void {
      this.p5js = p;
      this.p5js.createCanvas(W, H);

      this.setTemplate(DEFAULT_TILE_TEMPLATE);
    }

  public resetGrid = (): void => {
    setBackground(this.p5js, BACKGROUND_COLOR);
    setStrokeColor(this.p5js, STROKE_COLOR);
    this.p5js.strokeWeight(STROKE_WEIGHT);
    this.engine.resetGrid(this.props);
  }

  public draw(): void {
    this.engine.collapseOneTile();
    if (this.engine.generationState === GenerationState.Done) {
      this.pause();
    }
  }

  public generate = (): void => {
      this.stop();
      while (this.engine.generationState !== GenerationState.Done && this.isPaused) {
          this.engine.collapseOneTile();
      }

      this.engine.redrawGrid();
  }

  public drawCell = (i: number, j: number, tile: Tile | null): void => {
    if (!tile) {
      setFillColor(this.p5js, BACKGROUND_COLOR);
      if (this.props.isHexaGrid) {
        drawHexagon(this.p5js, j, i, CELL_SIZE, MARGIN, MARGIN);
      } else {
        drawSquare(this.p5js, j, i, CELL_SIZE, MARGIN, MARGIN);
      }

      return;
    }

    let x: number;
    let y: number;
    if (this.props.isHexaGrid) {
      const side = CELL_SIZE / Math.sqrt(3);
      const delta = CELL_SIZE / Math.sqrt(12);
      x = MARGIN + j * (side + delta);
      y = MARGIN + i * CELL_SIZE;

      if (j % 2 === 1) {
        y += CELL_SIZE / 2;
      }

    } else {
      x = MARGIN + j * CELL_SIZE;
      y = MARGIN + i * CELL_SIZE;
    }

    this.p5js.image(tile.image, x, y);
  }

  private getWaveFunctionCollapseProps(template: TileTemplate): WaveFunctionCollapseProps {
    switch (template) {
      case TileTemplate.PlainHexagonTiles:
        return getPlainTilesWFCProps(this.p5js, true, CELL_SIZE, STROKE_COLOR, STROKE_WEIGHT);
      case TileTemplate.PlainSquareTiles:
        return getPlainTilesWFCProps(this.p5js, false, CELL_SIZE, STROKE_COLOR, STROKE_WEIGHT);
      default:
        const never: never = template;
        throw new Error(`Unknown tempalte: ${never}`)
    }
  }
}
