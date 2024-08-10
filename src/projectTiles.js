import * as THREE from "three";
import { createBevelledPlane, elementToWorldRect, getElementPageCoords, pagePixelsToWorldUnit, pageToWorldCoords } from "./utils";

const ELEMENT_IDS = ["tile-1", "tile-2", "tile-3", "tile-4"];

export default class ProjectTiles extends THREE.Group {
    constructor(camera) {
        super();

        const mat = new THREE.MeshStandardMaterial({ color: "red" });

        ELEMENT_IDS.forEach(element => {
            const tile1WorldRect = elementToWorldRect(element, camera);
            const tile1 = new THREE.Mesh(createBevelledPlane(tile1WorldRect.width, tile1WorldRect.height, 0.2), mat);
            tile1.position.copy(tile1WorldRect.position);
            this.add(tile1);
        });
    }
}