import * as React from "react";
import { Asset, getAssetPath } from "../../assets";
import { ProcessingComponent } from "../../shared/processing-component";
import { COLORS } from "../../utils/color";
import { readBlackAndWhiteImage } from "../../utils/image-helper";
import { isOutOfBounds } from "../../utils/numbers";
import { createVector } from "../../utils/vector";
import { CellProperties, RayCastingSketch } from "./ray-casting-sketch";

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
        if (!this.matrix
            || isOutOfBounds(i, 0, (this.matrix.length - 2) / 3)
            || isOutOfBounds(j, 0, (this.matrix[0].length - 2) / 3)) {
            return { isOutOfBound: true };
        }

        return {
            color: this.matrix[3 * i][3 * j] 
            || this.matrix[3 * i + 1][3 * j] 
            || this.matrix[3 * i + 2][3 * j] 
            || this.matrix[3 * i][3 * j + 1] 
            || this.matrix[3 * i + 1][3 * j + 1] 
            || this.matrix[3 * i + 2][3 * j + 1] 
            || this.matrix[3 * i][3 * j + 2] 
            || this.matrix[3 * i + 1][3 * j + 2] 
            || this.matrix[3 * i + 2][3 * j + 2] 
            ? COLORS.DarkOliveGreen
            : undefined,
        };
    }

    private loadMaze() {
        readBlackAndWhiteImage(getAssetPath(Asset.MazeImage))
            .then((matrix: boolean[][]) => {
                this.sketch.player.position = createVector(
                    matrix.length / 6,
                    matrix[0].length / 6,
                );
                this.matrix = matrix;
            });
    }
}
