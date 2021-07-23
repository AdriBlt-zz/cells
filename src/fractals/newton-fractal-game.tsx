import * as React from "react";

import { getUnityRootsPolynom } from "../numbers/PolynomHelpers";
import { InfoBox } from "../shared/info-box";
import { NumberInput, NumberInputProps } from "../shared/number-input";
import { ProcessingComponent } from "../shared/processing-component";
import { FractalSketch } from "./fractal-sketch";
import { Newton } from "./models/fractals/newton";

interface NewtonFractalGameState {
  unityRootPolynomDegree: number
}

const DefaultPolygonDegree = 3;

export class NewtonFractalGame extends ProcessingComponent<FractalSketch, NewtonFractalGameState> {
  public state: NewtonFractalGameState = { unityRootPolynomDegree: DefaultPolygonDegree };

  protected createSketch(): FractalSketch {
    return new FractalSketch(new Newton(getUnityRootsPolynom(DefaultPolygonDegree)));
  }

  protected renderCommands(): JSX.Element {
    return <InfoBox title="Unity root polynom">
      <NumberInput {...this.unityRootPolynomDegreeInputProps()} />
    </InfoBox>;
  }

  protected renderInfoSection(): JSX.Element {
    return <div />;
  }

  private unityRootPolynomDegreeInputProps(): NumberInputProps {
    return {
      label: "Degree",
      value: this.state.unityRootPolynomDegree,
      min: 1,
      onValueChanged: value => this.setState(
        { unityRootPolynomDegree: value },
        () => this.sketch.setFractal(new Newton(getUnityRootsPolynom(this.state.unityRootPolynomDegree))))
    };
  }
}