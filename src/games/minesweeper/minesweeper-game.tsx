import { observer } from "mobx-react";
import * as React from "react";
import { Button } from "react-bootstrap";

import { CheckboxInput } from "../../shared/checkbox-input";
import { NumberInput, NumberInputProps } from "../../shared/number-input";
import { ProcessingComponent } from "../../shared/processing-component";
import { SelectInput, SelectInputProps } from "../../shared/select-input";
import { pluralizeString } from "../../utils/string-formating-utilities";
import { MinesweeperSketch } from "./minesweeper-sketch";
import { GameStatus } from "./models/game-status";
import { LevelDifficultyConst } from "./models/level-difficulty";

@observer
export class MinesweeperGame extends ProcessingComponent<MinesweeperSketch> {
  protected createSketch(): MinesweeperSketch {
    return new MinesweeperSketch();
  }

  protected renderCommands(): JSX.Element {
    return (
      <div>
        <SelectInput {...this.getDifficultyProps()} />
        <NumberInput {...this.getWidthProps()} />
        <NumberInput {...this.getHeightProps()} />
        <NumberInput {...this.getMinesProps()} />
        <CheckboxInput
          label={this.strings.minesweeper.autoResolve}
          value={this.sketch.isAutoResolve}
          onValueChanged={(v) => this.sketch.setAutoResolve(v)}
        />
        <Button onClick={() => this.sketch.resetGrid()} block={true}>
          {this.strings.shared.newGame}
        </Button>
      </div>
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
        <p
          style={{
            color: this.sketch.remainingMines < 0 ? "red" : "black",
          }}
        >
          <i>
            {pluralizeString(
              this.strings.minesweeper.remainingMines_plural,
              this.sketch.remainingMines
            )}
          </i>
        </p>
        <span>
          <b>{endTextMessage}</b>
        </span>
      </div>
    );
  }

  private getDifficultyProps(): SelectInputProps {
    return {
      label: this.strings.minesweeper.difficulty,
      options: LevelDifficultyConst.values.map((difficulty) => difficulty.name),
      selectedOption: this.sketch.selectedDifficulty.name,
      onOptionChanged: this.onDifficultyChange,
    };
  }

  private getWidthProps(): NumberInputProps {
    return {
      min: LevelDifficultyConst.minSide,
      max: LevelDifficultyConst.maxSide,
      label: this.strings.minesweeper.width,
      value: this.sketch.nbCols,
      onValueChanged: (value) => {
        this.sketch.nbCols = value;
        this.updateMinesAndDifficultyIfNeeded();
      },
    };
  }

  private getHeightProps(): NumberInputProps {
    return {
      min: LevelDifficultyConst.minSide,
      max: LevelDifficultyConst.maxSide,
      label: this.strings.minesweeper.height,
      value: this.sketch.nbRows,
      onValueChanged: (value) => {
        this.sketch.nbRows = value;
        this.updateMinesAndDifficultyIfNeeded();
      },
    };
  }

  private getMinesProps(): NumberInputProps {
    return {
      min: LevelDifficultyConst.minMines,
      max: LevelDifficultyConst.maxMines,
      label: this.strings.minesweeper.mines,
      value: this.sketch.nbMines,
      onValueChanged: (value) => {
        this.sketch.nbMines = value;
        this.updateMinesAndDifficultyIfNeeded();
      },
    };
  }

  private updateMinesAndDifficultyIfNeeded = (): void => {
    const maxMines = this.sketch.nbCols * this.sketch.nbRows - 1;
    if (this.sketch.nbMines > maxMines) {
      this.sketch.nbMines = maxMines;
    }

    this.sketch.findDifficulty();
  };

  private onDifficultyChange = (selectedDifficulty: string): void => {
    const difficulty = LevelDifficultyConst.values.find(
      (value) => value.name === selectedDifficulty
    );
    if (difficulty) {
      this.sketch.changeDifficulty(difficulty);
    }
  };
}
