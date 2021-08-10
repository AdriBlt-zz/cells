import * as React from "react";

import { CheckboxInput } from "../../shared/checkbox-input";
import { ControlBarInput } from "../../shared/control-bar-input";
import { ProcessingComponent } from "../../shared/processing-component";
import { VoronoiSketch } from "./voronoi-sketch";

interface VoronoiState {
  showVoronoiCells: boolean;
  showDelaunayTriangulation: boolean;
}
export class VoronoiGame extends ProcessingComponent<VoronoiSketch, VoronoiState> {
  public state: VoronoiState = {
    showVoronoiCells: true,
    showDelaunayTriangulation: false,
  };

  protected createSketch(): VoronoiSketch {
    return new VoronoiSketch();
  }

  protected renderCommands(): JSX.Element {
    return <div>
      <CheckboxInput
        label={this.strings.voronoi.showVoronoi}
        value={this.state.showVoronoiCells}
        onValueChanged={value => this.setState(
          { showVoronoiCells: value },
          () => this.sketch.setShowVoronoiCells(value))}
      />
      <CheckboxInput
        label={this.strings.voronoi.showDelaunay}
        value={this.state.showDelaunayTriangulation}
        onValueChanged={value => this.setState(
          { showDelaunayTriangulation: value },
          () => this.sketch.setShowDelaunayTriangulation(value))}
      />
      <ControlBarInput
        strings={this.strings}
        playPauseCallback={this.sketch.pause}
      />
    </div>;
  }

  protected renderInfoSection(): JSX.Element {
    return <div />;
  }
}
