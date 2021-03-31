import { observer } from "mobx-react";
import * as React from "react";
import { Button } from "react-bootstrap";

import { ProcessingComponent } from "../../shared/processing-component";
import { BattleshipSketch } from "./battleship-sketch";
import { GameStatus } from "./models/game-status";

@observer
export class BattleshipGame extends ProcessingComponent<BattleshipSketch> {
  protected createSketch(): BattleshipSketch {
    return new BattleshipSketch();
  }

  protected renderCommands(): JSX.Element {
    return (
      <Button onClick={this.sketch.resetGrid} block={true}>
        {this.strings.shared.newgame}
      </Button>
    );
  }

  protected renderInfoSection(): JSX.Element {
    const endTextMessage =
      this.sketch.gameStatus === GameStatus.Victory
        ? this.strings.shared.victory
        : this.sketch.gameStatus === GameStatus.Failure
        ? this.strings.shared.failure
        : "";
    return (
      <div>
        <span>
          <b>{endTextMessage}</b>
        </span>
      </div>
    );
  }
}
