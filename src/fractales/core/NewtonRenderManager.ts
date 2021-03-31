import { Color, COLORS, getColorBetween } from "../../utils/color";
import { Fractale } from "./Fractale";
import { FractaleRenderManager } from "./FractaleRenderManager";
import { FractaleResult } from "./FractaleResult";
import { Newton } from "./Newton";
import { isNewtonResult, NewtonResult } from "./NewtonResult";

export class NewtonRenderManager extends FractaleRenderManager {
  constructor(f: Fractale) {
    super(f);
  }

  protected getColor(result: FractaleResult): Color {
    if (this.getFractale() instanceof Newton && isNewtonResult(result)) {
      const c = (this.getFractale() as Newton).getColors().get(result.limit);
      if (c != null) {
        const p = 1 - 0.1 * this.getCoef(result);
        return getColorBetween(COLORS.White, c, p);
      }
    }

    return COLORS.White;
  }

  private getCoef(result: NewtonResult): number {
    const dim = this.getFractale().getSquareDimension();
    const delta =
      (1.0 * result.numberOfIterations) / this.getFractale().getIterMax() +
      result.squareModuleMax / dim;

    if (delta > 1) {
      return 1;
    }
    if (delta < 0) {
      return 0;
    }
    return delta;
  }
}
