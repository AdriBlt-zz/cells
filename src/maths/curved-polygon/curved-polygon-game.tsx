import * as React from "react";

import { ProcessingComponent } from "../../shared/processing-component";
import { CurvedPolygonSketch } from "./curved-polygon-sketch";

export class CurvedPolygonGame extends ProcessingComponent<CurvedPolygonSketch> {
  protected createSketch = (): CurvedPolygonSketch => {
    return new CurvedPolygonSketch();
  }

  protected renderCommands(): JSX.Element {
    return <div/>;
  }

  protected renderInfoSection(): JSX.Element {
    return <div />;
  }
}
