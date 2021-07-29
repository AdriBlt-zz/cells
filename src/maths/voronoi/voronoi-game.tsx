import * as React from "react";

import { ProcessingComponent } from "../../shared/processing-component";
import { VoronoiSketch } from "./voronoi-sketch";

export class VoronoiGame extends ProcessingComponent<VoronoiSketch> {
  protected createSketch(): VoronoiSketch {
    return new VoronoiSketch();
  }

  protected renderCommands(): JSX.Element {
    return <div />;
  }

  protected renderInfoSection(): JSX.Element {
    return <div />;
  }
}
