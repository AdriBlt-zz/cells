import { Point } from "./points";

// If isHexa, return all 6 direct neighbours
// If not, return all 8 neighbours (direct + corners)
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

// Return cells in order: UP, then clockwise
// If isHexa, return all 6 direct neighbours
// If not, return all 4 direct neighbours
export function getDirectNeighboursInOrder(
    x: number,
    y: number,
    isHexa: boolean
): Point[] {
    const neighbours = [
        { x, y: y - 1 }, // NORTH
        { x: x + 1, y }, // EAST
        { x, y: y + 1 }, // SOUTH
        { x: x - 1, y }, // WEST
    ];

    if (!isHexa) {
        return neighbours;
    }

    if (x % 2 === 0) {
        neighbours.splice(1, 0, { x: x + 1, y: y - 1 });
        neighbours.splice(5, 0, { x: x - 1, y: y - 1 });
    } else {
        neighbours.splice(2, 0, { x: x + 1, y: y + 1 });
        neighbours.splice(4, 0, { x: x - 1, y: y + 1 });
    }

    return neighbours;
}
