import * as React from "react";

import { ProcessingComponent } from "../../shared/processing-component";
import { RayCastingGameProps, RayCastingSketch } from "./ray-casting-sketch";

export class RayCastingWalkerGame extends ProcessingComponent<RayCastingSketch, {}, RayCastingGameProps> {
    protected createSketch(): RayCastingSketch {
        return new RayCastingSketch(this.props);
    }

    protected renderCommands(): JSX.Element {
        return <div />;
    }

    protected renderInfoSection(): JSX.Element {
        return <span>{this.strings.rayCasting.controls}</span>;
    }
}
