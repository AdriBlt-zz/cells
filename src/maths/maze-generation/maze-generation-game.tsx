import * as React from "react";

import { ControlBarInput } from "../../shared/control-bar-input";
import { InfoBox } from "../../shared/info-box";
import { ProcessingComponent } from "../../shared/processing-component";
import { SelectInput, SelectInputProps } from "../../shared/select-input";
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
const DEFAULT_ALGORITHM_INDEX = 0;

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
        const description = this.getDescription();
        return description ? (<InfoBox title={this.strings.mazeGeneration.infoTitle}>{description}</InfoBox>) : <div/> ;
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

    private getDescription(): string |  null {
        switch (ALGORITHM_LIST[this.state.selectedAlgorithmIndex].type) {
            case MazeAlgorithmType.RecursiveSubdivision:
                return this.strings.mazeGeneration.description.recursiveSubdivision;
            case MazeAlgorithmType.DepthExploration:
                return this.strings.mazeGeneration.description.depthExploration;
            case MazeAlgorithmType.Kruskal:
                return this.strings.mazeGeneration.description.kruskal;
            case MazeAlgorithmType.RandomTraversal:
                return this.strings.mazeGeneration.description.randomTraversal;
            case MazeAlgorithmType.RandomizedPrim:
                return this.strings.mazeGeneration.description.randomizedPrim;
            case MazeAlgorithmType.Wilson:
                return this.strings.mazeGeneration.description.wilson;
            default:
                return null;
        }
    }
}
