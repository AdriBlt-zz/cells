import * as React from "react";

import { AntGame } from "./cellular-automaton/ant-game";
import { ElementaryRulesGame } from "./cellular-automaton/elementary-rules-game";
import { GameOfLifeGame } from "./cellular-automaton/game-of-life-game";
import { TurmiteGame } from "./cellular-automaton/turmite-game";
import { BurningShipFractalGame } from "./fractals/burning-ship-fractal-game";
import { JuliaSetFractalGame } from "./fractals/julia-set-fractal-game";
import { MandelbrotFractalGame } from "./fractals/mandelbrot-fractal-game";
import { NewtonFractalGame } from "./fractals/newton-fractal-game";
import { BattleshipGame } from "./games/battleship/battleship-game";
import { MinesweeperGame } from "./games/minesweeper/minesweeper-game";
import { SnakeGame } from "./games/snake/snake-game";
import { BezierGame } from "./maths/bezier/bezier-game";
import { FourierDrawingGame } from "./maths/fourier-drawing/fourier-drawing-game";
import { FourierSignalGame } from "./maths/fourier-signal/fourier-signal-game";
import { MultiplicationCircleGame } from "./maths/multiplication-circle/multiplication-circle-game";
import { VoronoiGame } from "./maths/voronoi/voronoi-game";
import { MazeGenerationGame } from "./mazes/maze-generation/maze-generation-game";
import { AlixMazeGame } from "./mazes/ray-casting/alix-maze-game";
import { GeneratedMazeGame } from "./mazes/ray-casting/generated-maze-game";
import { WolfensteinGame } from "./mazes/ray-casting/wolfenstein-game";
import { FlockGame } from "./simulations/flock/flock-game";
import { NBodiesGame } from "./simulations/n-bodies/n-bodies-game";
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
  {
    name: strings.menu.nBodiesSimulation,
    route: "n-bodies",
    component: <NBodiesGame />,
  },
];
const fractalesPages: Page[] = [
  {
    name: strings.menu.mandelbrot,
    route: "mandelbrot",
    component: <MandelbrotFractalGame />,
  },
  {
    name: strings.menu.juliaSet,
    route: "julia-set",
    component: <JuliaSetFractalGame />,
  },
  {
    name:  strings.menu.newton,
    route: "newton",
    component: <NewtonFractalGame />,
  },
  {
    name: strings.menu.burningShip,
    route: "burning-ship",
    component: <BurningShipFractalGame />,
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
  {
    name: strings.menu.voronoi,
    route: 'voronoi',
    component: <VoronoiGame />,
  },
  {
    name: strings.menu.bezier,
    route: 'bezier',
    component: <BezierGame />,
  },
  // TODO: SPACE FILLING CURVE (HILBERT)
  // TODO: CIRCLE AND ELIPSE?
];
const mazesPages: Page[] = [
  {
    name: strings.menu.wolfenstein,
    route: "wolfenstein",
    component: <WolfensteinGame />
  },
  {
    name: strings.menu.alixMaze,
    route: "alix-maze",
    component: <AlixMazeGame />
  },
  {
    name: strings.menu.mazeGeneration,
    route: 'maze-generation',
    component: <MazeGenerationGame />,
  },
  {
    name: strings.menu.generatedMaze,
    route: "generated-maze",
    component: <GeneratedMazeGame />
  },
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
    {
      name: strings.menu.mazes,
      pages: mazesPages,
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

/**
 * TODO
 * voronoi
 * ant paths
 */