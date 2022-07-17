import * as p5 from "p5";

import { Color, COLORS } from "../../utils/color";
import { createDefaultList } from "../../utils/list-helpers";
import { getHexagonImage, getSquareImage } from "../../utils/shape-drawer-helpers";

export interface Tile {
    image: p5.Image | p5.Element;
    // color scheme in each direction (UP then clockwise)
    sockets: string[];
}

export interface WaveFunctionCollapseProps {
    isHexaGrid: boolean;
    tiles: Tile[];
    hasMatchingSockets: (socket: string, socketList: string[]) => boolean;
}

export function getPlainTilesWFCProps(
    p5js: p5,
    isHexaGrid: boolean,
    cellSize: number,
    strokeColor: Color,
    strokeWeight: number,
  ): WaveFunctionCollapseProps {
    const nbNeighbours = isHexaGrid ? 6 : 4;
    const COMPATIBLE_LIST = ["W", "S", "G", "T"];
    const areCompatibleSockets = (s1: string, s2: string) => {
      return Math.abs(COMPATIBLE_LIST.indexOf(s1) - COMPATIBLE_LIST.indexOf(s2)) < 2;
    }
    const hasMatchingSockets = (socket: string, socketList: string[]): boolean => {
      // return socketList.includes(reverseString(socket));
      return socketList.some(s => areCompatibleSockets(socket, s));
    }
    const createTileColor = (color: Color) =>  isHexaGrid
      ? getHexagonImage(p5js, cellSize, color, strokeColor, strokeWeight)
      : getSquareImage(p5js, cellSize, color, strokeColor, strokeWeight);
    const createTile = (color: Color, socket: string) => ({
      image: createTileColor(color),
      sockets: createDefaultList(nbNeighbours, () => socket),
    });
    return {
      isHexaGrid,
      tiles: [
        createTile(COLORS.Blue, "W"), // Water
        createTile(COLORS.Yellow, "S"), // SAND
        createTile(COLORS.LightGreen, "G"), // GRASS
        createTile(COLORS.DarkGreen, "T"), // TREE
      ],
      hasMatchingSockets
    };
}
