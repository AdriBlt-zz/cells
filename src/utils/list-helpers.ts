import { randomInt } from "./random";

export function shuffleList<T>(list: T[]): void {
    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = list[i];
        list[i] = list[j];
        list[j] = tmp;
    }
}

export function createDefaultMatrix<T>(width: number, height: number, getDefaultValue: (i: number, j: number) => T): T[][] {
    const matrix: T[][] = [];
    for (let i = 0; i < height; i++) {
        const line: T[] = [];
        for (let j = 0; j < width; j++) {
            line.push(getDefaultValue(i, j));
        }
        matrix.push(line);
    }
    return matrix;
}

export function removeRandomElement<T>(list: T[]): T {
    const index = randomInt(0, list.length);
    return list.splice(index, 1)[0];
}

export function peekRandomElement<T>(list: T[]): T {
    const index = randomInt(0, list.length);
    return list[index];
}

export function peekLast<T>(list: T[]): T {
    return list[list.length - 1];
}

export function addIfNotNull<T>(list: T[], element: T | null): boolean {
    if (!element) {
        return false;
    }

    list.push(element);
    return true;
}
