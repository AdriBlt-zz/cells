import { observer } from "mobx-react";
import * as React from "react";

import { InfoBox } from "../../shared/info-box";
import { NumberInput, NumberInputProps } from "../../shared/number-input";
import { ProcessingComponent } from "../../shared/processing-component";
import { RosesSketch } from "./roses-sketch";

@observer
export class RosesGame extends ProcessingComponent<RosesSketch> {
  protected createSketch(): RosesSketch {
    return new RosesSketch();
  }

  protected renderCommands(): JSX.Element {
    return (
      <div>
        <NumberInput {...this.getNumeratorProps()} />
        <NumberInput {...this.getDenominatorProps()} />
      </div>
    );
  }

  protected renderInfoSection(): JSX.Element {
    const strings = this.strings.roses;
    return (
      <InfoBox>
        {strings.description1}
        <br/>
        {strings.description2}
        <hr/>
        <i>{strings.controls}</i>
      </InfoBox>
    );
  }

  private getNumeratorProps = (): NumberInputProps => {
    return {
      min: 1,
      step: 1,
      label: this.strings.roses.numerator,
      value: this.sketch.coefNumerator,
      onValueChanged: this.sketch.setNumerator,
    };
  };

  private getDenominatorProps = (): NumberInputProps => {
    return {
      min: 1,
      step: 1,
      label: this.strings.roses.denominator,
      value: this.sketch.coefDenominator,
      onValueChanged: this.sketch.setDenominator,
    };
  };
}
