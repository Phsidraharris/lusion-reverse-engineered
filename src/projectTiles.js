import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import ProjectTile from "./projectTiles/ProjectTile";
import ProjectTileRobotScene from "./projectTiles/ProjectTileRobotScene";

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

    initTiles = async () => {
        this.projectTiles.forEach(projectTile => {
            this.remove(projectTile);
            projectTile.cleanup();
        });

        const projectTile1 = new ProjectTile("tile-1", "#44cc00", this.homeScene);
        const robotScene = await ProjectTileRobotScene.CreateAsync();
        projectTile1.addToPortalScene(robotScene);
        this.add(projectTile1);
        this.projectTiles.push(projectTile1);
    }

    /**
     * @param {THREE.Renderer} renderer 
     */
    update(dt, renderer) {
        this.projectTiles.forEach(projectTile => projectTile.update(dt, renderer));
    }
}