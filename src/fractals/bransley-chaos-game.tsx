import * as React from "react";

import { InfoBox } from "../shared/info-box";
import { ProcessingComponent } from "../shared/processing-component";
import { BransleyChaosGameProps, BransleyChoasGameSketch } from "./bransley-choas-game-sketch";
import { BransleyFernChaosGameProps } from "./bransley-fern-chaos-game-props";
import { SirpienskiChaosGameProps } from "./sirpienski-chaos-game-props";

export class BransleyChaosGame extends ProcessingComponent<
    BransleyChoasGameSketch,
    {},
    { gameProps: BransleyChaosGameProps }
> {
    protected createSketch = (): BransleyChoasGameSketch => {
        return new BransleyChoasGameSketch(this.props.gameProps);
    }

    protected renderCommands(): JSX.Element {
        return <div />;
    }

    protected renderInfoSection(): JSX.Element {
        return (
            <InfoBox title={this.props.gameProps.title}>
                {this.props.gameProps.description}
            </InfoBox>
        );
    }
}

export function BransleyFernGame() {
    return <BransleyChaosGame gameProps={new BransleyFernChaosGameProps()} />;
}

export function SierpinskiChaosGame() {
    return <BransleyChaosGame gameProps={new SirpienskiChaosGameProps()} />;
}
