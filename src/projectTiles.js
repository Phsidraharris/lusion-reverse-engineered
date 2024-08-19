import * as THREE from "three";
import { debugGui } from "./debugGui";
import { createBevelledPlane, elementToWorldRect } from "./utils";
import ProjectTile from "./projectTiles/ProjectTile";

const ELEMENT_IDS = ["tile-1", "tile-2", "tile-3", "tile-4"];

export default class ProjectTiles extends THREE.Group {
    renderTarget;
    portalScene;
    portalCamera;
    projectTiles = [];

    constructor(camera) {
        super();

        ELEMENT_IDS.forEach(elementId => {
            const projectTile = new ProjectTile(elementId, camera);
            this.add(projectTile.tileMesh);
            this.projectTiles.push(projectTile);
        });
    }

    /**
     * @param {THREE.Renderer} renderer 
     */
    update(renderer) {
        this.projectTiles.forEach(projectTile => projectTile.update(renderer));
    }
}