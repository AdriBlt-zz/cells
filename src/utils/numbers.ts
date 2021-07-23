import { Complex } from "../numbers/Complex";

export function isOutOfBounds(
  x: number,
  minIncluded: number,
  maxExcluded: number
): boolean {
  return x < minIncluded || x >= maxExcluded;
}

export function isBetweenIncluded(
  x: number,
  minIncluded: number,
  maxIncluded: number
): boolean {
  return x >= minIncluded && x <= maxIncluded;
}

export function doSegmentsIntersect(
  min1: number,
  max1: number,
  min2: number,
  max2: number
): boolean {
  return min1 <= max2 && min2 <= max1;
}

const epsilon = 0.0001;
export function isStatisticallyNull(value: number): boolean {
  return value < epsilon && value > -epsilon;
}

export function areNumbersStaticticallyEqual(a: number, b: number): boolean {
  return isStatisticallyNull(a - b);
}

export function areComplexesStaticticallyEqual(a: Complex, b: Complex): boolean {
  return isStatisticallyNull(a.getSquareDistanceFrom(b));
}

export function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
}
