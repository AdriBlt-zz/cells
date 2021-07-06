import * as p5 from "p5";

import { PlayableSketch } from "../../services/playable-sketch";
import { COLORS, setBackground, setFillColor, setStrokeColor } from "../../utils/color";
import { LinkedList } from "../../utils/linked-list";
import { Point } from "../../utils/points";
import { createVector, Vector } from "../../utils/vector";
import { G } from "./models/data";
import { Body, BodyInfo, CameraMode, NBodiesSimulationInputs, ViewMode } from "./models/models";

const WIDTH = 1300;
const HEIGHT = 800;
const HALF_WIDTH = WIDTH / 2;
const HALF_HEIGHT = HEIGHT / 2;

const DELTA_T = 0.1;
const TAIL_LENGTH = 100000;
const SKIP_FORWARD = 1000;

export class NBodiesSketch extends PlayableSketch {
  private bodies: Body[] = [];
  private barycenter: Vector = createVector();
  private cameraMode: ViewMode = { type: CameraMode.LockOnBarycenter }; // { type: CameraMode.LockOnBody, bodyIndex: 1 };

  private zoom: number = 0.000001;

  constructor(private getDefaultInputs: () => NBodiesSimulationInputs) {
    super();
  }

  public setup(p: p5): void {
    this.p5js = p;
    this.p5js.createCanvas(WIDTH, HEIGHT);
    this.reset();
  }

  public draw(): void {
    this.updateBodies();
    this.drawBodies();
  }

  public mouseWheel(delta: number): void {
    if (delta < 0) {
      this.zoom *= 0.9;
    } else {
      this.zoom /= 0.9;
    }

    this.drawBodies();
  }

  public reset = (): void => {
    const inputs = this.getDefaultInputs();
    this.cameraMode = inputs.viewMode;
    this.bodies = inputs.bodies.map(createBody);
  };

  public skipForward = (): void => {
    for (let t = 0; t < SKIP_FORWARD; t++) {
      this.updateBodies();
    }

    this.drawBodies();
  }

  private updateBodies(): void {
    // Reset acceleration
    this.bodies.forEach(p => p.acceleration = createVector());

    // Update acceleration
    for (let i = 0; i < this.bodies.length; i++) {
      for (let j = i + 1; j < this.bodies.length; j++) {
        const distance = this.bodies[i].position.copy().sub(this.bodies[j].position);
        const squareDist = distance.copy().magSq();
        const direction = distance.copy().normalize();
        const deltaAcc = direction.copy().mult(G / squareDist);
        this.bodies[j].acceleration.add(deltaAcc.copy().mult(this.bodies[i].info.mass));
        this.bodies[i].acceleration.sub(deltaAcc.copy().mult(this.bodies[j].info.mass));
      }
    }

    this.barycenter = createVector();
    let totalMass = 0;

    // Update Speed and Position + compute barycenter
    this.bodies.forEach(p => {
      p.speed.add(p.acceleration.copy().mult(DELTA_T));
      p.position.add(p.speed.copy().mult(DELTA_T));

      this.barycenter.add(p.position.copy().mult(p.info.mass));
      totalMass += p.info.mass;
    })

    this.barycenter.mult(1 / totalMass);

    // translate if camera mode "ViewFrom"
    if (this.cameraMode.type === CameraMode.ViewFromBarycenter
      || this.cameraMode.type === CameraMode.ViewFromBody) {
        const offset = (this.cameraMode.type === CameraMode.ViewFromBody
            && this.cameraMode.bodyIndex >= 0
            && this.cameraMode.bodyIndex < this.bodies.length)
          ? this.bodies[this.cameraMode.bodyIndex].position.copy()
          : this.barycenter;
        this.bodies.forEach(p => p.position.sub(offset));
    }

    // Update tail
    this.bodies.forEach(p => {
      p.tail.insertTail({ x: p.position.x, y: p.position.y });
      if (p.tail.count > TAIL_LENGTH) {
        p.tail.popHead();
      }
    });
  }

  private drawBodies(): void {
    setBackground(this.p5js, COLORS.Black);

    let offset = createVector(0, 0);
    if (this.cameraMode.type === CameraMode.LockOnBarycenter
      || this.cameraMode.type === CameraMode.LockOnBody) {
        offset = (this.cameraMode.type === CameraMode.LockOnBody
            && this.cameraMode.bodyIndex >= 0
            && this.cameraMode.bodyIndex < this.bodies.length)
          ? this.bodies[this.cameraMode.bodyIndex].position.copy()
          : this.barycenter;
    }

    this.p5js.noFill();
    this.p5js.strokeWeight(2);
    this.bodies.forEach(planet => {
      setStrokeColor(this.p5js, planet.info.color);
      this.p5js.beginShape();
      planet.tail.toList().forEach(point => this.p5js.vertex(
        HALF_WIDTH + this.zoom * (point.x - offset.x),
        HALF_HEIGHT + this.zoom * (point.y - offset.y),
      ));
      this.p5js.endShape();
    })

    this.p5js.noStroke();
    this.bodies.forEach(planet => {
      setFillColor(this.p5js, planet.info.color);
      const x = HALF_WIDTH + this.zoom * (planet.position.x - offset.x);
      const y = HALF_HEIGHT + this.zoom * (planet.position.y - offset.y);
      const r = Math.max(2, Math.log(planet.info.radius)); // this.zoom * planet.info.radius;
      this.p5js.ellipse(x, y, r, r);
    })
  }
}

function createBody(info: BodyInfo): Body {
  return {
    info,
    position: info.initialPosition.copy(),
    speed: info.initialSpeed.copy(),
    acceleration: createVector(0, 0, 0),
    tail: new LinkedList<Point>(),
  };
}