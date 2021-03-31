import { Complex } from "../../numbers/Complex";
import { FractaleParametersListener } from "./FractaleParametersListener";
import { FractaleRenderManager } from "./FractaleRenderManager";
import { FractaleResult } from "./FractaleResult";

export enum Directions {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export abstract class Fractale {
  private min: Complex;
  private max: Complex;
  private width: number;
  private height: number;
  private iterMax: number;
  private squareModMax: number;
  // private squareDistMin: number;
  private render: FractaleRenderManager;
  private parametersListeners: FractaleParametersListener[];
  private antiAliasing = 1;
  private sizeAA = 1;
  private squareDimension: number;

  constructor(w: number, h: number) {
    this.width = w;
    this.height = h;
    this.render = this.getRenderManager();
    this.parametersListeners = [];
    this.setParameters();
    this.setDefaultSize();
    this.checkScales();
  }

  protected getRenderManager(): FractaleRenderManager {
    return new FractaleRenderManager(this);
  }

  public abstract setDefaultSize(): void;

  protected abstract setParameters(): void;

  public updateSizePanneau(w: number, h: number): void {
    if (this.width === h && this.height === h) {
      return;
    }
    this.width = w;
    this.height = h;
    this.checkScales();
  }

  public checkScales(): void {
    const deltaX = this.max.getRe() - this.min.getRe();
    const deltaY = this.max.getIm() - this.min.getIm();
    const coefLargeur = this.width / deltaX;
    const coefHauteur = this.height / deltaY;
    let flag = false;

    if (coefLargeur > coefHauteur) {
      const newDeltaX = this.width / coefHauteur;
      const marge = (newDeltaX - deltaX) / 2;
      this.min = this.min.addRe(-marge);
      this.max = this.max.addRe(marge);
      flag = true;
    }

    if (coefLargeur < coefHauteur) {
      const newDeltaY = this.height / coefLargeur;
      const marge = (newDeltaY - deltaY) / 2;
      this.min = this.min.addIm(-marge);
      this.max = this.max.addIm(marge);
      flag = true;
    }

    if (flag) {
      for (const listener of this.parametersListeners) {
        listener.updateSize(this.min, this.max);
      }
    }

    this.squareDimension =
      (this.getXmax() - this.getXmin()) * (this.getYmax() - this.getYmin());
  }

  public abstract getIterationComplex(z: Complex, z0: Complex): Complex | null;

  protected abstract getConvergence(z0: Complex): FractaleResult;

  protected getResultats(
    c: Complex,
    deltaX: number,
    deltaY: number
  ): FractaleResult[] {
    const res: FractaleResult[] = [];
    let k = 0;
    let x: number;
    let y: number;
    for (let i = 0; i < this.antiAliasing; i++) {
      x = c.getRe() + (i * deltaX) / this.sizeAA;
      for (let j = 0; j < this.antiAliasing; j++) {
        y = c.getIm() + (j * deltaY) / this.sizeAA;
        res[k++] = this.getConvergence(new Complex(x, y));
      }
    }

    return res;
  }

  public getModuleLogRatio(c: Complex): number {
    if (c == null) {
      return 0;
    }

    const delta =
      Math.log(
        Math.log(c.getSquareModule()) / Math.log(this.getSquareModMax())
      ) / Math.log(2);
    if (delta < 0) {
      return 0;
    }

    if (delta > 1) {
      return 1;
    }

    return delta;
  }

  public getXmin(): number {
    return this.min.getRe();
  }

  public getXmax(): number {
    return this.max.getRe();
  }

  public getYmin(): number {
    return this.min.getIm();
  }

  public getYmax(): number {
    return this.max.getIm();
  }

  public getIterMax(): number {
    return this.iterMax;
  }

  public getSquareModMax(): number {
    return this.squareModMax;
  }

  // public double getSquareDistMin() {
  // return this.squareDistMin;
  // }

  // public void setSquareDistMin(const squareDistanceMin) {
  // this.squareDistMin = squareDistanceMin;
  // }

  public resize(
    xMin: number,
    xMax: number,
    yMin: number,
    yMax: number
  ): boolean {
    const cMin = new Complex(xMin, yMin);
    const cMax = new Complex(xMax, yMax);
    if (
      this.min != null &&
      this.max != null &&
      this.min.isEqual(cMin) &&
      this.max.isEqual(cMax)
    ) {
      return false;
    }

    this.min = cMin;
    this.max = cMax;
    for (const listener of this.parametersListeners) {
      listener.updateSize(this.min, this.max);
    }

    return true;
  }

