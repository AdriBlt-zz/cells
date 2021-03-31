import { color, Color, COLORS } from "../../utils/color";

export const BlackAndWhiteGradient = {
  getColor(coef: number): Color {
    const value = 255 * coef;
    if (value < 0) {
      return COLORS.Black;
    }

    if (value > 255) {
      return COLORS.White;
    }

    return color(value, value, value);
  }
};
