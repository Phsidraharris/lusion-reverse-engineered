// const points = [new THREE.Vector3(562.4782069643945, -166.4946317179781, 0), new THREE.Vector3(-53.56300074753207, 171.49711742836848, 0), new THREE.Vector3(-89.0533434745719, -90.0652448026218, -0), new THREE.Vector3(-501.5958712011784, -39.858579849202485, -0), new THREE.Vector3(-19.133675423268905, 474.3271798391924, 0), new THREE.Vector3(355.72714050837595, 458.917612906306, 115.91524970108699)]
// points.forEach(p => p.divideScalar(100));
// console.log(points)

import * as THREE from "three";
import { GeometryUtils, LineGeometry, LineMaterial } from "three/examples/jsm/Addons.js";
import { Line2 } from 'three/addons/lines/Line2.js';
import NurbsVertices from "../assets/nurbs_vertices.json";
import { NURBSCurve } from "three/examples/jsm/Addons.js";

const curvePts = NurbsVertices[0].points.map(p => new THREE.Vector3(p.co[0], p.co[1], p.co[2]))

export class LetterSpline extends THREE.Group {
    constructor() {
        super();

        const curve = new THREE.CatmullRomCurve3(
            curvePts
        );

        const lineCurve = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(curve.getSpacedPoints(500)),
            new THREE.LineBasicMaterial({ color: "red", linewidth: 40 })
        )

        const debugSlider = document.getElementById("debug-slider");
        debugSlider.addEventListener('input', (e) => {
            console.log("lineCurve.geometry.drawRange.count", NurbsVertices[0].points.length);
            lineCurve.geometry.setDrawRange(lineCurve.geometry.drawRange.start, debugSlider.value * 500);
        });

        this.add(lineCurve);
    }
}