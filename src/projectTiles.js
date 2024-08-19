import * as THREE from "three";
import ProjectTile from "./projectTiles/ProjectTile";
import { elementToWorldRect, getElementPageCoords, pageToWorldCoords } from "./utils";

const ELEMENT_IDS = ["tile-1", "tile-2", "tile-3", "tile-4"];

export default class ProjectTiles extends THREE.Group {
    renderTarget;
    portalScene;
    portalCamera;
    projectTiles = [];
    pageOrthoCamera;

    constructor(camera) {
        super();

        this.pageOrthoCamera = camera;
        this.initTiles();

        window.addEventListener("resize", () => this.initTiles());
    }

    initTiles = () => {
        this.projectTiles.forEach(projectTile => {
            this.remove(projectTile);
            projectTile.cleanup();
        });

        ELEMENT_IDS.forEach(elementId => {
            const projectTile = new ProjectTile(elementId, this.pageOrthoCamera);
            this.add(projectTile);
            this.projectTiles.push(projectTile);
        });
    }

    /**
     * @param {THREE.Renderer} renderer 
     */
    update(dt, renderer) {
        this.projectTiles.forEach(projectTile => projectTile.update(dt, renderer));
    }
}