import * as React from "react";

import { ProcessingComponent } from "../../shared/processing-component";
import { BezierSketch } from "./bezier-sketch";

export class BezierGame extends ProcessingComponent<BezierSketch> {
  protected createSketch(): BezierSketch {
    return new BezierSketch();
  }

  protected renderCommands(): JSX.Element {
    return <div />;
  }

  protected renderInfoSection(): JSX.Element {
    return <div />;
  }
}
