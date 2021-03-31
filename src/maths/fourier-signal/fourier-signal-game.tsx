import { observer } from "mobx-react";
import * as React from "react";
import { Button } from "react-bootstrap";

import { NumberInput, NumberInputProps } from "../../shared/number-input";
import { ProcessingComponent } from "../../shared/processing-component";
import { SelectInput, SelectInputProps } from "../../shared/select-input";
import { SignalType } from "../fourier/SignalType";
import {
  FourierSignalSketch,
  MAX_FREQUENCY_COUNT,
} from "./fourier-signal-sketch";

@observer
export class FourierSignalGame extends ProcessingComponent<
  FourierSignalSketch
> {
  protected createSketch(): FourierSignalSketch {
    return new FourierSignalSketch();
  }

  protected renderCommands(): JSX.Element {
    return (
      <div>
        <SelectInput {...this.getSignalTypeProps()} />
        <NumberInput {...this.getFrequencyCountProps()} />
        <Button onClick={() => this.sketch.reset()} block={true}>
          {this.strings.shared.reset}
        </Button>
      </div>
    );
  }

  protected renderInfoSection(): JSX.Element {
    return <div />;
  }

  private getSignalTypeProps = (): SelectInputProps => {
    const options: SignalType[] = [
      SignalType.SQUARE,
      SignalType.SAWTOOTH,
      SignalType.TRIANGLE,
      SignalType.RANDOM,
    ];
    const signalTypeName: { [key in SignalType]: string } = {
      [SignalType.SQUARE]: this.strings.fourierSignal.signalNames.square,
      [SignalType.SAWTOOTH]: this.strings.fourierSignal.signalNames.sawtooth,
      [SignalType.TRIANGLE]: this.strings.fourierSignal.signalNames.triangle,
      [SignalType.RANDOM]: this.strings.fourierSignal.signalNames.random,
    };
    return {
      label: this.strings.fourierSignal.signal,
      options: options.map((type) => signalTypeName[type]),
      selectedOption: signalTypeName[this.sketch.signal.type],
      onOptionChanged: (value: string) => {
        let type: SignalType | undefined;
        for (const option of options) {
          if (signalTypeName[option] === value) {
            type = option;
            break;
          }
        }
        if (type !== undefined && type !== this.sketch.signal.type) {
          this.sketch.changeSignalType(type);
        }
      },
    };
  };

  private getFrequencyCountProps = (): NumberInputProps => {
    return {
      min: 1,
      max: MAX_FREQUENCY_COUNT,
      label: this.strings.fourierSignal.frequency,
      value: this.sketch.numberOfCircles,
      onValueChanged: (value: number) => {
        this.sketch.changeFrequencyCount(value);
      },
    };
  };
}
