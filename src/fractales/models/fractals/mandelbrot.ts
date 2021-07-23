import { Complex } from "../../../numbers/Complex";
import { Color, COLORS, getColorBetween } from "../../../utils/color";
import { Fractal } from "../fractale";
import { ConvergenceStatus, FractalResult } from "../models";

export class MandelbrotFractal implements Fractal {
    public defaultSize: { min: Complex; max: Complex; } = {
        min: new Complex(-2.0, -1.0),
        max: new Complex(1.0, 0),
    };
    public maxIterations: number = 200;
    public maxSquareMod: number = 4;

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
        return z.getSquare().add(z0);
    }

    public getResultColor(result: FractalResult): Color {
        switch (result.status) {
            case ConvergenceStatus.Converged:
            case ConvergenceStatus.Unknown:
                return COLORS.Black;
            case ConvergenceStatus.Diverged:
            default:
        }

        const p = Math.log2(1 + result.iterations) / Math.log2(1 + this.maxIterations);
        return getColorBetween(COLORS.DarkBlue, COLORS.White, p);
    }
}
