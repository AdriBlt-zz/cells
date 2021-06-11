import * as React from "react";

import { COLORS } from "../../utils/color";
import { isOutOfBounds } from "../../utils/numbers";
import { Vector } from "../../utils/vector";
import { CellProperties, RayCastingGameProps } from "./ray-casting-sketch";
import { RayCastingWalkerGame } from "./ray-casting-walker";

export interface MazeGameData {
    matrix: boolean[][];
    playerInitialPosition: Vector,
    playerInitialDirection: Vector,
}

export interface MazeGameProps {
    fetchMazeData: () => Promise<MazeGameData>;
}

interface MazeGameState {
    rayCastingProperties: RayCastingGameProps | null;
}

export class MazeGame extends React.Component<MazeGameProps, MazeGameState> {
    public state: MazeGameState = { rayCastingProperties: null };
    private matrix: boolean[][] | null = null;

    public componentDidMount() {
        this.props.fetchMazeData()
            .then((data: MazeGameData) => {
                this.matrix = data.matrix;

                this.setState({
                    rayCastingProperties: {
                        playerPosition: data.playerInitialPosition,
                        playerDirection: data.playerInitialDirection,
                        getCellProperties: (i: number, j: number) => this.getCellProperties(i, j),
                        ceilingColor: COLORS.Cyan,
                        floorColor: COLORS.Maroon,
                    }
                });
            });
    }

    public render() {
        return this.state.rayCastingProperties && (<RayCastingWalkerGame {...this.state.rayCastingProperties} />);
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
