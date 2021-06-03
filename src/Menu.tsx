import * as React from "react";

import { AntGame } from "./cellular-automaton/ant-game";
import { ElementaryRulesGame } from "./cellular-automaton/elementary-rules-game";
import { GameOfLifeGame } from "./cellular-automaton/game-of-life-game";
import { TurmiteGame } from "./cellular-automaton/turmite-game";
import { MandelbrotGame } from "./fractales/mandelbrot/mandelbrot-game";
import { BattleshipGame } from "./games/battleship/battleship-game";
import { MinesweeperGame } from "./games/minesweeper/minesweeper-game";
import { WolfensteinGame } from "./games/ray-casting/wolfenstein-game";
import { SnakeGame } from "./games/snake/snake-game";
import { FourierDrawingGame } from "./maths/fourier-drawing/fourier-drawing-game";
import { FourierSignalGame } from "./maths/fourier-signal/fourier-signal-game";
import { MultiplicationCircleGame } from "./maths/multiplication-circle/multiplication-circle-game";
import { FlockGame } from "./simulations/flock/flock-game";
import { StarsGame } from "./simulations/stars/stars-game";
import { getStrings, LocalizedStrings } from "./strings";

export interface Page {
  name: string;
  route: string;
  component: React.ReactNode;
}

export interface Category {
  name: string;
  pages: Page[];
}

export interface Menu {
  name: string;
  route: string;
  categories: Category[];
}

const strings: LocalizedStrings = getStrings();
const cellularAutomatonPages: Page[] = [
  {
    name: strings.menu.gameOfLife,
    route: "game-of-life",
    component: <GameOfLifeGame />,
  },
  {
    name: strings.menu.elementaryRules,
    route: "elementary-rules",
    component: <ElementaryRulesGame />,
  },
  {
    name: strings.menu.langtonAnt,
    route: "langton-ant",
    component: <AntGame />,
  },
  {
    name: strings.menu.turmite,
    route: "turmite",
    component: <TurmiteGame />,
  },
];
const gamesPages: Page[] = [
  {
    name: strings.menu.minesweeper,
    route: "minesweeper",
    component: <MinesweeperGame />,
  },
  {
    name: strings.menu.snake,
    route: "snake",
    component: <SnakeGame />,
  },
  {
    name: strings.menu.battleship,
    route: "battleship",
    component: <BattleshipGame />,
  },
  {
    name: strings.menu.wolfenstein,
    route: "wolfenstein",
    component: <WolfensteinGame />
  },
];
const simulationsPages: Page[] = [
  {
    name: strings.menu.flock,
    route: "flock",
    component: <FlockGame />,
  },
  {
    name: strings.menu.stars,
    route: "stars",
    component: <StarsGame />,
  },
];
const fractalesPages: Page[] = [
  {
    name: strings.menu.mandelbrot,
    route: "mandelbrot",
    component: <MandelbrotGame />,
  },
  // TODO: MANDELBROT PATH
  // TODO: JULIA SETS
  // TODO: NEWTON
  // TODO: BUDDAHBROT
];
const mathsPages: Page[] = [
  {
    name: strings.menu.fourierSignal,
    route: "fourier-signal",
    component: <FourierSignalGame />,
  },
  {
    name: strings.menu.fourierDrawing,
    route: "fourier-drawing",
    component: <FourierDrawingGame />,
  },
  {
    name: strings.menu.multiplicationCircle,
    route: "multiplication-circle",
    component: <MultiplicationCircleGame />,
  },
  // TODO: SPACE FILLING CURVE (HILBERT)
  // TODO: CIRCLE AND ELIPSE?
];

export const appMenu: Menu = {
  name: strings.menu.cells,
  route: "home",
  categories: [
    {
      name: strings.menu.cellularAutomaton,
      pages: cellularAutomatonPages,
    },
    {
      name: strings.menu.games,
      pages: gamesPages,
    },
    {
      name: strings.menu.simulations,
      pages: simulationsPages,
    },
    {
      name: strings.menu.fractals,
      pages: fractalesPages,
    },
    {
      name: strings.menu.maths,
      pages: mathsPages,
    },
  ],
};

/*
TODO
- artillery game
- math: points on lines: https://www.youtube.com/watch?v=snHKEpCv0Hk

- Ants & Slime: https://www.youtube.com/watch?v=X-iSQQgOd1A

NOTES

// Elementary rules
Rule 90 (Exclusive OR)
Rule 184  (Traffic Flow)
Rule 30 (Conus Textile)

// Turing Machine
* Multiple Ants
(Paterson's Worms)
(Busy Beaver)

// Predator Prey
Hare / Fox / Eagle
Hen / Fox / Viper
Wator (1&2)
CroMagnon

// Others
Turing
Unicolor
Mandala
Sellmen
Daisy World
Lezards

// Balls
Simple
Attraction
Grippe

// Fractal
Mandelbrot
Julia
Bifurcation
Newton

*/
