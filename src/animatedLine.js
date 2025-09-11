import * as THREE from 'three';
import { Line2, LineGeometry, LineMaterial } from "three/examples/jsm/Addons.js";
import nurbsJson from "../assets/nurbs-canxerian.json";
import { debugGui } from "./debugGui";
import { createNurbsCurve } from "./utils/nurbsUtils";

export default class AnimatedLine extends THREE.Group {
    lineWidth = 1;
    lineMat = null;
    /** @type Line2 */
    line = null;

    lineProgress = 1;

    constructor() {
        super();

        this.createLine();

        const folder = debugGui.addFolder("AnimatedLine");
        folder.add(this, "lineWidth", 1, 100).onChange(v => this.lineMat.linewidth = v);
        folder.add(this, "lineProgress", 0.01, 1).onChange(v => {
            this.createLine();
        });
    }

    createLine() {
        if (this.line) {
            this.remove(this.line);
        }

        const positions = [];
        const colors = [];

        // Define the 8 corners of a cube
        const size = 10;
        const half = size / 2;
        const cubeVertices = [
            new THREE.Vector3(-half, -half, -half),
            new THREE.Vector3(half, -half, -half),
            new THREE.Vector3(half, half, -half),
            new THREE.Vector3(-half, half, -half),
            new THREE.Vector3(-half, -half, -half), // close bottom face

            new THREE.Vector3(-half, -half, half),
            new THREE.Vector3(half, -half, half),
            new THREE.Vector3(half, half, half),
            new THREE.Vector3(-half, half, half),
            new THREE.Vector3(-half, -half, half), // close top face

            // Connect verticals
            new THREE.Vector3(-half, -half, -half),
            new THREE.Vector3(-half, -half, half),

            new THREE.Vector3(half, -half, -half),
            new THREE.Vector3(half, -half, half),

            new THREE.Vector3(half, half, -half),
            new THREE.Vector3(half, half, half),

            new THREE.Vector3(-half, half, -half),
            new THREE.Vector3(-half, half, half),
        ];

        // Animate the drawing of the cube edges based on lineProgress (0..1)
        const totalSegments = cubeVertices.length - 1;
        const visibleSegments = Math.floor(this.lineProgress * totalSegments);

        const color = new THREE.Color();
        for (let i = 0; i < visibleSegments; i++) {
            const v1 = cubeVertices[i];
            const v2 = cubeVertices[i + 1];

            positions.push(v1.x, v1.y, v1.z);
            positions.push(v2.x, v2.y, v2.z);

            // Color can be animated or fixed
            color.setHSL(i / totalSegments, 1.0, 0.5, THREE.SRGBColorSpace);
            colors.push(color.r, color.g, color.b);
            colors.push(color.r, color.g, color.b);
        }

        const geometry = new LineGeometry();
        geometry.setPositions(positions);
        geometry.setColors(colors);

        this.lineMat = new LineMaterial({
            color: 0xffffff,
            linewidth: this.lineWidth,
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