const strings = {
  menu: {
    cells: "Cells",
    games: "Games",
    minesweeper: "Minesweeper",
    snake: "Snake",
    battleship: "Battleship",
    simulations: "Simulations",
    flock: "Boids Flock",
    fractales: "Fractales",
    mandelbrot: "Mandelbrot",
    maths: "Maths",
    fourierSignal: "Fourier Signal",
    fourierDrawing: "Fourier Drawing",
    multiplicationCircle: "Multiplication Circle",
    celullarAutomaton: "Cellular Automatons",
    gameOfLife: "Game of Life",
    elementaryRules: "Elementary Rules",
    langtonAnt: "Langton's Ant",
    turmite: "Turmite",
    stars: "Night Sky Stars",
  },
  minesweeper: {
    difficulty: "Difficulty",
    width: "Width",
    height: "Height",
    mines: "Mines",
    autoresolve: "Auto-resolve",
    remainingMines_plural:
      "(inf--1){Too many mines};(0-1){{0} remaining mine};(2-inf){{0} remaining mines};",
  },
  flock: {
    cohesion: "Cohesion Weight",
    alignment: "Alignment Weight",
    separation: "Separation Weight",
  },
  fourierSignal: {
    signalNames: {
      square: "Square",
      sawtooth: "Saw Tooth",
      triangle: "Triangle",
      random: "Random (WIP)",
    },
    signal: "Signal",
    frequency: "Frequency count",
  },
  fourierDrawing: {
    numberOfCircles: "Frequency count",
    showOriginal: "Show original shape",
  },
  multiplciationCircle: {
    multiplicator: "Multiplicator",
    speed: "Speed",
  },
  gameOfLife: {
    mode: "Mode",
    burning: "Burning",
    burningTooltip:
      "Add a transiant state where cells that have just died cannot be directly reborn. [Colors: Alive(B) Burning(R)]",
    colors: "Colors",
    colorsTooltip: "Green=Newborn Blue=Alive Red=Dying Yellow=Ephemeral",
    borders: "Border cells",
    bornConditions: "Born conditions",
    liveConditions: "Live conditions",
    hexGrid: "Hexagonal grid",
    tips: "Right click to immune cells.",
  },
  elementaryRules: {
    ruleNumber: "Rule number",
    tips:
      "The new lines are created based of the T-shaped binary logic rules. Change the rule by clicking on the bottom cells.",
  },
  ant: {
    colors: "Number of colors",
    tips:
      "Click above on the colored cells to change whether the ant turns right or left on them.",
    left: "L",
    right: "R",
  },
  turmite: {
    tips:
      "For each cases (turmite and cell status), set the next cell state, turmite direction and turmite state. (N= no turn, R = turn right, U = U-turn, L = turn left)",
    ruleSpiralGrowth: "Spiral Growth",
    ruleChaoticHighway: "Chaotic Highway",
    ruleChaoticGrowth: "Chaotic Growth",
    ruleFramedGrowth: "Framed Growth",
    ruleFibonacciSpiral: "Fibonacci Spiral",
    ruleSnowflakeFractal: "Snowflake fractal",
    ruleCustom: "Custom",
    ruleSelector: "Rule",
    threeStateLabel: "3 states Turmite",
    threeStateTooltip: "Whether the turmite has 2 or 3 different states",
  },
  shared: {
    newgame: "New Game (R)",
    playPause: "Play/Pause",
    oneStep: "One Step",
    reset: "Reset",
    randomize: "Randomize",
    victory: "VICTORY!!!",
    failure: "LO-OO-SER!!!",
    timeLabel_format: "Step: {0}",
  },
};

export type LocalizedStrings = typeof strings;

export function getStrings(): LocalizedStrings {
  return strings;
}
