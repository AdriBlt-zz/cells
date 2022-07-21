import * as p5 from "p5";

import { PlayableSketch } from "../../services/playable-sketch";
import { COLORS, setBackground, setFillColor, setStrokeColor } from "../../utils/color";
import { drawHexagon, drawSquare, drawTextOnHexagon, drawTextOnSquare } from "../../utils/shape-drawer-helpers";
import { getBasicTilesProps } from "./templates/basic-props";
import { getKnotsTilesProps } from "./templates/knots-props";
import { GenerationState, WaveFunctionCollapseEngine, WaveFunctionCollapseInterface } from "./wave-function-collapse-engine";
import { loadTiles, rotateImage, Tile, WaveFunctionCollapseProps } from "./wave-function-collapse-models";

export enum TileTemplate {
  PlainSquareTiles = 1,
  PlainHexagonTiles = 2,
  KnotsTiles = 3,
}

export const DEFAULT_TILE_TEMPLATE = TileTemplate.KnotsTiles;

const W = 900;
const H = 500;
const MARGIN = 10;
const MARGIN_LEFT = MARGIN - W / 2;
const MARGIN_TOP = MARGIN - H / 2;
const CELL_SIZE = 25;
const STROKE_WEIGHT = 1;
const STROKE_COLOR = COLORS.Black;
const BACKGROUND_COLOR = COLORS.White;

const NB_COLS = Math.floor((W - 2 * MARGIN) / CELL_SIZE);
const NB_ROWS = Math.floor((H - 2 * MARGIN) / CELL_SIZE);

const SHOW_ENTROPY: boolean = false;

export class WaveFunctionCollapseSketch
  extends PlayableSketch
  implements WaveFunctionCollapseInterface
{
  private engine: WaveFunctionCollapseEngine;
  private props: WaveFunctionCollapseProps;

  private font: p5.Font;
  private images: { [key: string]: p5.Image };

  constructor() {
    super();
    this.engine = new WaveFunctionCollapseEngine(this, NB_ROWS, NB_COLS);
  }

  public setTemplate(template: TileTemplate): void {
    this.props = this.getWaveFunctionCollapseProps(template);
    this.resetGrid();
  }

  public preload(p: p5): void {
    this.p5js = p;
    this.font = this.p5js.loadFont("https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Bold.otf");
    this.images = loadTiles(this.p5js);
  }

  public setup(p: p5): void {
    this.p5js = p;
    this.p5js.createCanvas(W, H, this.p5js.WEBGL);
    this.p5js.textFont(this.font);

    this.setTemplate(DEFAULT_TILE_TEMPLATE);
  }

  public resetGrid = (): void => {
    setBackground(this.p5js, BACKGROUND_COLOR);
    setStrokeColor(this.p5js, STROKE_COLOR);
    this.p5js.strokeWeight(STROKE_WEIGHT + 1);
    this.p5js.rect(MARGIN_LEFT - 1, MARGIN_TOP - 1, CELL_SIZE * NB_COLS + 2, CELL_SIZE * NB_ROWS + 2);
    this.p5js.strokeWeight(STROKE_WEIGHT);
    this.engine.resetGrid(this.props);
    this.p5js.strokeWeight(0);
  }

  public draw(): void {
    this.engine.collapseOneTile();
    if (this.engine.generationState === GenerationState.Done) {
      this.stop();
    } else if (this.engine.generationState === GenerationState.Error) {
      this.resetGrid();
    }
  }

  public generate = (): void => {
      this.stop();
      while (this.engine.generationState !== GenerationState.Done && this.isPaused) {
          this.engine.collapseOneTile(/* disableDraw */ true);
          if (this.engine.generationState === GenerationState.Error) {
            this.resetGrid();
          }
      }

      this.engine.redrawGrid();
  }

  public drawCell = (i: number, j: number, tile: Tile | null): void => {
    if (tile && tile.image) {
      const image = this.images[tile.image.id];
      const graphics = rotateImage(this.p5js, image, tile.image.rotate || 0);
      this.p5js.image(
        graphics,
        MARGIN_LEFT + j * CELL_SIZE,
        MARGIN_TOP + i * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    } else if (tile && tile.color) {
      setFillColor(this.p5js, tile.color);

      if (this.props.isHexaGrid) {
        drawHexagon(this.p5js, j, i, CELL_SIZE, MARGIN_LEFT, MARGIN_TOP);
      } else {
        drawSquare(this.p5js, j, i, CELL_SIZE, MARGIN_LEFT, MARGIN_TOP);
      }
    } else if (SHOW_ENTROPY) {
      setFillColor(this.p5js, BACKGROUND_COLOR);

      if (this.props.isHexaGrid) {
        drawHexagon(this.p5js, j, i, CELL_SIZE, MARGIN_LEFT, MARGIN_TOP);
      } else {
        drawSquare(this.p5js, j, i, CELL_SIZE, MARGIN_LEFT, MARGIN_TOP);
      }

      setFillColor(this.p5js, COLORS.Black);
      setStrokeColor(this.p5js, COLORS.Black);

      if (this.props.isHexaGrid) {
        drawTextOnHexagon(this.p5js, j, i, this.engine.getCell(i, j).possibleTiles.length + '', CELL_SIZE, MARGIN_LEFT, MARGIN_TOP);
      } else {
        drawTextOnSquare(this.p5js, j, i, this.engine.getCell(i, j).possibleTiles.length + '', CELL_SIZE, MARGIN_LEFT, MARGIN_TOP);
      }
    }
  }

  private getWaveFunctionCollapseProps(template: TileTemplate): WaveFunctionCollapseProps {
    switch (template) {
      case TileTemplate.PlainHexagonTiles:
        return getBasicTilesProps(this.p5js, true);
      case TileTemplate.PlainSquareTiles:
        return getBasicTilesProps(this.p5js, false);
      case TileTemplate.KnotsTiles:
        return getKnotsTilesProps();
      default:
        const never: never = template;
        throw new Error(`Unknown tempalte: ${never}`)
    }
  }
}
