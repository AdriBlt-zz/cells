import * as p5 from "p5";

import { PlayableSketch } from "../../services/playable-sketch";
import { COLORS, setFillColor, setStrokeColor } from "../../utils/color";
import { createDefaultList } from "../../utils/list-helpers";
import { random } from "../../utils/random";
import { DiffusionLimitedAggregationConfig, DiffusionLimitedAggregationEngine } from "./diffusion-limited-aggregation-engine";
import { createParticuleOnBorder, Particule } from "./particule-helpers";

export enum GenerationMode {
  InnerPoint = 'Inner Point',
  OutterCircle = 'Outter Circle',
  FromGround = 'From Ground',
}

export const DEFAULT_MODE = GenerationMode.InnerPoint;

const W = 400;
const H = 400;
const NB_PARTICULES = 100;
const STARTING_RADIUS = 5;
const NB_ITERATION_PER_DRAW = 100;

export class DiffusionLimitedAggregationSketch extends PlayableSketch
{
  private engine: DiffusionLimitedAggregationEngine;

  constructor() {
    super();
    const config = getConfig(DEFAULT_MODE);
    this.engine = new DiffusionLimitedAggregationEngine(W, H, config);
  }

  public setConfig = (mode: GenerationMode): void => {
    this.engine.config = getConfig(mode);
    this.resetGrid();
    this.play();
  }

  public resetGrid = (): void => {
    this.engine.reset();
    this.drawParticules();
  }

  public setup(p: p5): void {
    this.p5js = p;
    this.p5js.createCanvas(W, H);
  }

  public draw = (): void => {
    for (let i = 0; i < NB_ITERATION_PER_DRAW; i++) {
      this.engine.walkOneStep();
    }

    this.drawParticules();

    if (this.engine.freeParticules.length === 0) {
      this.stop();
    }
  }

  public generate = (): void => {
      this.stop();
      while (this.engine.freeParticules.length > 0 && this.isPaused) {
          this.engine.walkOneStep();
      }

      this.drawParticules();
  }

  private drawParticules(): void {
    setStrokeColor(this.p5js, COLORS.Black);
    setFillColor(this.p5js, COLORS.White);
    this.p5js.rect(0, 0, W, H);

    this.p5js.noStroke();

    setFillColor(this.p5js, COLORS.Red);
    this.engine.treeParticules.forEach(p => this.p5js.ellipse(p.j, p.i, 2 * p.radius));

    setFillColor(this.p5js, COLORS.Black);
    this.engine.freeParticules.forEach(p => this.p5js.ellipse(p.j, p.i, 2 * p.radius));
  }
}

function getConfig(mode: GenerationMode): DiffusionLimitedAggregationConfig {
  switch (mode) {
    case GenerationMode.InnerPoint:
      return createConfig(
        [{ i: H / 2, j: W / 2, radius: 10 }],
        (radius) => createParticuleOnBorder(radius, W, H),
      );
    case GenerationMode.OutterCircle:
      const nbPoints = 1000;
      const circleRadius = Math.min(H, W) / 2;
      return createConfig(
        createDefaultList(nbPoints, i => {
          const angle = i * 2 * Math.PI / nbPoints;
          return {
            i: H / 2 + circleRadius * Math.sin(angle),
            j: W / 2 + circleRadius * Math.cos(angle),
            radius: 1,
          };
        }),
        (radius) => ({ i: H / 2, j: W / 2, radius }),
      );
      case GenerationMode.FromGround:
        return createConfig(
          createDefaultList(W, j => ({ i: H - 1, j, radius: 1 })),
          (radius) => ({ i: 0, j: random(0, W), radius }),
        )
      default:
        const never: never = mode;
        throw new Error(`Unknown mode: ${never}`);
  }
}

function createConfig(
  startingTree: Particule[],
  createRandomParticule: (radius: number) => Particule,
): DiffusionLimitedAggregationConfig {
  return {
    startingTree,
    createFreeParticulesAtStart: () => createDefaultList<Particule>(NB_PARTICULES, () => createRandomParticule(STARTING_RADIUS)),
    createFreeParticuleOnCollide: (radius) => radius > 1
      // ? createDefaultList<Particule>(2, () => createRandomParticule(radius / 2))
      ? [ createRandomParticule(radius - 1) ]
      : [],
  };

}