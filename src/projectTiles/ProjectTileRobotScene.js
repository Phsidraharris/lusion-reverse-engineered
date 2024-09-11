import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export default class ProjectTileRobotScene extends THREE.Group {
    static async CreateAsync() {
        const scene = new ProjectTileRobotScene();

        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync("../../assets/project-tiles/robot-scene.glb")

        scene.add(gltf.scene);

        return scene;
    }
}