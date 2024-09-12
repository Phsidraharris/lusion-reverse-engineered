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
        const projectTile1 = new ProjectTile("tile-1", this.homeScene, { backgroundColor: "#44cc00" });
        const robotSceneGlb = await loader.loadAsync("../../assets/project-tiles/robot-scene.glb")
        projectTile1.addToPortalScene(robotSceneGlb.scene);

        const projectTile2 = new ProjectTile("tile-2", this.homeScene);
        const ballSceneGlb = await loader.loadAsync("../../assets/project-tiles/ball-scene.glb")
        this.adjustLightingInGlb(ballSceneGlb);
        projectTile2.addToPortalScene(ballSceneGlb.scene);

        const projectTile3 = new ProjectTile("tile-3", this.homeScene, {cameraPosition: new THREE.Vector3(0, 4, -3)});
        const gridScene = await loader.loadAsync("../../assets/project-tiles/3d_grid_tool.glb")
        this.adjustLightingInGlb(gridScene);
        projectTile3.addToPortalScene(gridScene.scene);

        this.add(projectTile1);
        this.add(projectTile2);
        this.add(projectTile3);

        this.projectTiles.push(projectTile1);
        this.projectTiles.push(projectTile2);
        this.projectTiles.push(projectTile3);
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