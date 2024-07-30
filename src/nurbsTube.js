import * as THREE from "three";
import { NURBSCurve, OrbitControls } from "three/examples/jsm/Addons.js";
import NurbsJson from "../assets/nurbs-points.json";

export class NURBSTube extends THREE.Group {
    constructor() {
        super();
        const line = this.createNURBSCurveFromJson(NurbsJson);
        this.add(line);
    }

    createNURBSCurveFromJson(nurbsJson) {
        const nurbsPoints = nurbsJson[0].points.map(
            (p) => new THREE.Vector4(p.x, p.y, p.z, p.weight)
        );
        console.log(nurbsJson)
        const nurbsKnots = [];
        const nurbsDegree = 3;

        for (let i = 0; i <= nurbsDegree; i++) {
            nurbsKnots.push(0);
        }

        for (let i = 0, j = nurbsPoints.length; i < j; i++) {
            const knot = (i + 1) / (j - nurbsDegree);
            nurbsKnots.push(THREE.MathUtils.clamp(knot, 0, 1));
        }

        const nurbsCurve = new NURBSCurve(nurbsDegree, nurbsKnots, nurbsPoints);

        const geometry = new THREE.TubeGeometry(nurbsCurve, 64, 0.2, 16, false);
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

        const mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }
}