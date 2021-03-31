import { Color, COLORS } from "../../utils/color";
import { BinaryGradient } from "../colors/BinaryGradient";
import { BlackAndWhiteGradient } from "../colors/BlackAndWhiteGradient";
import { ColorationMode } from "../colors/ColorationMode";
import { ColorMapGradient } from "../colors/ColorMapGradient";
import { LinearGradient } from "../colors/LinearGradient";
import { RainbowGradient } from "../colors/RainbowGradient";
import { ConvergenceStatus } from "./ConvergenceStatus";
import { Fractale } from "./Fractale";
import { FractaleResult } from "./FractaleResult";

export class FractaleRenderManager {
  private results: FractaleResult[][][];
  private colorMode: ColorationMode;
  private fractale: Fractale;
  private gradientMapCoef: number;

  constructor(f: Fractale) {
    this.fractale = f;
    this.colorMode = ColorationMode.COLOR_MAP;
    this.gradientMapCoef = 1;
  }

  public getColorMode(): ColorationMode {
    return this.colorMode;
  }

  public setColorMode(colorationMode: ColorationMode): boolean {
    if (colorationMode == null || colorationMode === this.colorMode) {
      return false;
    }

    this.colorMode = colorationMode;
    for (const listener of this.getFractale().getListeners()) {
      listener.updateColorationMode(colorationMode);
    }
    return true;
  }

  public setMapGradientCoef(coef: number): boolean {
    if (coef === this.gradientMapCoef) {
      return false;
    }

    this.gradientMapCoef = coef;
    for (const listener of this.getFractale().getListeners()) {
      listener.updateGradientMapCoef(coef);
    }
    return true;
  }

  public reset(w: number, h: number): void {
    this.results = [];
  }

  public setResult(w: number, h: number, convergence: FractaleResult[]): void {
    this.results[w][h] = convergence;
  }

  /*
	public updateColors(image: BufferedImage ): void {
		for (let w = 0; w < this.results.length; w++) {
			for (let h = 0; h < this.results[w].length; h++) {
				image.setRGB(w, h, this.getColorAA(this.results[w][h]).getRGB());
			}
		}
	}
	*/

  protected getColor(result: FractaleResult): Color {
    if (result != null) {
      switch (result.status) {
        case ConvergenceStatus.CONVERGE:
        case ConvergenceStatus.UNKNOWN:
          return COLORS.Black;
        case ConvergenceStatus.DIVERGE:
        default:
      }

      const delta = 1 - this.getFractale().getModuleLogRatio(result.limit);

      const value = result.numberOfIterations + delta;
      const nbMax = this.getFractale().getIterMax();
      const coef = (1.0 * value) / nbMax;

      switch (this.getColorMode()) {
        case ColorationMode.BLACK_N_WHITE:
          return BlackAndWhiteGradient.getColor(coef);
        case ColorationMode.RAINBOW:
          return RainbowGradient.getColor(coef);
        case ColorationMode.LINEAR_GRADIENT:
          return LinearGradient.getColor(coef);
        case ColorationMode.BINARY:
          return BinaryGradient.getColor(result.status);
        case ColorationMode.COLOR_MAP:
          return ColorMapGradient.getColor(value, this.gradientMapCoef);
        default:
      }
    }

    return COLORS.White;
  }

  public getGradientMapCoef(): number {
    return this.gradientMapCoef;
  }

  public getResults() {
    return this.results;
  }

  public getFractale() {
    return this.fractale;
  }

  /*
	private getColorAA(listeResults: FractaleResult[]): Color {
		let r = 0;
		let g = 0;
		let b = 0;
		for (const result of listeResults) {
			const c = this.getColor(result);
			r += c.r;
			g += c.g;
			b += c.b;
		}
		if (listeResults.length > 0) {
			r /= listeResults.length;
			g /= listeResults.length;
			b /= listeResults.length;
		}
		return color(r, g, b);
	}
	*/
}
