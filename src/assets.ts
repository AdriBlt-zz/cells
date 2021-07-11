export enum Asset {
    StarsFile = '/stars/hygdata_v3.csv',
    ConstellationsDefinitionFileFormat = '/stars/{0}/constellationship.fab.txt',
    ConstellationsNameFileFormat = '/stars/{0}/constellation_names.eng.fab.txt',

    MazeImage = '/maze.png',

    PlanetsFile = '/planets.tsv',
}

export function getAssetPath(asset: Asset): string {
    return process.env.PUBLIC_URL + '/data' + (asset as string);
}