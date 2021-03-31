import { Color, COLORS } from "../../utils/color";
import { ConvergenceStatus } from "../core/ConvergenceStatus";

export const BinaryGradient = {
  getColor(status: ConvergenceStatus): Color {
    switch (status) {
      case ConvergenceStatus.CONVERGE:
      case ConvergenceStatus.UNKNOWN:
        return COLORS.Black;
      case ConvergenceStatus.DIVERGE:
      default:
        return COLORS.White;
    }
  }
};
