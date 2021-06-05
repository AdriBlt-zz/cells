import { Observer } from "mobx-react";
import * as React from "react";

import { ProcessingComponent } from "../../shared/processing-component";
import { StarsSketch } from "./stars-sketch";

// tslint:disable-next-line:no-empty-interface
interface StarsGameState {}

export class StarsGame extends ProcessingComponent<
  StarsSketch,
  StarsGameState
> {
  public state: StarsGameState = {};

  protected createSketch(): StarsSketch {
    return new StarsSketch();
  }

  protected renderCommands(): JSX.Element {
    return <div />;
  }

  protected renderInfoSection(): JSX.Element {
    return (
      <Observer>
        {() => <div>{this.sketch.selectedConstellation}</div>}
      </Observer>
    );
  }
}
