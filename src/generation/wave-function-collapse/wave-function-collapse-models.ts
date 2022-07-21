import * as p5 from "p5";
import { Color } from "src/utils/color";

import { Asset, getAssetPath } from "../../assets";
import { formatString } from "../../utils/string-formating-utilities";

export interface Tile {
    color?: Color;
    image?: { id: string; rotate?: number };
    // color scheme in each direction (UP then clockwise)
    // TODO: bug it is actually the reverse of this: LEFT, then anticlockwise
    sockets: string[];
}

export interface WaveFunctionCollapseProps {
    isHexaGrid: boolean;
    tiles: Tile[];
    hasMatchingSockets: (socket: string, socketList: string[]) => boolean;
}

const tilesMap = [
    { category: 'castle', tiles: ['bridge', 'ground', 'river', 'riverturn', 'road', 'roadturn', 't', 'tower', 'wall', 'wallriver', 'wallroad'] },
    { category: 'circles', tiles: ['b_half', 'b_i', 'b_quarter', 'b', 'w_half', 'w_i', 'w_quarter', 'w'] },
    { category: 'circuit', tiles: ['bridge', 'component', 'connection', 'corner', 'dskew', 'skew', 'substrate', 't', 'track', 'transition', 'turn', 'viad', 'vias', 'wire'] },
    { category: 'floorPlan', tiles: ['div', 'divt', 'divturn', 'door', 'empty', 'floor', 'glass', 'halfglass', 'in', 'out', 'stairs', 'table', 'vent', 'w', 'wall', 'walldiv', 'window'] },
    { category: 'knots', tiles: ['corner', 'cross', 'empty', 'line', 't'] },
    { category: 'rooms', tiles: ['bend', 'corner', 'corridor', 'door', 'empty', 'side', 't', 'turn', 'wall'] },
    { category: 'summer', tiles: ['cliff 0', 'cliff 1', 'cliff 2', 'cliff 3', 'cliffcorner 0', 'cliffcorner 1', 'cliffcorner 2', 'cliffcorner 3', 'cliffcorner 0', 'cliffcorner 1', 'cliffcorner 2', 'cliffcorner 3', 'cliffturn 0', 'cliffturn 1', 'cliffturn 2', 'cliffturn 3', 'grass 0', 'grasscorner 0', 'grasscorner 1', 'grasscorner 2', 'grasscorner 3', 'road 0', 'road 1', 'road 2', 'road 3', 'roadturn 0', 'roadturn 1', 'roadturn 2', 'roadturn 3', 'water_a 0', 'water_b 0', 'water_c 0', 'watercorner 0', 'watercorner 1', 'watercorner 2', 'watercorner 3', 'waterside 0', 'waterside 1', 'waterside 2', 'waterside 3', 'waterturn 0', 'waterturn 1', 'waterturn 2', 'waterturn 3'] },
];
export function loadTiles(p5js: p5): { [key: string]: p5.Image } {
    const images: { [key: string]: p5.Image } = {};
    const pathFormat = getAssetPath(Asset.WaveFunctionCollapseFormat);
    tilesMap.forEach(template => {
        template.tiles.forEach(tile => {
            images[`${template.category}/${tile}`] = p5js.loadImage(formatString(pathFormat, template.category, tile));
        });
    });
    return images;
}

export function rotateTile(tile: Tile): Tile {
    const sockets: string[] = [tile.sockets[tile.sockets.length - 1]];
    for (let i = 0; i < tile.sockets.length - 1; i++) {
        sockets.push(tile.sockets[i]);
    }

    if (!tile.image) {
        return { color: tile.color, sockets };
    }

    return {
        image: {
            id: tile.image.id,
            rotate: 1 + (tile.image.rotate || 0),
        },
        sockets
    };
}

export function rotateImage(p5js: p5, image: p5.Image, rotateQuarter: number = 0): p5.Graphics {
    const graphics = p5js.createGraphics(image.width, image.height);
    graphics.imageMode(p5js.CENTER);
    graphics.translate(image.width / 2, image.height / 2);
    graphics.rotate((rotateQuarter) * p5js.HALF_PI);
    graphics.image(image, 0, 0);
    return graphics;
}
