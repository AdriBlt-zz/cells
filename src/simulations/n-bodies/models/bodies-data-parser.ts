export interface BodyData {
    // Order: for bodies within their parent scope, indicating distance from it
    order?: number;

    // Label: symbol or roman notation indicating size within parent scope
    label?: string;

    // Name
    name: string;

    // H = Abs. Mag.
    absoluteMagnitude?: number;

    // d = Diameter (km)
    diameter: number;

    // m = Mass (e+16 kg)
    mass: number;

    // a = Semi-major axis (km)
    semiMajorAxis: number;

    // T = Orbital period (d)
    orbitalPeriod?: number;

    // i = Inclination (degrees)
    inclination?: number;

    // e = Eccentricity
    eccentricity: number;

    // Group: children are often regroupped in categories
    group?: string;

    // Parent
    parent: string;
}

