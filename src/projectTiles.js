import * as THREE from "three";
import { createBevelledPlane } from "./utils";

export default class ProjectTiles extends THREE.Group {
    constructor(camera) {
        super();

        const mat = new THREE.MeshStandardMaterial({ color: "red" });

        const width = Math.abs(camera.left * 0.8);
        const aspect = 16 / 9;
        const tile1 = new THREE.Mesh(createBevelledPlane(width, width / aspect, 1), mat);


        this.position.y = camera.bottom;
        this.add(tile1);
    }
}