import { randomInt } from "../../../utils/random";
import { BaseMazeGenerationAlgorithm } from "../base-maze-generation-algorithm";
import { Cell, Direction, GenerationStatus, MazePath, PathStatus } from "../model";

export class RandomTraversalAlgorithm extends BaseMazeGenerationAlgorithm {
    private pathsToExplore: MazePath[] = [];

    public initialize(): void {
        this.resetPaths();
        this.pathsToExplore = [];
        this.paths.forEach(line => line.forEach(cellPaths => cellPaths.cell.isExplored = false));
        this.exploreCell(this.paths[0][0].cell);
        this.status = GenerationStatus.Ongoing;
    }

    public computeOneStep(): void {
        if (this.pathsToExplore.length === 0) {
            this.status = GenerationStatus.Completed;
            return;
        }

        const index = randomInt(0, this.pathsToExplore.length);
        const exploredPath: MazePath = this.pathsToExplore.splice(index, 1)[0];

        const cell1 = exploredPath.cell;
        const cell2 = this.getDestinationCell(exploredPath);

        if (!cell1 || !cell2) {
            this.status = GenerationStatus.Error;
            console.log("null cell");
            return;
        }

        if (cell1.isExplored && cell2.isExplored) {
            exploredPath.status = PathStatus.Filled;
            this.onUpdatePath(exploredPath);
            return;
        }

        exploredPath.status = PathStatus.Empty;
        this.onUpdatePath(exploredPath);
        this.exploreCell(cell1);
        this.exploreCell(cell2);
    }

    private getDestinationCell(exploredPath: MazePath): Cell | null {
        switch (exploredPath.direction) {
            case Direction.Right:
                if (exploredPath.cell.column < this.width) {
                    return this.paths[exploredPath.cell.row][exploredPath.cell.column + 1].cell;
                }
                break;
            case Direction.Bottom:
                if (exploredPath.cell.row < this.height) {
                    return this.paths[exploredPath.cell.row + 1][exploredPath.cell.column].cell;
                }
                break;
            default:
        }
        return null;
    }

    private exploreCell(cell: Cell): void {
        const i = cell.row;
        const j = cell.column;
        if (cell.isExplored) {
            return;
        }

        cell.isExplored = true;
        this.onUpdateCell(cell);

        if (i > 0 && !this.paths[i - 1][j].cell.isExplored) {
            this.addPathToExplore(this.paths[i - 1][j].bottom);
        }
        if (j > 0 && !this.paths[i][j - 1].cell.isExplored) {
            this.addPathToExplore(this.paths[i][j - 1].right);
        }
        if (i < this.height - 1 && !this.paths[i + 1][j].cell.isExplored) {
            this.addPathToExplore(this.paths[i][j].bottom);
        }
        if (j < this.width - 1 && !this.paths[i][j + 1].cell.isExplored) {
            this.addPathToExplore(this.paths[i][j].right);
        }
    }

    private addPathToExplore(path: MazePath | null): void {
        if (path && path.status === PathStatus.Filled) {
            this.pathsToExplore.push(path);
            path.status = PathStatus.Focused;
            this.onUpdatePath(path);
        }
    }
}