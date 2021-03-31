import * as React from "react";

import { ProcessingComponent } from "../../shared/processing-component";
import { SnakeSketch } from "./snake-sketch";

export class SnakeGame extends ProcessingComponent<SnakeSketch> {
  protected createSketch(): SnakeSketch {
    return new SnakeSketch();
  }

  protected renderCommands(): JSX.Element {
    return <div />;
  }

  protected renderInfoSection(): JSX.Element {
    return <div />;
  }
}
