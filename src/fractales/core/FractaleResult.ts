import { Complex } from "../../numbers/Complex";
import { ConvergenceStatus } from "./ConvergenceStatus";

export interface FractaleResult {
  limit: Complex;
  numberOfIterations: number;
  status: ConvergenceStatus;
}
