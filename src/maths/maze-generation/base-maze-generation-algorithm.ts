import { createDefaultMatrix } from "../../utils/list-helpers";
import { Cell, CellPaths, Direction, GenerationStatus, MazeGenerationAlgorithm, MazePath, PathStatus } from "./model";

export abstract class BaseMazeGenerationAlgorithm implements MazeGenerationAlgorithm {
    protected status: GenerationStatus = GenerationStatus.Uninitialized;
    protected paths: CellPaths[][] = [];

    constructor(
        protected width: number,
        protected height: number,
        protected onUpdateCell: (cell: Cell) => void,
        protected onUpdatePath: (path: MazePath) => void,
    ) {
        this.resetPaths();
    }

    public getGenerationStatus(): GenerationStatus {
        return this.status;
    }

    public abstract initialize(): void;

    public abstract computeOneStep(): void;

    protected resetPaths(): void {
        this.paths = createDefaultMatrix(
            this.width,
            this.height,
            (i, j) => {
                const cell: Cell = { row: i, column: j, isExplored: false };
                const right = j === this.width - 1 ? null
                    : { cell, direction: Direction.Right, status: PathStatus.Filled };
                const bottom = i === this.height - 1 ? null
                    : { cell, direction: Direction.Bottom, status: PathStatus.Filled };
                return { cell, right, bottom }
            });
    }
}
