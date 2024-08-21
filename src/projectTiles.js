import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import ProjectTile from "./projectTiles/ProjectTile";

const ELEMENT_IDS = ["tile-1", "tile-2", "tile-3", "tile-4"];

export default class ProjectTiles extends THREE.Group {
    renderTarget;
    portalScene;
    portalCamera;
    projectTiles = [];
    homeScene;

    constructor(homeScene) {
        super();

        this.homeScene = homeScene;
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
            const projectTile = new ProjectTile(elementId, this.homeScene);

            // loader.load('../assets/project-tiles/rp_mei_posed_001_30k.glb', (gltf) => {
            //     projectTile.addToPortalScene(gltf.scene);
            //     projectTile.forceRenderOnce = true;
            // });

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