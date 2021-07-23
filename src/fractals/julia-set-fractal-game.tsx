import * as React from "react";

import { ProcessingComponent } from "../shared/processing-component";
import { FractalSketch } from "./fractal-sketch";
import { JuliaSet } from "./models/fractals/julia-set";
import { JuliaSetComplexes } from "./models/fractals/julia-set-complexes";

export class JuliaSetFractalGame extends ProcessingComponent<FractalSketch> {
  protected createSketch(): FractalSketch {
    return new FractalSketch(new JuliaSet(JuliaSetComplexes.I.complex));
  }

  protected renderCommands(): JSX.Element {
    return <div />;
  }

  protected renderInfoSection(): JSX.Element {
    return <div />;
  }
}
