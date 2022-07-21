import { reverseString } from "../../../utils/string";
import { TileSetBuilder, WaveFunctionCollapseProps } from "../wave-function-collapse-models";

export function getCircuitTilesProps(): WaveFunctionCollapseProps {
  const tileSet = TileSetBuilder();
  // Green, Lime, White, Black
  tileSet.addTile('circuit/bridge', [ 'GLG', 'GWG', 'GLG', 'GWG' ], 2);
  tileSet.addTile('circuit/component', [ 'B', 'B', 'B', 'B' ], 1);
  tileSet.addTile('circuit/connection', [ 'GLG', 'GGB', 'B', 'BGG' ], 4);
  tileSet.addTile('circuit/corner', [ 'G', 'G', 'GGB', 'BGG' ], 4);
  tileSet.addTile('circuit/dskew', [ 'GLG', 'GLG', 'GLG', 'GLG' ], 2);
  tileSet.addTile('circuit/skew', [ 'GLG', 'GLG', 'G', 'G' ], 4);
  tileSet.addTile('circuit/substrate', [ 'G', 'G', 'G', 'G' ], 1);
  tileSet.addTile('circuit/t', [ 'G', 'GLG', 'GLG', 'GLG' ], 4);
  tileSet.addTile('circuit/track', [ 'GLG', 'G', 'GLG', 'G' ], 2);
  tileSet.addTile('circuit/transition', [ 'GWG', 'G', 'GLG', 'G' ], 4);
  tileSet.addTile('circuit/turn', [ 'GLG', 'GLG', 'G', 'G' ], 4);
  tileSet.addTile('circuit/viad', [ 'G', 'GLG', 'G', 'GLG' ], 2);
  tileSet.addTile('circuit/vias', [ 'GLG', 'G', 'G', 'G' ], 4);
  tileSet.addTile('circuit/wire', [ 'G', 'GWG', 'G', 'GWG' ], 2);
  return {
    isHexaGrid: false,
    areCompatibleSockets: (s1, s2) => s1 === reverseString(s2),
    tiles: tileSet.getTiles(),
  };
}