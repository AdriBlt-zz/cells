import { Complex } from "../../numbers/Complex";
import { Polynom } from "../../numbers/Polynom";
import { Color } from "../../utils/color";
import { ColorSet } from "../colors/ColorSet";
import { ConvergenceStatus } from "./ConvergenceStatus";
import { Fractale } from "./Fractale";
import { FractaleRenderManager } from "./FractaleRenderManager";
import { NewtonRenderManager } from "./NewtonRenderManager";
import { NewtonResult } from "./NewtonResult";

export class Newton extends Fractale {
  private bassins: Map<Complex, Color>;
  private polynom: Polynom;
  private derive: Polynom;

  constructor(w: number, h: number, p: Polynom) {
    super(w, h);
    this.bassins = new Map<Complex, Color>();
    this.polynom = p;
    if (p == null) {
      throw new Error("Polynome null.");
    }

    this.derive = p.derive();
    const roots = this.polynom.getRoots();
    if (roots == null) {
      throw new Error("Polynome de degre trop grand.");
    }

    const distinctRoots: Complex[] = [];
    roots.forEach((c) => {
      if (distinctRoots.indexOf(c) < 0) {
        distinctRoots.push(c);
      }
    });
    const colors = ColorSet.getDifferentColors(distinctRoots.length);
    let k = 0;
    for (const c of distinctRoots) {
      this.bassins.set(c, colors[k++]);
    }
  }

  protected getRenderManager(): FractaleRenderManager {
    return new NewtonRenderManager(this);
  }

  public setDefaultSize(): void {
    this.resize(-10.0, -10.0, 10.0, 10.0);
  }

  public setParameters(): void {
    this.setIterMax(1000);
    this.setSquareModMax(0);
    // this.setSquareDistMin(0.00001);
  }

  public getConvergence(z0: Complex): NewtonResult {
    let z = z0;
    let sqModMax = z.getSquareModule();
    for (let n = 0; n < this.getIterMax(); n++) {
      const zz = this.getIterationComplex(z, z0);

      if (zz === null) {
        return {
          limit: z,
          numberOfIterations: n,
          status: ConvergenceStatus.DIVERGE,
          squareModuleMax: sqModMax,
        };
      }

      const sqMod = zz.getModule();
      if (sqMod > sqModMax) {
        sqModMax = sqMod;
      }

      if (z.isEqual(zz) || this.bassins.has(z)) {
        return {
          limit: z,
          numberOfIterations: n,
          status: ConvergenceStatus.CONVERGE,
          squareModuleMax: sqModMax,
        };
      }

      z = zz;
    }

    return {
      limit: z,
      numberOfIterations: this.getIterMax(),
      status: ConvergenceStatus.UNKNOWN,
      squareModuleMax: sqModMax,
    };
  }

  public getIterationComplex(z: Complex, z0: Complex): Complex | null {
    const value = this.polynom.getValue(z);
    const deriveVal = this.derive.getValue(z);

    if (value.isNul()) {
      return z;
    }

    if (deriveVal.isNul()) {
      return null;
    }

    return z.minus(value.divide(deriveVal));
  }

  public getColors(): Map<Complex, Color> {
    return this.bassins;
  }
}
