import * as p5 from "p5";

import { Complex } from "../../numbers/Complex";
import { ProcessingSketch } from "../../services/processing.service";
import { getKeyFromCode, KeyBoard } from "../../utils/keyboard";
import { Point } from "../../utils/points";

// Variables
const w = 800;
const h = 600;
const MAX_ITERATION = 10000;
const MIN_SQUARE_DISTANCE = 0.000000001;
const MIN_DRAG_RECT_SIDE = 10;

interface Convergence {
  point: Complex;
  steps: number;
}

export class MandelbrotSketch implements ProcessingSketch {
  private p5js: p5;

  private topLeft: Point;
  private deltaPixel: number;

  private fractaleImage: p5.Image;
  private draggingPointStart: Point | undefined;

  private get ingameWidth(): number {
    return w * this.deltaPixel;
  }
  private get ingameHeight(): number {
    return h * this.deltaPixel;
  }

  public setup(p: p5): void {
    this.p5js = p;
    this.p5js.createCanvas(w, h);
    this.p5js.pixelDensity(1);
    this.fractaleImage = this.p5js.createImage(w, h);

    this.resetFractale();
  }

  public draw(): void {
    // NOOP
  }

  public mouseWheel(delta: number): void {
    if (delta < 0) {
      this.deltaPixel *= 0.9;
    } else {
      this.deltaPixel /= 0.9;
    }

    const newCenter = this.getIngamePoint(this.p5js.mouseX, this.p5js.mouseY);
    this.centerOnIngamePoint(newCenter);
    this.updateFractale();
  }

  public keyPressed(): void {
    const delta = this.deltaPixel * 50;
    const key = getKeyFromCode(this.p5js.keyCode);
    if (key === KeyBoard.LEFT) {
      this.topLeft.x -= delta;
    } else if (key === KeyBoard.UP) {
      this.topLeft.y += delta;
    } else if (key === KeyBoard.RIGHT) {
      this.topLeft.x += delta;
    } else if (key === KeyBoard.DOWN) {
      this.topLeft.y -= delta;
    } else if (key === KeyBoard.R) {
      this.resetFractale();
    } else {
      return;
    }

    this.updateFractale();
  }

  public mousePressed(): void {
    this.draggingPointStart =
      this.p5js.mouseButton === this.p5js.LEFT
        ? { x: this.p5js.mouseX, y: this.p5js.mouseY }
        : undefined;
  }

  public mouseDragged(): void {
    this.p5js.image(this.fractaleImage, 0, 0);

    if (this.draggingPointStart) {
      this.p5js.stroke(255, 0, 0, 255);
      this.p5js.noFill();
      this.p5js.rect(
        this.draggingPointStart.x,
        this.draggingPointStart.y,
        this.p5js.mouseX - this.draggingPointStart.x,
        this.p5js.mouseY - this.draggingPointStart.y
      );
    }
  }

  public mouseReleased(): void {
    if (this.draggingPointStart) {
      const rectWidth = Math.abs(this.p5js.mouseX - this.draggingPointStart.x);
      const rectHeight = Math.abs(this.p5js.mouseY - this.draggingPointStart.y);

      if (rectWidth > MIN_DRAG_RECT_SIDE && rectHeight > MIN_DRAG_RECT_SIDE) {
        // ZOOMING IN
        this.deltaPixel *= Math.max(rectWidth / w, rectHeight / h);
        this.centerOnIngamePoint(
          this.getIngamePoint(
            (this.p5js.mouseX + this.draggingPointStart.x) / 2,
            (this.p5js.mouseY + this.draggingPointStart.y) / 2
          )
        );
        this.updateFractale();
      } else {
        this.p5js.image(this.fractaleImage, 0, 0);
      }
    }
  }

  private resetFractale(): void {
    this.deltaPixel = 1.5 / h;
    this.centerOnIngamePoint({ x: -0.75, y: 0.75 });
    this.updateFractale();
  }

  private updateFractale(): void {
    this.fractaleImage.loadPixels();

    // const black: p5.Color = this.p5js.color(0, 0, 0);
    // const white: p5.Color = this.p5js.color(250, 150, 150);
    for (let i = 0; i < h; i++) {
      for (let j = 0; j < w; j++) {
        const point = this.getIngamePoint(j, i);
        const convergence = this.getConvergenceInfo(
          new Complex(point.x, point.y)
        );
        const endSquareModule = convergence.point.getSquareModule();
        const index = 4 * (j + i * this.p5js.width);
        this.fractaleImage.pixels[index + 0] =
          255 - Math.min(255, (endSquareModule * 240.0) / 4);
        this.fractaleImage.pixels[index + 1] = 0; // angle?
        this.fractaleImage.pixels[index + 2] =
          255 -
          Math.min(
            255,
            (Math.log2(1 + convergence.steps) * 250.0) /
              Math.log2(MAX_ITERATION)
          );
        this.fractaleImage.pixels[index + 3] = 255;
      }
    }

    this.fractaleImage.updatePixels();
    this.p5js.image(this.fractaleImage, 0, 0);
  }

  private centerOnIngamePoint(point: Point): void {
    this.topLeft = {
      x: point.x - this.ingameWidth / 2,
      y: point.y + this.ingameHeight / 2,
    };
  }

  private getIngamePoint(x: number, y: number): Point {
    return {
      x: this.topLeft.x + x * this.deltaPixel,
      y: this.topLeft.y - y * this.deltaPixel,
    };
  }

  private getConvergenceInfo(startingPoint: Complex): Convergence {
    let point = startingPoint;
    for (let iteration = 0; iteration < MAX_ITERATION; iteration++) {
      if (point.getSquareModule() > 4) {
        return { point, steps: iteration };
      }

      const nextPoint = new Complex(
        point.getRe() * point.getRe() -
          point.getIm() * point.getIm() +
          startingPoint.getRe(),
        2 * point.getRe() * point.getIm() + startingPoint.getIm()
      );

      if (point.getSquareDistanceFrom(nextPoint) < MIN_SQUARE_DISTANCE) {
        return { point, steps: iteration };
      }

      point = nextPoint;
    }

    return { point, steps: MAX_ITERATION };
  }
}
