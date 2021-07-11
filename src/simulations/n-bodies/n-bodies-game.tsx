import * as React from "react";

import { ControlBarInput } from "../../shared/control-bar-input";
import { InfoBox } from "../../shared/info-box";
import { ProcessingComponent } from "../../shared/processing-component";
import { SelectInput, SelectInputProps } from "../../shared/select-input";
import { getSolarSystemInfo } from "./models/data";
import { BodyInfo, CameraMode, NBodiesSimulationInputs } from "./models/models";
import { NBodiesSketch } from "./n-bodies-sketch";

interface NBodiesGameProps {
  bodies: BodyInfo[];
  cameraMode: CameraMode;
  selectedBodyIndex: number;
}

export class NBodiesGame extends ProcessingComponent<
  NBodiesSketch,
  NBodiesGameProps
> {
  public state: NBodiesGameProps = {
    bodies: [],
    cameraMode: CameraMode.LockOnBarycenter,
    selectedBodyIndex: 0,
  };

  protected createSketch(): NBodiesSketch {
    getSolarSystemInfo().then(bodies => this.setState({ bodies }, this.sketch.reset));
    return new NBodiesSketch(() => this.simulationInputs);
  }

  protected renderCommands(): JSX.Element {
    return (
      <InfoBox>
        <SelectInput {...this.cameraModeSelectProps()} />
        {this.showSelectedBodyDropdown && (<SelectInput {...this.focusedBodySelectProps()} />)}
        <ControlBarInput
          strings={this.strings}
          resetCallback={this.sketch.reset}
          playPauseCallback={this.sketch.pause}
          oneStepCallback={this.sketch.playOneStep}
          skipFastForwardCallback={this.sketch.skipForward}
        />
        </InfoBox>
    );
  }

  protected renderInfoSection(): JSX.Element {
    return <div />;
  }

  private cameraModeSelectProps(): SelectInputProps {
    return {
      label: this.strings.nBodies.cameraModeSelect,
      options: this.cameraModeValues.map(k => k.name),
      selectedOption: this.cameraModeValues.filter(k => k.type === this.state.cameraMode)[0].name,
      onOptionChanged: (value: string) => {
        this.setState(
          { cameraMode: this.cameraModeValues.filter(k => k.name === value)[0].type },
          () => this.sketch.reset(),
        );
      },
    };
  }

  private focusedBodySelectProps(): SelectInputProps {
    return {
      label: this.strings.nBodies.focusedBodySelect,
      options: this.state.bodies.map(k => k.name),
      selectedOption: this.state.bodies[this.state.selectedBodyIndex].name,
      onOptionChanged: (value: string) => {
        this.setState(
          { selectedBodyIndex: this.state.bodies.map(k => k.name).indexOf(value) },
          () => this.sketch.reset(),
        );
      },
    };
  }

  private get showSelectedBodyDropdown(): boolean {
    return this.state.cameraMode === CameraMode.LockOnBody || this.state.cameraMode === CameraMode.ViewFromBody;
  }

  private get simulationInputs(): NBodiesSimulationInputs {
    return {
      bodies: this.state.bodies,
      viewMode: { type: this.state.cameraMode, bodyIndex: this.state.selectedBodyIndex },
    };
  }

  private get cameraModeValues(): Array<{ type: CameraMode; name: string; }> {
    const strings = this.strings.nBodies.cameraModeNames;
    return [
      { type: CameraMode.Free, name: strings.free },
      { type: CameraMode.LockOnBarycenter, name: strings.lockOnBarycenter },
      { type: CameraMode.LockOnBody, name: strings.lockOnBody },
      { type: CameraMode.ViewFromBarycenter, name: strings.viewFromBarycenter },
      { type: CameraMode.ViewFromBody, name: strings.viewFromBody },
    ];
  }
}
