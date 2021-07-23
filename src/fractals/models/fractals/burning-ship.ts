import { Complex } from "../../../numbers/Complex";
import { Color, COLORS, getColorBetween } from "../../../utils/color";
import { Fractal } from "../fractale";
import { ConvergenceStatus, FractalResult } from "../models";

export class BurningShip implements Fractal {
    public maxIterations: number = 1000;
    public maxSquareMod: number = 4;
    public defaultSize: { min: Complex; max: Complex; } = {
        min: new Complex(-2, -2),
        max: new Complex(2, 2),
    };

    public getConvergenceResult(z0: Complex): FractalResult {
        let z = z0;
        let squareModuleMax = z.getSquareModule();
        for (let n = 0; n < this.maxIterations; n++) {
            const zz = this.getIterationComplex(z, z0);

            if (zz.getSquareModule() >= this.maxSquareMod) {
                return {
                    point: z,
                    iterations: n,
                    status: ConvergenceStatus.Diverged,
                    squareModuleMax,
                };
            }

            if (z.isEqual(zz)) {
                return {
                    point: zz,
                    iterations: n,
                    status: ConvergenceStatus.Converged,
                    squareModuleMax,
                };
            }

            z = zz;
            const sqMod = zz.getModule();
            if (sqMod > squareModuleMax) {
                squareModuleMax = sqMod;
            }
        }

        return {
            point: z,
            iterations: this.maxIterations,
            status: ConvergenceStatus.Unknown,
            squareModuleMax,
        };
    }

    public getIterationComplex(z: Complex, z0: Complex): Complex {
        const x = z.getRe();
        const y = z.getIm();
        const re = x + x - y * y + z0.getRe();
        const im = Math.abs(2 * x * y) + z0.getIm();
        return new Complex(re, im);
    }

    public getResultColor(result: FractalResult): Color {
        if (result.iterations === this.maxIterations) {
            return COLORS.Black;
        }

        const p = 1.0 * result.iterations / this.maxIterations;
        return getColorBetween(COLORS.Red, COLORS.White, p);
    }
}
