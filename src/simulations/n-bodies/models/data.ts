import { getStrings } from "../../../strings";
import { COLORS } from "../../../utils/color";
import { createVector } from "../../../utils/vector";
import { BodyInfo } from "./models";

export const G = 6.6742e-11;

// mass in kg, radius and distance in km
export function getSolarSystemData(): BodyInfo[] {
    const mSun = 1.989e+30;
    const rSun = 696340;

    const mEarth = 5.972e+24;
    const rEarth = 6371;
    const dEarth = 149600000;

    const mMoon = 7.349e+22;
    const rMoon = 1737;
    const dMoon = 384400;

    const speedEarth = Math.sqrt(mSun * G / dEarth);
    const speedMoon = Math.sqrt(mEarth * G / dMoon);

    const strings = getStrings().nBodies.bodiesNames;

    return [
        {
            name: strings.sun,
            mass: mSun,
            radius: rSun,
            initialPosition: createVector(0, 0),
            initialSpeed: createVector(0, 0),
            color: COLORS.Orange,
        },
        {
            name: strings.earth,
            mass: mEarth,
            radius: rEarth,
            initialPosition: createVector(dEarth, 0),
            initialSpeed: createVector(0, speedEarth),
            color: COLORS.Blue,
        },
        {
            name: strings.moon,
            mass: mMoon,
            radius: rMoon,
            initialPosition: createVector(dEarth + dMoon, 0),
            initialSpeed: createVector(0, speedEarth + speedMoon),
            color: COLORS.Gray,
        },
    ]
};