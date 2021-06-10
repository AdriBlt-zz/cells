import * as React from "react";
import { ControlBarInput } from "src/shared/control-bar-input";
import { SelectInput, SelectInputProps } from "src/shared/select-input";

import { ProcessingComponent } from "../../shared/processing-component";
import { MazeAlgorithmType, MazeGenerationSketch } from "./maze-generation-sketch";

interface MazeGenerationGameState {
    selectedAlgorithmIndex: number;
}

const ALGORITHM_LIST: Array<{ type: MazeAlgorithmType; name: string; }> = [
    { type: MazeAlgorithmType.RandomTraversal, name: "Random Traversal" },
    { type: MazeAlgorithmType.Kruskal, name: "Kruskal" },
    { type: MazeAlgorithmType.RandomizedPrim, name: "Randomized Prim" },
    { type: MazeAlgorithmType.DepthExploration, name: "Depth Exploration" },
    { type: MazeAlgorithmType.RecursiveSubdivision, name: "Recursive Subdivision" },
    { type: MazeAlgorithmType.Wilson, name: "Wilson" },
];
const DEFAULT_ALGORITHM_INDEX = 4;

export class MazeGenerationGame extends ProcessingComponent<MazeGenerationSketch, MazeGenerationGameState> {
    public state: MazeGenerationGameState = { selectedAlgorithmIndex: DEFAULT_ALGORITHM_INDEX };

    protected createSketch(): MazeGenerationSketch {
        return new MazeGenerationSketch(ALGORITHM_LIST[DEFAULT_ALGORITHM_INDEX].type);
    }

    protected renderCommands(): JSX.Element {
        return (
            <div>
                <SelectInput {...this.getAlgorithmProps()} />
                <ControlBarInput
                    strings={this.strings}
                    resetCallback={this.sketch.reset}
                    playPauseCallback={this.sketch.togglePlayPause}
                    oneStepCallback={this.sketch.playOneStep}
                    skipFastForwardCallback={this.sketch.skipGeneration}
                />
            </div>
        );
    }

    protected renderInfoSection(): JSX.Element {
        return <div />;
    }

    private getAlgorithmProps(): SelectInputProps {
      return {
        label: 'Algorithm',
        options: ALGORITHM_LIST.map((algorithm) => algorithm.name),
        selectedOption: ALGORITHM_LIST[this.state.selectedAlgorithmIndex].name,
        onOptionChanged: (selectedAlgorithm: string) => {
            const index = ALGORITHM_LIST.findIndex((a) => a.name === selectedAlgorithm);
            if (index >= 0) {
                const algorithm = ALGORITHM_LIST[index];
                this.sketch.setAlgorithmType(algorithm.type);
                this.setState({ selectedAlgorithmIndex: index });
          }
        },
      };
    }
}
