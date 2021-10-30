import * as React from "react";

import { ProcessingComponent } from "../shared/processing-component";
import { BransleyFernSketch } from "./bransley-fern-sketch";

export class BransleyFernGame extends ProcessingComponent<BransleyFernSketch> {
  protected createSketch(): BransleyFernSketch {
    return new BransleyFernSketch();
  }

  protected renderCommands(): JSX.Element {
    return <div />;
  }

  protected renderInfoSection(): JSX.Element {
    return <div />;
  }
}
