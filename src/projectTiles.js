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

    initTiles = async () => {
        this.projectTiles.forEach(projectTile => {
            this.remove(projectTile);
            projectTile.cleanup();
        });

        const loader = new GLTFLoader();

        // Tile 1
        const projectTile1 = new ProjectTile("tile-1", "#44cc00", this.homeScene);
        const robotSceneGlb = await loader.loadAsync("../../assets/project-tiles/robot-scene.glb")
        projectTile1.addToPortalScene(robotSceneGlb.scene);

        const projectTile2 = new ProjectTile("tile-2", "#dd77aa", this.homeScene);
        const robotSceneGlb2 = await loader.loadAsync("../../assets/project-tiles/ball-scene.glb")
        this.adjustLightingInGlb(robotSceneGlb2);
        projectTile2.addToPortalScene(robotSceneGlb2.scene);

        this.add(projectTile1);
        this.add(projectTile2);

        this.projectTiles.push(projectTile1);
        this.projectTiles.push(projectTile2);
    }

    adjustLightingInGlb = (glb) => {
        const lights = glb.scene.getObjectsByProperty("type", "PointLight");
        const meshes = glb.scene.getObjectsByProperty("type", "Mesh");

        lights.forEach(light => {
            light.castShadow = true;
            light.intensity /= 20;
            light.shadow.radius = 16;
        });

        meshes.forEach(mesh => {
            mesh.castShadow = true;
            mesh.receiveShadow = true;
        })

        console.log(meshes)
    }

    /**
     * @param {THREE.Renderer} renderer 
     */
    update(dt, renderer) {
        this.projectTiles.forEach(projectTile => projectTile.update(dt, renderer));
    }
}