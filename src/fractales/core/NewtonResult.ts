import { FractaleResult } from "./FractaleResult";

export interface NewtonResult extends FractaleResult {
  squareModuleMax: number;
}

export function isNewtonResult(result: FractaleResult): result is NewtonResult {
  return "squareModuleMax" in result;
}
