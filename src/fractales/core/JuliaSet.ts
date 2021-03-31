import { Complex } from "../../numbers/Complex";
import { ConvergenceStatus } from "./ConvergenceStatus";
import { Fractale } from "./Fractale";
import { FractaleResult } from "./FractaleResult";

export class JuliaSet extends Fractale {
  private readonly param: Complex;

  constructor(w: number, h: number, c: Complex) {
    super(w, h);
    this.param = c;
  }

  public setDefaultSize(): void {
    this.resize(-1.0, -1.0, 1.0, 1.0);
  }

  protected setParameters(): void {
    this.setIterMax(2000);
    this.setSquareModMax(100);
    // this.setSquareDistMin(0.00001);
  }

  protected getConvergence(z0: Complex): FractaleResult {
    let z = z0;
    for (let n = 0; n < this.getIterMax(); n++) {
      const zz = this.getIterationComplex(z, z0);
      if (zz.getSquareModule() > this.getSquareModMax()) {
        return {
          limit: z,
          numberOfIterations: n,
          status: ConvergenceStatus.DIVERGE,
        };
      }

      if (z.isEqual(zz)) {
        return {
          limit: z,
          numberOfIterations: n,
          status: ConvergenceStatus.CONVERGE,
        };
      }

      z = zz;
    }

    return {
      limit: z,
      numberOfIterations: this.getIterMax(),
      status: ConvergenceStatus.UNKNOWN,
    };
  }

  public getIterationComplex(z: Complex, z0: Complex): Complex {
    return z.getSquare().add(this.getParameter());
  }

  protected getParameter(): Complex {
    return this.param;
  }
}
