import { LinkedList } from "../../../utils/linked-list";
import { createVector, Vector } from "../../../utils/vector";
import { G } from "../models/data";
import { Body, BodyInfo } from "../models/models";

const DELTA_T = 0.1;
const TAIL_LENGTH = 100000;

export class NBodiesEngine {
    public bodies: Body[] = [];
    public barycenterList: LinkedList<Vector> = new LinkedList<Vector>();

    public setInputs(inputBodies: BodyInfo[]) {
        this.bodies = inputBodies.map(createBody);

        this.barycenterList.clear();
        const barycenter = createVector();
        let totalMass = 0;
        this.bodies.forEach(p => {
            barycenter.add(p.position.copy().mult(p.info.mass));
            totalMass += p.info.mass;
        });
        barycenter.mult(1 / totalMass);
        this.barycenterList.insertTail(barycenter);
    }

    public computeOneStep(): void {
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

        const barycenter = createVector();
        let totalMass = 0;

        // Update Speed and Position + compute barycenter
        this.bodies.forEach(p => {
            p.speed.add(p.acceleration.copy().mult(DELTA_T));
            p.position.add(p.speed.copy().mult(DELTA_T));

            barycenter.add(p.position.copy().mult(p.info.mass));
            totalMass += p.info.mass;
        });

        barycenter.mult(1 / totalMass);
        this.barycenterList.insertTail(barycenter);
        if (this.barycenterList.count > TAIL_LENGTH) {
            this.barycenterList.popHead();
        }

        // Update tail
        this.bodies.forEach(p => {
            p.tail.insertTail(p.position.copy());
            if (p.tail.count > TAIL_LENGTH) {
                p.tail.popHead();
            }
        });
    }
}

function createBody(info: BodyInfo): Body {
    return {
        info,
        position: info.initialPosition.copy(),
        speed: info.initialSpeed.copy(),
        acceleration: createVector(0, 0, 0),
        tail: new LinkedList<Vector>(),
    };
}
