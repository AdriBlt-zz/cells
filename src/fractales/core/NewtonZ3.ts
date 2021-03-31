import { Complex } from "../../numbers/Complex";
import { Color, COLORS } from "../../utils/color";
import { ConvergenceStatus } from "./ConvergenceStatus";
import { Fractale } from "./Fractale";
import { FractaleResult } from "./FractaleResult";

export class NewtonZ3 extends Fractale {
  private bassins: Map<Complex, Color>;

  constructor(w: number, h: number) {
    super(w, h);
    this.bassins = new Map<Complex, Color>();
    this.bassins.set(new Complex(1), COLORS.Blue);
    this.bassins.set(Complex.J, COLORS.Green);
    this.bassins.set(Complex.J2, COLORS.Red);
  }

  public setDefaultSize(): void {
    this.resize(-10.0, -10.0, 10.0, 10.0);
  }

  protected setParameters(): void {
    this.setIterMax(1000);
    this.setSquareModMax(4);
    // this.setSquareDistMin(0.00001);
  }

  protected getConvergence(z0: Complex): FractaleResult {
    let z = z0;
    for (let n = 0; n < this.getIterMax(); n++) {
      const zz = this.getIterationComplex(z, z0);
      if (z.getSquareDistanceFrom(zz) === 0.0 || this.bassins.has(z)) {
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
    // Complex zz = z.getCube();
    // zz.setRe((2 * zz.getRe() + 1) / 3);
    // zz.setIm(2 * zz.getIm() / 3);
    // zz = zz.divide(z.getSquare());
    // return zz;

    const x = z.getRe();
    const y = z.getIm();
    const denum = (x * x - y * y) * (x * x - y * y) + 4 * x * x * y * y;
    const re = (x * 2) / 3 + (x * x - y * y) / (3 * denum);
    const im = ((y * 2) / 3) * (1 - x / denum);
    return new Complex(re, im);
  }
}
