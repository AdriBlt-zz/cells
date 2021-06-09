import * as React from "react";
import { ControlBarInput } from "src/shared/control-bar-input";

import { ProcessingComponent } from "../../shared/processing-component";
import { MazeGenerationSketch } from "./maze-generation-sketch";

export class MazeGenerationGame extends ProcessingComponent<MazeGenerationSketch> {

    protected createSketch(): MazeGenerationSketch {
        return new MazeGenerationSketch();
    }

    protected renderCommands(): JSX.Element {
        return (
            <div>
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
}
