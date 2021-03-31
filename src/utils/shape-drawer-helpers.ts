import * as p5 from "p5";

export function drawArrow(
  p5js: p5,
  x: number,
  y: number,
  angle: number,
  cellSize: number,
  marginLeft: number = 0,
  marginTop: number = 0
): void {
  const margin = 2;
  const halfX = cellSize / 2;
  const halfY = cellSize / 2;
  const centerX = marginLeft + x * cellSize + halfX;
  const centerY = marginTop + y * cellSize + halfY;

  const headX = centerX + Math.cos(angle) * (halfX - margin);
  const headY = centerY - Math.sin(angle) * (halfY - margin);
  const leftX = centerX + (Math.cos(angle + (2 * Math.PI) / 3) * halfX) / 2;
  const leftY = centerY - (Math.sin(angle + (2 * Math.PI) / 3) * halfY) / 2;
  const rightX = centerX + (Math.cos(angle - (2 * Math.PI) / 3) * halfX) / 2;
  const rightY = centerY - (Math.sin(angle - (2 * Math.PI) / 3) * halfY) / 2;

  p5js.beginShape();
  p5js.vertex(headX, headY);
  p5js.vertex(leftX, leftY);
  p5js.vertex(rightX, rightY);
  p5js.endShape();
}

export function drawCircle(
  p5js: p5,
  x: number,
  y: number,
  cellSize: number,
  marginLeft: number = 0,
  marginTop: number = 0
): void {
  const margin = 2;
  p5js.ellipse(
    marginLeft + x * cellSize + cellSize / 2,
    marginTop + y * cellSize + cellSize / 2,
    cellSize - 2 * margin
  );
}

export function drawSquare(
  p5js: p5,
  x: number,
  y: number,
  cellSize: number,
  marginLeft: number = 0,
  marginTop: number = 0
): void {
  p5js.rect(
    marginLeft + x * cellSize,
    marginTop + y * cellSize,
    cellSize,
    cellSize
  );
}

export function drawText(
  p5js: p5,
  x: number,
  y: number,
  text: string,
  cellSize: number,
  marginLeft: number = 0,
  marginTop: number = 0,
  padding: number = 4
): void {
  p5js.text(
    text,
    x * cellSize + padding + marginLeft,
    (y + 1) * cellSize - padding + marginTop
  );
}

export function drawHexagon(
  p5js: p5,
  x: number,
  y: number,
  cellSize: number,
  marginLeft: number = 0,
  marginTop: number = 0
): void {
  const side = cellSize / Math.sqrt(3);
  const delta = cellSize / Math.sqrt(12);
  const left = marginLeft + x * (side + delta);
  let top = marginTop + y * cellSize;

  if (x % 2 === 1) {
    top += cellSize / 2;
  }

  p5js.beginShape();
  p5js.vertex(left + delta, top);
  p5js.vertex(left + delta + side, top);
  p5js.vertex(left + side + 2 * delta, top + cellSize / 2);
  p5js.vertex(left + delta + side, top + cellSize);
  p5js.vertex(left + delta, top + cellSize);
  p5js.vertex(left, top + cellSize / 2);
  p5js.endShape();
}
