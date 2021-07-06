import { Color } from "../../../utils/color";
import { LinkedList } from "../../../utils/linked-list";
import { Point } from "../../../utils/points";
import { Vector } from "../../../utils/vector";

export interface BodyInfo {
    name: string;
    mass: number;
    radius: number;
    color: Color;
    initialPosition: Vector;
    initialSpeed: Vector;
}

export interface Body {
    info: BodyInfo;
    position: Vector;
    speed: Vector;
    acceleration: Vector;
    tail: LinkedList<Point>;
}

export enum CameraMode {
    Free,
    LockOnBarycenter,
    LockOnBody,
    ViewFromBarycenter,
    ViewFromBody,
  }

export type ViewMode =
    | { type: CameraMode.Free; }
    | { type: CameraMode.LockOnBarycenter; }
    | { type: CameraMode.LockOnBody; bodyIndex: number; }
    | { type: CameraMode.ViewFromBarycenter; }
    | { type: CameraMode.ViewFromBody; bodyIndex: number; };

export interface NBodiesSimulationInputs {
    bodies: BodyInfo[];
    viewMode: ViewMode;
}