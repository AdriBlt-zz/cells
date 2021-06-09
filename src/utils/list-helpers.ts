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
