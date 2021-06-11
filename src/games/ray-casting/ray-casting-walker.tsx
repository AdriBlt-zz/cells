import * as React from "react";
import { InfoBox } from "src/shared/info-box";

import { ProcessingComponent } from "../../shared/processing-component";
import { MiniMapInfo } from "./mini-map-sketch";
import { RayCastingGameProps, RayCastingSketch } from "./ray-casting-sketch";
import { WalkerMiniMap } from "./walker-mini-map";

export interface RayCastingWalkerGameProps {
    rayCastingProps: RayCastingGameProps;
    miniMapInfo: MiniMapInfo;
}

export class RayCastingWalkerGame extends ProcessingComponent<RayCastingSketch, {}, RayCastingWalkerGameProps> {
    protected createSketch(): RayCastingSketch {
        return new RayCastingSketch(this.props.rayCastingProps);
    }

    protected renderCommands(): JSX.Element {
        return <InfoBox title={this.strings.rayCasting.miniMap} contend={<WalkerMiniMap {...this.props} />} />;
    }

    protected renderInfoSection(): JSX.Element {
        return <InfoBox title={this.strings.shared.controls} contend={this.strings.rayCasting.controls} />;
    }
}
