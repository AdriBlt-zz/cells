import * as p5 from "p5";

import { PlayableSketch } from "../services/playable-sketch";
import { COLORS, setBackground, setStrokeColor } from "../utils/color";
import { Point } from "../utils/points";
import { random } from "../utils/random";

const w = 800;
const h = 600;

export class BransleyFernSketch extends PlayableSketch {

    private currentPoint: Point = { x: 0, y: 0 };

    public setup(p: p5): void {
        this.p5js = p;
        this.p5js.createCanvas(w, h);
        setBackground(this.p5js, COLORS.Black);
    }

    public draw(): void {
        for (let i = 0; i < 100; i++) {
            this.drawPoint(this.currentPoint);
            this.currentPoint = this.getNextPoint(this.currentPoint);
        }
    }

    private drawPoint({ x, y }: Point): void {
        // −2.1820 < x < 2.6558 and 0 ≤ y < 9.9983.
        const px = this.p5js.map(x, -2.2, 2.7, 0, w);
        const py = this.p5js.map(y, 0, 10, h, 0);

        setStrokeColor(this.p5js, COLORS.Green);
        this.p5js.point(px, py);
    }

    private getNextPoint(point: Point): Point {
        const r = random();
        if (r < 0.01) {
            return this.getPointF1(point);
        } else if (r < 0.86) {
            return this.getPointF2(point);
        } else if (r < 0.93) {
            return this.getPointF3(point);
        } else {
            return this.getPointF4(point);
        }
    }

    // ƒ1	0	0	0	0.16	0	0	0.01	Stem
    private getPointF1({ x, y }: Point): Point {
        return {
            x: 0,
            y: 0.16 * y,
        };
    }

    // ƒ2	0.85	0.04	−0.04	0.85	0	1.60	0.85	Successively smaller leaflets
    private getPointF2({ x, y }: Point): Point {
        return {
            x: 0.85 * x + 0.04 * y,
            y: -0.04 * x + 0.85 * y + 1.6,
        };
    }

    // ƒ3	0.20	−0.26	0.23	0.22	0	1.60	0.07	Largest left-hand leaflet
    private getPointF3({ x, y }: Point): Point {
        return {
            x: 0.2 * x - 0.26 * y,
            y: 0.23 * x + 0.22 * y + 1.6,
        };
    }

    // ƒ4	−0.15	0.28	0.26	0.24	0	0.44	0.07	Largest right-hand leaflet
    private getPointF4({ x, y }: Point): Point {
        return {
            x: -0.15 * x + 0.28 * y,
            y: 0.26 * x + 0.24 * y + 0.44,
        };
    }

}
