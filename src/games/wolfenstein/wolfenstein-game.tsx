import * as React from "react";

import { ProcessingComponent } from "../../shared/processing-component";
import { WolfensteinSketch } from "./wolfenstein-sketch";

// tslint:disable-next-line:no-empty-interface
interface WolfensteinGameState {}

export class WolfensteinGame extends ProcessingComponent<
    WolfensteinSketch,
    WolfensteinGameState
> {
    protected createSketch(): WolfensteinSketch {
        return new WolfensteinSketch();
    }

    protected renderCommands(): JSX.Element {
        return <div />;
    }

    protected renderInfoSection(): JSX.Element {
        return <div />;
    }
}
