import * as p5 from "p5";

import { ProcessingSketch } from "../../services/processing.service";
import { COLORS, setBackground, setFillColor, setStrokeColor } from "../../utils/color";
import { getKeyFromCode, KeyBoard } from "../../utils/keyboard";
import { clamp } from "../../utils/numbers";
import { random } from "../../utils/random";
import { createVector, Vector } from "../../utils/vector";
import { Engine } from "./models/engine";
import { Point } from "./models/point";

const WIDTH = 800;
const HEIGHT = 500;
const MARGIN = 10;

const CANVAS_WIDTH = WIDTH - 2 * MARGIN;
const CANVAS_HEIGHT = HEIGHT - 2 * MARGIN;

interface SpeedPoint {
  position: Point;
  speed: Vector;
  acceleration: Vector;
}

export class VoronoiSketch implements ProcessingSketch {
  private p5js: p5;
  private engine = new Engine(CANVAS_WIDTH, CANVAS_HEIGHT);
  private points: SpeedPoint[];

  public setup(p: p5): void {
    this.p5js = p;
    this.p5js.createCanvas(WIDTH, HEIGHT);

    this.points = [];
    for (let i = 0; i < 100; i++) {
      this.points.push({
        position: new Point(
          random(MARGIN, CANVAS_WIDTH - MARGIN),
          random(MARGIN, CANVAS_HEIGHT - MARGIN)),
        speed: createVector(),
        acceleration: createVector(),
      })
    }

    this.engine.generateVoronoiEdgesFromDelaunay();
    this.draw();
  }

  public draw(): void {
    const deltaT = 1;
    const coefForce = 1;
    this.points.forEach(p => {
      // Force from walls
      const x = p.position.X;
      const altX = CANVAS_WIDTH - x;
      const y = p.position.Y;
      const altY = CANVAS_HEIGHT - y;
      const fX = coefForce * (1 / (x * x) - 1 / (altX * altX));
      const fY = coefForce * (1 / (y * y) - 1 / (altY * altY));
      p.acceleration = createVector(fX, fY);
    });
    for (let i = 0; i < this.points.length; i++) {
      for (let j = i + 1; j < this.points.length; j++) {
        const dX = this.points[i].position.X - this.points[j].position.X;
        const dY = this.points[i].position.Y - this.points[j].position.Y;
        const d2 = dX * dX + dY * dY;
        const d = Math.sqrt(d2);
        const force = coefForce / d2;
        const fX = force * dX / d;
        const fY = force * dY / d;
        this.points[i].acceleration.add(fX, fY);
        this.points[j].acceleration.add(-fX, -fY);
      }
    }
    this.points.forEach(p => {
      p.speed.add(deltaT * p.acceleration.x, deltaT * p.acceleration.y);
      p.position.X = clamp(p.position.X + deltaT * p.speed.x, 0, CANVAS_WIDTH);
      p.position.Y = clamp(p.position.Y + deltaT * p.speed.y, 0, CANVAS_HEIGHT);
    });
    this.engine.setPoints(this.points.map(p => p.position));

    setBackground(this.p5js, COLORS.White);
    // this.drawTriangulation();
    this.drawVoronoi();
    this.drawPoints();
  }

  public keyPressed(): void {
    const key = this.p5js && getKeyFromCode(this.p5js.keyCode);

    if (key === KeyBoard.SPACE) {
      this.addPoint();
    }
  }

  protected addPoint() {
    this.engine.addPoint();
    this.engine.generateVoronoiEdgesFromDelaunay();
    this.draw();
  }

  protected drawTriangulation() {
    this.p5js.strokeWeight(1);
    setStrokeColor(this.p5js, COLORS.Red);
    this.engine.delaunayTtriangulation.forEach(triangle => {
      const v = triangle.Vertices;
      this.p5js.line(MARGIN + v[0].X, MARGIN + v[0].Y, MARGIN + v[1].X, MARGIN + v[1].Y);
      this.p5js.line(MARGIN + v[1].X, MARGIN + v[1].Y, MARGIN + v[2].X, MARGIN + v[2].Y);
      this.p5js.line(MARGIN + v[0].X, MARGIN + v[0].Y, MARGIN + v[2].X, MARGIN + v[2].Y);
    });
  }

  protected drawVoronoi() {
    this.p5js.strokeWeight(1);
    setStrokeColor(this.p5js, COLORS.Blue);
    this.engine.voronoiEdges.forEach(e => {
      this.p5js.line(
        MARGIN + e.point1.X, MARGIN + e.point1.Y,
        MARGIN + e.point2.X, MARGIN + e.point2.Y);
    });
  }

  protected drawPoints() {
    const pointRadius = 6;
    this.p5js.noStroke();
    setFillColor(this.p5js, COLORS.Black);
    this.engine.points.forEach(point => {
      this.p5js.ellipse(MARGIN + point.X, MARGIN + point.Y, pointRadius, pointRadius);
    });
  }
}
