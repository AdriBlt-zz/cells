import { CountingList } from "../../../utils/countingList";
import { random } from "../../../utils/random";
import { UniqueSet } from "../../../utils/set";
import { Edge } from "./edge";
import { Point } from "./point";
import { Triangle } from "./triangle";

const MARGIN = 10;
export class Engine
{
    public points: Point[];
    public delaunayTtriangulation: UniqueSet<Triangle>;
    public voronoiEdges: Edge[];

    constructor(
        private maxX: number,
        private maxY: number,
    ) {
        // TODO make more beautiful
        const pointTL = new Point(MARGIN, MARGIN);
        const pointBL = new Point(MARGIN, this.maxY - MARGIN);
        const pointBR = new Point(this.maxX - MARGIN, this.maxY - MARGIN);
        const pointTR = new Point(this.maxX - MARGIN, MARGIN);
        this.points = [ pointTL, pointBL, pointBR, pointTR ];

        const tri1 = new Triangle(pointTL, pointBL, pointBR);
        const tri2 = new Triangle(pointTL, pointBR, pointTR);
        this.delaunayTtriangulation = new UniqueSet<Triangle>([tri1, tri2]);

        this.voronoiEdges = [];
    }

    public addPoint(): void
    {
        const point = new Point(
            random(MARGIN, this.maxX - MARGIN),
            random(MARGIN, this.maxY - MARGIN));
        this.points.push(point);

        this.generateDelaunayWithBowyerWatson(point);
    }

    public generateVoronoiEdgesFromDelaunay(): void
    {
        this.voronoiEdges = [];
        this.delaunayTtriangulation.forEach(triangle => {
            triangle.TrianglesWithSharedEdge.forEach(neighbor => {
                const edge = new Edge(triangle.Circumcenter, neighbor.Circumcenter);
                this.voronoiEdges.push(edge);
            });
        });
    }

    private generateDelaunayWithBowyerWatson(point: Point): void {
        const badTriangles = this.findBadTriangles(point, this.delaunayTtriangulation);
        const polygon = this.findHoleBoundaries(badTriangles);

        badTriangles.forEach((triangle: Triangle) => {
            triangle.Vertices.forEach((vertex: Point) => vertex.AdjacentTriangles.delete(triangle));
        });

        this.delaunayTtriangulation.deleteWhere(o => badTriangles.includes(o));

        polygon.filter(possibleEdge => possibleEdge.point1 !== point && possibleEdge.point2 !== point)
            .forEach(edge => this.delaunayTtriangulation.add(new Triangle(point, edge.point1, edge.point2)));
    }

    private findHoleBoundaries(badTriangles: UniqueSet<Triangle>): Edge[]
    {
        const edges = new CountingList<Edge>();
        badTriangles.forEach(triangle => {
            edges.add(new Edge(triangle.Vertices[0], triangle.Vertices[1]));
            edges.add(new Edge(triangle.Vertices[1], triangle.Vertices[2]));
            edges.add(new Edge(triangle.Vertices[2], triangle.Vertices[0]));
        });
        return edges.getItemsWhere(count => count === 1);
    }

    private findBadTriangles(point: Point, triangles: UniqueSet<Triangle>): UniqueSet<Triangle>
    {
        return triangles.filter(o => o.IsPointInsideCircumcircle(point));
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
