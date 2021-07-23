import * as React from "react";

import { ProcessingComponent } from "../shared/processing-component";
import { FractalSketch } from "./fractal-sketch";
import { BurningShip } from "./models/fractals/burning-ship";

export class BurningShipFractalGame extends ProcessingComponent<FractalSketch> {
  protected createSketch(): FractalSketch {
    return new FractalSketch(new BurningShip());
  }

  protected renderCommands(): JSX.Element {
    return <div />;
  }

  protected renderInfoSection(): JSX.Element {
    return <div />;
  }
}
