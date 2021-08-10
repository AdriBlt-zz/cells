const strings = {
  menu: {
    cells: "Cells",
    games: "Games",
    minesweeper: "Minesweeper",
    snake: "Snake",
    battleship: "Battleship",
    simulations: "Simulations",
    flock: "Boids Flock",
    fractals: "Fractals",
    mandelbrot: "Mandelbrot",
    juliaSet: "Julia Set",
    newton: "Newton",
    burningShip: "Burning Ship (WIP)",
    maths: "Maths",
    fourierSignal: "Fourier Signal",
    fourierDrawing: "Fourier Drawing",
    multiplicationCircle: "Multiplication Circle",
    cellularAutomaton: "Cellular Automatons",
    gameOfLife: "Game of Life",
    elementaryRules: "Elementary Rules",
    langtonAnt: "Langton's Ant",
    turmite: "Turmite",
    stars: "Night Sky Stars",
    wolfenstein: "Wolfenstein",
    alixMaze: "Alix's Maze",
    mazeGeneration: "Maze Generation",
    generatedMaze: "Generated Maze",
    nBodiesSimulation: "n Bodies simulation",
    mazes: "Mazes",
    voronoi: "Voronoï cells",
    bezier: "Bézier curves",
    curvedPolygon: "Curved Polygons",
  },
  minesweeper: {
    difficulty: "Difficulty",
    width: "Width",
    height: "Height",
    mines: "Mines",
    autoResolve: "Auto-resolve",
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
  multiplicationCircle: {
    multiplicator: "Multiplicator",
    speed: "Speed",
  },
  gameOfLife: {
    mode: "Mode",
    burning: "Burning",
    burningTooltip:
      "Add a transient state where cells that have just died cannot be directly reborn. [Colors: Alive(B) Burning(R)]",
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
  rayCasting: {
    controls: "Arrows to move, shift to run.",
    miniMap: "Mini-map (only if you're stuck!)"
  },
  mazeGeneration: {
    infoTitle: "Algorithm description",
    algorithm: {
      randomTraversal: "Random Traversal",
      kruskal: "Kruskal",
      randomizedPrim: "Randomized Prim",
      depthExploration: "Depth Exploration",
      recursiveSubdivision: "Recursive Subdivision",
      wilson: "Wilson",
    },
    description: {
      randomTraversal: "Randomly explores one path (in red) around the maze.",
      kruskal: "Randomly selects two adjacent cells and add the path between them to the maze if there is not yet one that connects them.",
      randomizedPrim: "Explores paths (in red) around the maze, in order of their weight, that has been randomly computed.",
      depthExploration: "Explores the maze from the last explored cell, then backtracks when stuck.",
      recursiveSubdivision: "Splits the empty maze in four, with three openings connecting the sections, then repeat the process in each section.",
      wilson: "Initializes the maze as one cell, then grows a line that randomly searches for the maze. If the line loops back on itself, it cuts the loop.",
    },
  },
  nBodies: {
    cameraModeSelect: 'Camera mode',
    focusedBodySelect: 'Focused body',
    cameraModeNames: {
      free: 'Free' ,
      lockOnBarycenter: 'Lock On Barycenter' ,
      lockOnBody: 'Lock On Body' ,
      viewFromBarycenter: 'View From Barycenter' ,
      viewFromBody: 'View From Body',
    }
  },
  newtonFractal: {
    unityRootPolynom: "Unity root polynom",
    degree: "Degree",
  },
  juliaSetFractal: {
    parameter: "Parameter",
  },
  voronoi: {
    showVoronoi: "Show Voronoï cells",
    showDelaunay: "Show Delaunay triangulation",
  },
  shared: {
    newGame: "New Game (R)",
    playPause: "Play/Pause",
    oneStep: "One Step",
    reset: "Reset",
    randomize: "Randomize",
    victory: "VICTORY!!!",
    failure: "LO-OO-SER!!!",
    timeLabel_format: "Step: {0}",
    skipForward: "Skip forward",
    controls: "Controls",
  },
};

export type LocalizedStrings = typeof strings;

export function getStrings(): LocalizedStrings {
  return strings;
}
