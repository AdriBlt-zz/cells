import { Color, color, getColorBetween } from "../../utils/color";

// Position = 0.0 Color = (0, 7, 100)
// Position = 0.16 Color = (32, 107, 203)
// Position = 0.42 Color = (237, 255, 255)
// Position = 0.6425 Color = (255, 170, 0)
// Position = 0.8575 Color = (0, 2, 0)

const COLOR_MAP: Color[] = [
  color(66, 30, 15), // brown 3
  color(25, 7, 26), // dark violett
  color(9, 1, 47), // darkest blue
  color(4, 4, 73), // blue 5
  color(0, 7, 100), // blue 4
  color(12, 44, 138), // blue 3
  color(24, 82, 177), // blue 2
  color(57, 125, 209), // blue 1
  color(134, 181, 229), // blue 0
  color(211, 236, 248), // lightest blue
  color(241, 233, 191), // lightest yellow
  color(248, 201, 95), // light yellow
  color(255, 170, 0), // dirty yellow
  color(204, 128, 0), // brown 0
  color(153, 87, 0), // brown 1
  color(106, 52, 3) // brown 2
];

export const ColorMapGradient = {
  getColor(coef: number, sizeInterColor: number): Color {
    const sizeColorMap = COLOR_MAP.length * sizeInterColor;
    const value = (coef % sizeColorMap) / sizeInterColor;
    const index = Math.floor(value);
    const nextIndex = (index + 1) % COLOR_MAP.length;
    const start = COLOR_MAP[index];
    const end = COLOR_MAP[nextIndex];
    const p = value - index;
    return getColorBetween(start, end, p);
  }
};
