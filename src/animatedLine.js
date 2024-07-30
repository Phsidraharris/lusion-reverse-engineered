import * as THREE from "three";
import { GeometryUtils, Line2, LineGeometry, LineMaterial } from "three/examples/jsm/Addons.js";
import { debugGui } from "./debugGui";
import nurbsJson from "../assets/nurbs-points.json";
import { createNurbsCurve } from "./nurbsUtils";

export default class AnimatedLine extends THREE.Group {
    lineWidth = 1;
    lineMat = null;
    /** @type Line2 */
    line = null;

    testEnd = 10;

    constructor() {
        super();

        this.createLine();

        const folder = debugGui.addFolder("AnimatedLine");
        folder.add(this, "lineWidth", 1, 100).onChange(v => this.lineMat.linewidth = v);
        folder.add(this, "testEnd", 0, 30, 1).onChange(v => {
            this.createLine();
        });
    }

    createLine() {
        if (this.line) {
            this.remove(this.line);
        }

        const positions = [];
        const colors = [];

        const points = nurbsJson[0].points.map(p => new THREE.Vector3(p.x, p.y, p.z, p.weight));
        const spline = createNurbsCurve(points);

        const divisions = Math.round(12 * points.length);
        const point = new THREE.Vector3();
        const color = new THREE.Color();

        for (let i = 0, l = divisions; i < l; i++) {

            const t = i / l;

            spline.getPoint(t, point);
            positions.push(point.x, point.y, point.z);

            color.setHSL(t, 1.0, 0.5, THREE.SRGBColorSpace);
            colors.push(color.r, color.g, color.b);
        }

        const geometry = new LineGeometry();
        geometry.setPositions(positions);
        geometry.setColors(colors);

        this.lineMat = new LineMaterial({

            color: 0xffffff,
            linewidth: 5, // in world units with size attenuation, pixels otherwise
            vertexColors: true,

            dashed: false,
            alphaToCoverage: true,

        });

        this.line = new Line2(geometry, this.lineMat);
        this.line.computeLineDistances();
        this.line.scale.set(1, 1, 1);

        this.add(this.line);
    }
}