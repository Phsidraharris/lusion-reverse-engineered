const points = [new THREE.Vector3(562.4782069643945, -166.4946317179781, 56.10018915737797), new THREE.Vector3(-53.56300074753207, 171.49711742836848, 26.946154910300343), new THREE.Vector3(-89.0533434745719, -90.0652448026218, -14.02580260002766), new THREE.Vector3(-501.5958712011784, -39.858579849202485, -14.550849299769851), new THREE.Vector3(-19.133675423268905, 474.3271798391924, 67.03778757067208), new THREE.Vector3(355.72714050837595, 458.917612906306, 115.91524970108699)]

import * as THREE from "three"

export class LetterSpline extends THREE.Line {
    splineObject = undefined;

    constructor() {
        const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
        const points = [];
        points.push(new THREE.Vector3(- 10, 0, 0));
        points.push(new THREE.Vector3(0, 10, 0));
        points.push(new THREE.Vector3(10, 0, 0));

        const geometry = new THREE.BufferGeometry().setFromPoints([points[0], points[1]]);
        // const line = new THREE.Line( geometry, material );
        super(geometry, material);
    }
}