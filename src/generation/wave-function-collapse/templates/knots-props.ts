import { rotateTile, WaveFunctionCollapseProps } from "../wave-function-collapse-models";

export function getKnotsTilesProps(): WaveFunctionCollapseProps {
  const corner = { image: { id: 'knots/corner' }, sockets: [ '2', '2', '0', '0' ] };
  const corner2 = rotateTile(corner);
  const corner3 = rotateTile(corner2);
  const corner4 = rotateTile(corner3);
  const cross = { image: { id: 'knots/cross' }, sockets: [ '2', '2', '2', '2' ]};
  const cross2 = rotateTile(cross);
  const empty = { image: { id: 'knots/empty' }, sockets: [ '0', '0', '0', '0' ]};
  const line = { image: { id: 'knots/line' }, sockets: [ '0', '2', '0', '2' ]};
  const line2 = rotateTile(line);
  const t = { image: { id: 'knots/t' }, sockets: [ '0', '2', '2', '2' ]};
  const t2 = rotateTile(t);
  const t3 = rotateTile(t2);
  const t4 = rotateTile(t3);
  return {
    isHexaGrid: false,
    hasMatchingSockets: (s, sockets) => sockets.includes(s),
    tiles: [
      corner,
      corner2,
      corner3,
      corner4,
      cross,
      cross2,
      empty,
      line,
      line2,
      t,
      t2,
      t3,
      t4,
    ]
  };
}