import { color, Color } from "../../utils/color";

export const RainbowGradient = {
  getColor(coef: number): Color {
    const x = Math.floor(1530 * coef);
    let red: number;
    let green: number;
    let blue: number;
    if (x < 0) {
      red = 0;
      green = 0;
      blue = 0;
    } else if (x < 255) {
      red = 255;
      green = x;
      blue = 0;
    } else if (x < 510) {
      red = 510 - x;
      green = 255;
      blue = 0;
    } else if (x < 765) {
      red = 0;
      green = 255;
      blue = x - 510;
    } else if (x < 1020) {
      red = 0;
      green = 1020 - x;
      blue = 255;
    } else if (x < 1275) {
      red = x - 1020;
      green = 0;
      blue = 0;
    } else if (x < 1530) {
      red = 255;
      green = x - 1275; // 0;
      blue = 255; // 1530 - x;
    } else {
      red = 255;
      green = 255; // 0;
      blue = 255; // 0;
    }

    return color(red, green, blue);
  }
};
