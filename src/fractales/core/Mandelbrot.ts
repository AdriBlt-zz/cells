import { Complex } from "../../numbers/Complex";
import { ColorationMode } from "../colors/ColorationMode";
import { ConvergenceStatus } from "./ConvergenceStatus";
import { Fractale } from "./Fractale";
import { FractaleResult } from "./FractaleResult";

export class Mandelbrot extends Fractale {
  constructor(w: number, h: number) {
    super(w, h);
  }

  public setDefaultSize(): void {
    this.resize(-2.0, -1.0, 1.0, 1.0);
  }

  protected setParameters(): void {
    this.setIterMax(200);
    this.setSquareModMax(400);
    // this.setSquareDistMin(0);
    this.getColorManager().setColorMode(ColorationMode.COLOR_MAP);
  }

  protected getConvergence(z0: Complex): FractaleResult {
    let z = Complex.ZERO;
    for (let n = 0; n < this.getIterMax(); n++) {
      const zz = this.getIterationComplex(z, z0);
      if (z.isEqual(zz)) {
        // if (z.getSquareDistanceFrom(zz) < this.squareDistMin) {
        return {
          limit: z,
          numberOfIterations: n,
          status: ConvergenceStatus.CONVERGE,
        };
      }

      z = zz;
      const module = z.getSquareModule();
      if (module >= this.getSquareModMax()) {
        return {
          limit: z,
          numberOfIterations: n,
          status: ConvergenceStatus.DIVERGE,
        };
      }
    }
    return {
      limit: z,
      numberOfIterations: this.getIterMax(),
      status: ConvergenceStatus.UNKNOWN,
    };
  }

  public getIterationComplex(z: Complex, z0: Complex): Complex {
    return z.getSquare().add(z0);
  }
}
