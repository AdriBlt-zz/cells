import { Complex } from "../../numbers/Complex";
import { ColorationMode } from "../colors/ColorationMode";

export interface FractaleParametersListener {
  updateSize(min: Complex, max: Complex): void;
  updateSquareModuleMax(squareModMax: number): void;
  updateIterationMax(iterMax: number): void;
  updateColorationMode(colorationMode: ColorationMode): void;
  updateAntiAliasing(aa: number): void;
  updateGradientMapCoef(coef: number): void;
}
