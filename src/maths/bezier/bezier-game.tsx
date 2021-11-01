import * as React from "react";

import { ControlBarInput } from "../../shared/control-bar-input";
import { ProcessingComponent } from "../../shared/processing-component";
import { BezierSketch } from "./bezier-sketch";

export class BezierGame extends ProcessingComponent<BezierSketch> {
  protected createSketch = (): BezierSketch => {
    return new BezierSketch();
  }

  protected renderCommands(): JSX.Element {
    return <div>
      <ControlBarInput
        strings={this.strings}
        resetCallback={this.sketch.restart}
        playPauseCallback={this.sketch.pause}
        oneStepCallback={this.sketch.playOneStep}
      />
    </div>;
  }

  protected renderInfoSection(): JSX.Element {
    return <div />;
  }
}
