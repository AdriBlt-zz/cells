import * as React from "react";

import { ProcessingComponent } from "../shared/processing-component";
import { FractalSketch } from "./fractal-sketch";
import { MandelbrotFractal } from "./models/fractals/mandelbrot";

export class MandelbrotFractalGame extends ProcessingComponent<FractalSketch> {
  protected createSketch = (): FractalSketch => {
    return new FractalSketch(new MandelbrotFractal());
  }

  protected renderCommands(): JSX.Element {
    return <div />;
  }

  protected renderInfoSection(): JSX.Element {
    return <div />;
  }
}
