import * as THREE from "three";
import ProjectTile from "./projectTiles/ProjectTile";
import { elementToWorldRect, getElementPageCoords, pageToWorldCoords } from "./utils";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

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

        const loader = new GLTFLoader();

        ELEMENT_IDS.forEach(elementId => {
            const projectTile = new ProjectTile(elementId, this.pageOrthoCamera);

            loader.load('../assets/project-tiles/rp_mei_posed_001_30k.glb', (gltf) => {
                projectTile.portalScene.add(gltf.scene);
            });

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