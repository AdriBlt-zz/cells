export interface Cell {
    row: number;
    column: number;
    isExplored: boolean;
}

export enum Direction {
    Right,
    Bottom,
}

export enum PathStatus {
    Filled,
    Focused,
    Empty,
}

export interface MazePath {
    cell: Cell;
    direction: Direction;
    status: PathStatus;
}

export interface CellPaths {
    cell: Cell;
    right: MazePath | null;
    bottom: MazePath | null;
};

export enum GenerationStatus {
    Uninitialized,
    Ongoing,
    Completed,
    Error,
}

export interface MazeGenerationAlgorithm {
    getGenerationStatus(): GenerationStatus;
    initialize(): void;
    computeOneStep(): void;
}
