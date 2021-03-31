export interface Point {
  x: number;
  y: number;
}

export interface Extremum {
  min: Point;
  max: Point;
}

export function findExtremum(points: Point[]): Extremum {  
  return findExtremumMatrix([points]);
}

export function findExtremumMatrix(points: Point[][]): Extremum {
  if (points.length === 0 || points[0].length === 0) {
    throw new Error("Points.findExtremum: empty list of points");
  }

  const { x, y } = points[0][0];
  const extremum = {
    min: { x, y },
    max: { x, y },
  };

  for (const array of points) {
    for (const point of array) {
      if (point.x < extremum.min.x) {
        extremum.min.x = point.x;
      } else if (point.x > extremum.max.x) {
        extremum.max.x = point.x;
      }

      if (point.y < extremum.min.y) {
        extremum.min.y = point.y;
      } else if (point.y > extremum.max.y) {
        extremum.max.y = point.y;
      }
    }
  }

  return extremum;
}
