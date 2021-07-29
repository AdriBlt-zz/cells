import * as p5 from "p5";

import { ProcessingSketch } from "../../services/processing.service";
import { COLORS, setBackground, setFillColor, setStrokeColor } from "../../utils/color";
import { getKeyFromCode, KeyBoard } from "../../utils/keyboard";
import { Engine } from "./models/engine";

const WIDTH = 800;
const HEIGHT = 500;

export class VoronoiSketch implements ProcessingSketch {
  private p5js: p5;
  private engine = new Engine(WIDTH, HEIGHT);

  public setup(p: p5): void {
    this.p5js = p;
    this.p5js.createCanvas(WIDTH, HEIGHT);
    this.p5js.noLoop();

    for (let i = 0; i < 20; i++) {
      this.engine.addPoint();
    }

    this.engine.generateVoronoiEdgesFromDelaunay();
    this.draw();
  }

  public draw(): void {
    // this.engine.points.forEach(p => {
    //   p.X += random(-1, 1);
    //   p.Y += random(-1, 1);
    // });

    setBackground(this.p5js, COLORS.White);
    // this.drawTriangulation();
    // this.drawTriangleCircum();
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
      this.p5js.line(v[0].X, v[0].Y, v[1].X, v[1].Y);
      this.p5js.line(v[1].X, v[1].Y, v[2].X, v[2].Y);
      this.p5js.line(v[0].X, v[0].Y, v[2].X, v[2].Y);
    });
  }

  protected drawVoronoi() {
    this.p5js.strokeWeight(1);
    setStrokeColor(this.p5js, COLORS.Blue);
    this.engine.voronoiEdges.forEach(e => {
      this.p5js.line(e.point1.X, e.point1.Y, e.point2.X, e.point2.Y);
    });
  }

  protected drawPoints() {
    const pointRadius = 6;
    this.p5js.noStroke();
    setFillColor(this.p5js, COLORS.Black);
    this.engine.points.forEach(point => {
      this.p5js.ellipse(point.X, point.Y, pointRadius, pointRadius);
    });
  }

  protected drawTriangleCircum() {
    this.p5js.noFill();
    setStrokeColor(this.p5js, COLORS.Green);
    this.engine.delaunayTtriangulation.forEach(triangle => {
      const r = Math.sqrt(triangle.RadiusSquared) * 2;
      this.p5js.ellipse(triangle.Circumcenter.X, triangle.Circumcenter.Y, r, r);
    });
  }
}
