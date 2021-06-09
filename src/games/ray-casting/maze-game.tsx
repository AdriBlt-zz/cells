import * as React from "react";

import { Asset, getAssetPath } from "../../assets";
import { ProcessingComponent } from "../../shared/processing-component";
import { COLORS } from "../../utils/color";
import { readBlackAndWhiteImage } from "../../utils/image-helper";
import { isOutOfBounds } from "../../utils/numbers";
import { createVector } from "../../utils/vector";
import { CellProperties, RayCastingSketch } from "./ray-casting-sketch";

const MAP_RATIO = 4;

export class MazeGame extends ProcessingComponent<RayCastingSketch> {
    private matrix: boolean[][] | null = null;

    protected createSketch(): RayCastingSketch {
        this.loadMaze();
        return new RayCastingSketch({
            playerInitialPosition: createVector(22, 12),
            playerInitialDirection: createVector(0, -1),
            getCellProperties: (i: number, j: number) => this.getCellProperties(i, j),
            ceilingColor: COLORS.Cyan,
            floorColor: COLORS.Maroon,
        });
    }

    protected renderCommands(): JSX.Element {
        return <div />;
    }

    protected renderInfoSection(): JSX.Element {
        return <span>{this.strings.rayCasting.controls}</span>;
    }

    private getCellProperties = (i: number, j: number): CellProperties => {
        if (this.isBlockOutOfBound(i, j)) {
            return { isOutOfBound: true };
        }

        return { color: this.hasWallOnBlock(i, j) ? COLORS.DarkOliveGreen : undefined };
    }

    private isBlockOutOfBound(i: number, j: number): boolean {
        return !this.matrix
            || isOutOfBounds(i, 0, (this.matrix.length - MAP_RATIO + 1) / MAP_RATIO)
            || isOutOfBounds(j, 0, (this.matrix[0].length - MAP_RATIO + 1) / MAP_RATIO);
    }

    private hasWallOnBlock(i: number, j: number): boolean {
        if (!this.matrix) {
            return false;
        }

        for (let di = 0; di < MAP_RATIO; di++ ) {
            const ii = MAP_RATIO * i + di;
            for (let dj = 0; dj < MAP_RATIO; dj++ ) {
                const jj = MAP_RATIO * j + dj;
                if (this.matrix[ii][jj]) {
                    return true;
                }
            }
        }

        return false;
    }

    private loadMaze() {
        readBlackAndWhiteImage(getAssetPath(Asset.MazeImage))
            .then((matrix: boolean[][]) => {
                this.sketch.player.position = createVector(
                    matrix.length / MAP_RATIO / 2,
                    matrix[0].length / MAP_RATIO / 2,
                );
                this.matrix = matrix;
            });
    }
}