  public setSquareModMax(squareModuleMax: number): boolean {
    if (squareModuleMax === this.squareModMax) {
      return false;
    }

    this.squareModMax = squareModuleMax;
    for (const listener of this.parametersListeners) {
      listener.updateSquareModuleMax(this.squareModMax);
    }

    return true;
  }

  public setIterMax(iterationMax: number): boolean {
    if (this.iterMax === iterationMax) {
      return false;
    }

    this.iterMax = iterationMax;
    for (const listener of this.parametersListeners) {
      listener.updateIterationMax(this.iterMax);
    }
    return true;
  }

  public addParametersListener(listener: FractaleParametersListener): void {
    if (listener != null) {
      this.parametersListeners.push(listener);
      listener.updateSize(this.min, this.max);
      listener.updateIterationMax(this.iterMax);
      listener.updateSquareModuleMax(this.squareModMax);
      listener.updateAntiAliasing(this.antiAliasing);
      listener.updateColorationMode(this.render.getColorMode());
      listener.updateGradientMapCoef(this.render.getGradientMapCoef());
    }
  }

  public updateFractale(): void {
    this.updateSizePanneau(this.width, this.height);
    const x0 = this.getXmin();
    const y0 = this.getYmin();
    const deltaX = (this.getXmax() - x0) / this.width;
    const deltaY = (this.getYmax() - y0) / this.height;
    this.render.reset(this.width, this.height);

    for (let w = 0; w < this.getWidth(); w++) {
      const x = x0 + w * deltaX;
      for (let h = 0; h < this.getHeight(); h++) {
        const y = y0 + h * deltaY;
        const c = new Complex(x, y);
        this.getColorManager().setResult(
          w,
          h,
          this.getResultats(c, deltaX, deltaY)
        );
      }
    }
  }

  public getColorManager(): FractaleRenderManager {
    return this.render;
  }

  public move(dir: Directions): void {
    let dirXW = 0;
    let dirYH = 0;
    switch (dir) {
      case Directions.DOWN:
        dirYH = 1;
        break;
      case Directions.LEFT:
        dirXW = -1;
        break;
      case Directions.RIGHT:
        dirXW = 1;
        break;
      case Directions.UP:
        dirYH = -1;
        break;
      default:
        break;
    }

    const moveX = (dirXW * (this.getXmax() - this.getXmin())) / 3;
    const moveY = (dirYH * (this.getYmax() - this.getYmin())) / 3;
    this.resize(
      this.getXmin() + moveX,
      this.getXmax() + moveX,
      this.getYmin() + moveY,
      this.getYmax() + moveY
    );

    const deltaW = (dirXW * this.width) / 3;
    const deltaH = (dirYH * this.height) / 3;
    const results: FractaleResult[][][] = this.render.getResults();
    this.render.reset(this.getWidth(), this.getHeight());
    const x0 = this.getXmin();
    const y0 = this.getYmin();
    const deltaX = (this.getXmax() - x0) / this.width;
    const deltaY = (this.getYmax() - y0) / this.height;

    for (let w = 0; w < this.getWidth(); w++) {
      const x = x0 + w * deltaX;
      for (let h = 0; h < this.getHeight(); h++) {
        if (
          isBetween(0, w + deltaW, this.getWidth()) &&
          isBetween(0, h + deltaH, this.getHeight())
        ) {
          const result = results[w + deltaW][h + deltaH];
          this.getColorManager().setResult(w, h, result);
        } else {
          const y = y0 + h * deltaY;
          const c = new Complex(x, y);
          const result = this.getResultats(c, deltaX, deltaY);
          this.getColorManager().setResult(w, h, result);
        }
      }
    }
  }

  public getListeners(): FractaleParametersListener[] {
    return this.parametersListeners;
  }

  public setAntiAliasing(aa: number): boolean {
    if (this.antiAliasing === aa) {
      return false;
    }

    this.antiAliasing = aa;
    this.sizeAA = aa * aa;
    for (const listener of this.parametersListeners) {
      listener.updateAntiAliasing(aa);
    }

    return true;
  }

  public getWidth() {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }

  public getSquareDimension(): number {
    return this.squareDimension;
  }
}

function isBetween(min: number, val: number, max: number): boolean {
  return min <= val && val < max;
}
