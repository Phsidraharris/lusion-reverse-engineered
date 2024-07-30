import * as THREE from "three";
import { NURBSCurve } from "three/examples/jsm/Addons.js";
import NurbsJson from "../assets/nurbs-points.json";
import { debugGui } from "./debugGui";

export class NURBSTube extends THREE.Group {
    drawRange = 0;
    tubeGeometry = null;

    constructor() {
        super();

        const line = this.createNURBSCurveFromJson(NurbsJson);
        this.add(line);

        const folder = debugGui.addFolder("AnimatedTube");
        folder.add(this, 'drawRange', 0, 1).onChange(value => {
            const count = this.tubeGeometry.attributes.position.usage;
            const end = Math.round(value * count);
            this.tubeGeometry.setDrawRange(0, end);
        });
    }

    createNURBSCurveFromJson(nurbsJson) {
        const nurbsPoints = nurbsJson[0].points.map((p) => new THREE.Vector4(p.x, p.y, p.z, p.weight));
        const nurbsKnots = [];
        const nurbsDegree = 3;

        for (let i = 0; i <= nurbsDegree; i++) {
            nurbsKnots.push(0);
        }

        for (let i = 0, j = nurbsPoints.length; i < j; i++) {
            const knot = (i + 1) / (j - nurbsDegree);
            nurbsKnots.push(THREE.MathUtils.clamp(knot, 0, 1));
        }

        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

        const nurbsCurve = new NURBSCurve(nurbsDegree, nurbsKnots, nurbsPoints);

        console.log(nurbsCurve.toJSON())

        this.tubeGeometry = new THREE.TubeGeometry(nurbsCurve, 64, 0.2, 64, false);
        const mesh = new THREE.Mesh(this.tubeGeometry, material);
        return mesh;
    }
}