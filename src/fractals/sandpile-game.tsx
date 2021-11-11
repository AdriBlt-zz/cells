import * as React from "react";

import { ControlBarInput } from "../shared/control-bar-input";
import { ProcessingComponent } from "../shared/processing-component";
import { getStrings, LocalizedStrings } from "../strings";
import { SandpileSketch } from "./sandpile-sketch";

export class SandpileGame extends React.Component
{
    private strings: LocalizedStrings = getStrings();
    private sketch = new SandpileSketch();

    public render() {
        return (
            <ProcessingComponent
                sketch={this.sketch}
                commandsSection={this.renderCommands()}
            />
        );
    }

    private renderCommands(): JSX.Element {
      return (
        <div>
          <ControlBarInput
            strings={this.strings}
            resetCallback={this.sketch.resetGrid}
            playPauseCallback={this.sketch.pause}
            oneStepCallback={this.sketch.playOneStep}
          />
        </div>
      );
    }
}
