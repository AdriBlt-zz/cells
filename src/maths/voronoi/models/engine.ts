import { CountingList } from "../../../utils/countingList";
import { random } from "../../../utils/random";
import { Edge } from "./edge";
import { Point } from "./point";
import { Triangle } from "./triangle";

export class Engine
{
    public points: Point[] = [];
    public delaunayTriangulation: Triangle[] = [];
    public voronoiEdges: Edge[] = [];

    constructor(
        private maxX: number,
        private maxY: number,
    ) {
        this.resetBaseSquare();
    }

    public addPoint(): void
    {
        const point = new Point(
            random(0, this.maxX),
            random(0, this.maxY));
        this.points.push(point);

        this.generateDelaunayWithBowyerWatson(point);
    }

    public setPoints(points: Point[]): void {
        this.resetBaseSquare();
        points.forEach(point => {
            point.AdjacentTriangles.clear();
            this.points.push(point);
            this.generateDelaunayWithBowyerWatson(point);
        });
        this.generateVoronoiEdgesFromDelaunay();
    }

    public generateVoronoiEdgesFromDelaunay(): void
    {
        // Removing frame points ?
        // const framePoints = this.points.splice(0, 4);
        // this.delaunayTriangulation = this.delaunayTriangulation.filter(triangle =>
        //     triangle.Vertices.findIndex(p => framePoints.includes(p)) < 0)

        this.voronoiEdges = [];
        this.delaunayTriangulation.forEach(triangle => {
            triangle.TrianglesWithSharedEdge.forEach(neighbor => {
                const edge = new Edge(triangle.Circumcenter, neighbor.Circumcenter);
                this.voronoiEdges.push(edge);
            });
        });
    }

    private generateDelaunayWithBowyerWatson(point: Point): void {
        const badTriangles = this.findBadTriangles(point, this.delaunayTriangulation);
        const polygon = this.findHoleBoundaries(badTriangles);

        badTriangles.forEach((triangle: Triangle) => {
            triangle.Vertices.forEach((vertex: Point) => vertex.AdjacentTriangles.delete(triangle));
        });

        this.delaunayTriangulation = this.delaunayTriangulation.filter(o => !badTriangles.includes(o));

        polygon.filter(possibleEdge => possibleEdge.point1 !== point && possibleEdge.point2 !== point)
            .forEach(edge => this.delaunayTriangulation.push(new Triangle(point, edge.point1, edge.point2)));
    }

    private findHoleBoundaries(badTriangles: Triangle[]): Edge[]
    {
        const edges = new CountingList<Edge>();
        badTriangles.forEach(triangle => {
            edges.add(new Edge(triangle.Vertices[0], triangle.Vertices[1]));
            edges.add(new Edge(triangle.Vertices[1], triangle.Vertices[2]));
            edges.add(new Edge(triangle.Vertices[2], triangle.Vertices[0]));
        });
        return edges.getItemsWhere(count => count === 1);
    }

    private findBadTriangles(point: Point, triangles: Triangle[]): Triangle[]
    {
        return triangles.filter(o => o.IsPointInsideCircumcircle(point));
    }

    private resetBaseSquare(): void {
        // TODO make more beautiful
        const pointTL = new Point(0, 0);
        const pointBL = new Point(0, this.maxY);
        const pointBR = new Point(this.maxX, this.maxY);
        const pointTR = new Point(this.maxX, 0);
        this.points = [ pointTL, pointBL, pointBR, pointTR ];

        const tri1 = new Triangle(pointTL, pointBL, pointBR);
        const tri2 = new Triangle(pointTL, pointBR, pointTR);
        this.delaunayTriangulation = [tri1, tri2];

        this.voronoiEdges = [];
    }
}

/*
// pointList is a set of coordinates defining the points to be triangulated
triangulation := empty triangle mesh data structure
add super-triangle to triangulation // must be large enough to completely contain all the points in pointList
for each point in pointList do // add all the points one at a time to the triangulation
    badTriangles := empty set
    for each triangle in triangulation do // first find all the triangles that are no longer valid due to the insertion
        if point is inside circumcircle of triangle
            add triangle to badTriangles
    polygon := empty set
    for each triangle in badTriangles do // find the boundary of the polygonal hole
        for each edge in triangle do
            if edge is not shared by any other triangles in badTriangles
            add edge to polygon
    for each triangle in badTriangles do // remove them from the data structure
        remove triangle from triangulation
    for each edge in polygon do // re-triangulate the polygonal hole
        newTri := form a triangle from edge to point
        add newTri to triangulation
for each triangle in triangulation // done inserting points, now clean up
    if triangle contains a vertex from original super-triangle
        remove triangle from triangulation
return triangulation
*/
