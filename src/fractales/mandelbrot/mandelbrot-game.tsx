import * as React from "react";

import { ProcessingComponent } from "../../shared/processing-component";
import { MandelbrotSketch } from "./mandelbrot-sketch";

export class MandelbrotGame extends ProcessingComponent<MandelbrotSketch> {
  protected createSketch(): MandelbrotSketch {
    return new MandelbrotSketch();
  }

  protected renderCommands(): JSX.Element {
    return <div />;
  }

  protected renderInfoSection(): JSX.Element {
    return <div />;
  }
}
