import { Point } from "./points";

export function getNeighbourCells(
    x: number,
    y: number,
    isHexa: boolean
): Point[] {
    const neighbours: Point[] = [];
    for (let dX = -1; dX <= 1; dX++) {
        for (let dY = -1; dY <= 1; dY++) {
            if (dX === 0 && dY === 0) {
                continue;
            }
            if (isHexa && dX !== 0 && dY === (x % 2 === 0 ? 1 : -1)) {
                continue;
            }

            neighbours.push({ x: x + dX, y: y + dY });
        }
    }

    return neighbours;
}
