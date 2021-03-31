import { observer } from "mobx-react";
import * as React from "react";
import { Button } from "react-bootstrap";

import { NumberInput, NumberInputProps } from "../../shared/number-input";
import { ProcessingComponent } from "../../shared/processing-component";
import { MultiplicationCircleSketch } from "./multiplication-circle-sketch";

@observer
export class MultiplicationCircleGame extends ProcessingComponent<
  MultiplicationCircleSketch
> {
  protected createSketch(): MultiplicationCircleSketch {
    return new MultiplicationCircleSketch();
  }

  protected renderCommands(): JSX.Element {
    return (
      <div>
        <NumberInput {...this.getMultiplicatorProps()} />
        <NumberInput {...this.getSpeedProps()} />
        <Button onClick={this.sketch.pause} block={true}>
          {this.strings.shared.playPause}
        </Button>
      </div>
    );
  }

  protected renderInfoSection(): JSX.Element {
    return <div />;
  }

  private getMultiplicatorProps = (): NumberInputProps => {
    return {
      step: this.sketch.multiplicatorIncrement,
      label: this.strings.multiplciationCircle.multiplicator,
      value: this.sketch.multiplicator,
      onValueChanged: (value: number) => {
        this.sketch.setMultiplicatorValue(value);
      },
    };
  };

  private getSpeedProps = (): NumberInputProps => {
    return {
      step: 0.001,
      label: this.strings.multiplciationCircle.speed,
      value: this.sketch.multiplicatorIncrement,
      onValueChanged: (value: number) => {
        this.sketch.multiplicatorIncrement = value;
      },
    };
  };
}
