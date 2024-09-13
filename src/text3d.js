import * as THREE from 'three';
import { FontLoader, TextGeometry } from 'three/examples/jsm/Addons.js';

const FONT_PATH = 'assets/optimer_regular.typeface.json';

export default class Text3D extends THREE.Group {
    constructor(text, fontSize = 12) {
        super();

        const group = this;

        const textMat = new THREE.MeshStandardMaterial({
            roughness: 0.1,
            metalness: 1
        });

        const loader = new FontLoader();
        loader.load(FONT_PATH, function (response) {
            const font = response;

            const textGeo = new TextGeometry(text, {
                font: font,
                size: fontSize,
                depth: 4,
                curveSegments: 16,
                bevelThickness: 1,
                bevelSize: 2,
                bevelEnabled: true
            });

            const textMesh = new THREE.Mesh(textGeo, textMat);
            group.add(textMesh);

            textGeo.computeBoundingBox();
        });
    }
}