import * as React from "react";

import { ProcessingComponent } from "../../shared/processing-component";
import { MiniMapSketch } from "./mini-map-sketch";
import { RayCastingWalkerGameProps } from "./ray-casting-walker";

export class WalkerMiniMap extends ProcessingComponent<MiniMapSketch, {}, RayCastingWalkerGameProps> {
    protected createSketch(): MiniMapSketch {
        return new MiniMapSketch(this.props.rayCastingProps, this.props.miniMapInfo);
    }

    protected renderCommands(): JSX.Element {
        return <div />;
    }

    protected renderInfoSection(): JSX.Element {
        return <div />;
    }
}
