import * as React from "react";

import { ProcessingComponent } from "../../shared/processing-component";
import { COLORS } from "../../utils/color";
import { isOutOfBounds } from "../../utils/numbers";
import { createVector, Vector } from "../../utils/vector";
import { CellProperties, RayCastingSketch } from "./ray-casting-sketch";

export interface MazeGameProps {
    fetchMazeData: () => Promise<MazeGameData>;
}

export interface MazeGameData {
    matrix: boolean[][];
    playerInitialPosition: Vector,
    playerInitialDirection: Vector,
}

export class MazeGame extends ProcessingComponent<RayCastingSketch, {}, MazeGameProps> {

    private matrix: boolean[][] | null = null;

    protected createSketch(): RayCastingSketch {
        this.props.fetchMazeData()
            .then((data: MazeGameData) => {
                this.sketch.player.position = data.playerInitialPosition;
                this.sketch.player.direction = data.playerInitialDirection;
                this.matrix = data.matrix;
            });
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
            || isOutOfBounds(i, 0, this.matrix.length)
            || isOutOfBounds(j, 0, this.matrix[0].length)) {
            return { isOutOfBound: true };
        }

        return { color: this.matrix[i][j] ? COLORS.DarkOliveGreen : undefined };
    }
}
