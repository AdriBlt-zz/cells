import * as p5 from 'p5';

export function setPixel(p5js: p5, image: p5.Image, i: number, j: number, color: p5.Color) {
    const index = 4 * (j + i * p5js.width);
    image.pixels[index + 0] = p5js.red(color);
    image.pixels[index + 1] = p5js.green(color);
    image.pixels[index + 2] = p5js.blue(color);
    image.pixels[index + 3] = p5js.alpha(color);
}