import * as React from "react";

import { ControlBarInput } from "../../shared/control-bar-input";
import { InfoBox } from "../../shared/info-box";
import { NumberInput } from "../../shared/number-input";
import { ProcessingComponent } from "../../shared/processing-component";
import { getSolarSystemData } from "./models/data";
import { BodyInfo } from "./models/models";
import { NBodiesSketch } from "./n-bodies-sketch";

interface NBodiesGameState {
  bodies: BodyInfo[];
}

export class NBodiesGame extends ProcessingComponent<
  NBodiesSketch,
  NBodiesGameState
> {
  public state: NBodiesGameState = {
    bodies: getSolarSystemData(),
  };

  protected createSketch(): NBodiesSketch {
    return new NBodiesSketch(() => this.state.bodies);
  }

  protected renderCommands(): JSX.Element {
    return (
      <div>
        {this.getBodyEditorBox("Sun", this.state.bodies[0])}
        {this.getBodyEditorBox("Earth", this.state.bodies[1])}
        {this.getBodyEditorBox("Moon", this.state.bodies[2])}
        <ControlBarInput
          strings={this.strings}
          resetCallback={this.sketch.reset}
          playPauseCallback={this.sketch.pause}
          oneStepCallback={this.sketch.playOneStep}
        />
        </div>
    );
  }

  protected renderInfoSection(): JSX.Element {
    return <div />;
  }

  private getBodyEditorBox(name: string, body: BodyInfo):  JSX.Element {
    return (
      <InfoBox title={name} collapsibleProps={{ isOpenAtStart: false }}>
        <NumberInput label='m' value={body.mass} onValueChanged={(value) => { body.mass = value; this.update(); } } />
        <NumberInput label='r' value={body.radius} onValueChanged={(value) => { body.radius = value; this.update(); } } />
        <NumberInput label='x' value={body.initialPosition.x} onValueChanged={(value) => { body.initialPosition.x = value; this.update(); } } />
        <NumberInput label='y' value={body.initialPosition.y} onValueChanged={(value) => { body.initialPosition.y = value; this.update(); } } />
        <NumberInput label='vx' value={body.initialSpeed.x} onValueChanged={(value) => { body.initialSpeed.x = value; this.update(); } } />
        <NumberInput label='vx' value={body.initialSpeed.y} onValueChanged={(value) => { body.initialSpeed.y = value; this.update(); } } />
      </InfoBox>
    );
  }

  private update = () => {
    this.setState({ bodies: this.state.bodies });
    this.sketch.reset();
  }
}
