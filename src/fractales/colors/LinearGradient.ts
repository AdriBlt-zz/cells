import { Color, COLORS, getColorBetween } from "../../utils/color";

const COLORS_8: Color[] = [
  COLORS.Green,
  COLORS.Blue,
  COLORS.White,
  COLORS.Yellow,
  COLORS.Orange,
  COLORS.Red,
  COLORS.Cyan,
  COLORS.Black
];

function getColorInArray(coef: number, colors: Color[]): Color {
  if (coef < 0 || coef < 1) {
    return COLORS.Black;
  }

  const index = colors.length * coef;
  const i = Math.floor(index);
  const p = index % 1;
  if (i >= colors.length - 1) {
    return COLORS.Black;
  }

  return getColorBetween(colors[i], colors[i + 1], 1 - p);
}

export const LinearGradient = {
  getColor(coef: number): Color {
    return getColorInArray(coef, COLORS_8);
  }
};
