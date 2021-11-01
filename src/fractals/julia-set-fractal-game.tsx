import * as React from "react";

import { InfoBox } from "../shared/info-box";
import { ProcessingComponent } from "../shared/processing-component";
import { SelectInput, SelectInputProps } from "../shared/select-input";
import { FractalSketch } from "./fractal-sketch";
import { JuliaSet } from "./models/fractals/julia-set";
import { JuliaComplex, JuliaSetComplexes, JuliaSetValues } from "./models/fractals/julia-set-complexes";

interface JuliaSetGameState {
  parameter: JuliaComplex;
}

const DefaultParameter = JuliaSetComplexes.I;

export class JuliaSetFractalGame extends ProcessingComponent<FractalSketch, JuliaSetGameState > {
  public state = {
    parameter: DefaultParameter,
  }

  protected createSketch = (): FractalSketch => {
    return new FractalSketch(new JuliaSet(DefaultParameter.complex));
  }

  protected renderCommands(): JSX.Element {
    return <InfoBox>
      <SelectInput {...this.parameterInputProps()} />
    </InfoBox>;
  }

  protected renderInfoSection(): JSX.Element {
    return <div />;
  }

  private parameterInputProps(): SelectInputProps<JuliaComplex> {
    return {
      label: this.strings.juliaSetFractal.parameter,
      options: JuliaSetValues,
      selectedOption: this.state.parameter,
      onOptionChanged: param => {
        this.setState(
          { parameter: param },
          () => this.sketch.setFractal(new JuliaSet(this.state.parameter.complex)))
        },
        getName: param => param.name,
      };
  }
}
