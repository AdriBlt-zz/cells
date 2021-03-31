import * as React from "react";

import { ControlBarInput } from "../shared/control-bar-input";
import { ProcessingComponent } from "../shared/processing-component";
import { CellularAutomatonSketch } from "./cellular-automaton-sketch";
import { TimeDisplay } from "./components/time-display";
import { AutomatonCell } from "./models/AutomatonCell";
import { AutomatonMatrix } from "./models/AutomatonMatrix";
import { AutomatonParameters } from "./models/AutomatonParameters";

export abstract class CellularAutomatonGame<
  Matrix extends AutomatonMatrix<AutomatonCell, AutomatonParameters>,
  State
> extends ProcessingComponent<CellularAutomatonSketch<Matrix>, State> {
  protected abstract getState(param: AutomatonParameters): State;
  protected abstract getCommands(): JSX.Element;

  protected renderCommands(): JSX.Element {
    return (
      <div>
        {this.getCommands()}
        {this.getCommonButtons()}
        <TimeDisplay
          sketch={this.sketch}
          timeLabelFormat={this.strings.shared.timeLabel_format}
        />
      </div>
    );
  }

  protected updateState(): void {
    this.setState(this.getState(this.sketch.matrix.getRules()));
    this.sketch.updateAllCells();
  }

  private getCommonButtons(): JSX.Element {
    return (
      <div>
        <ControlBarInput 
          strings={this.strings}
          resetCallback={this.sketch.resetGrid}
          playPauseCallback={this.sketch.pause}
          oneStepCallback={this.sketch.playOneStep}
          randomCallback={this.sketch.randomizeGrid}
        />
      </div>
    );
  }
}
