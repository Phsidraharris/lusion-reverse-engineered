import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class VideoPanel extends THREE.Group {
    constructor() {
        super();

        const loader = new GLTFLoader();
        let mixer, action;

        const group = this;

        loader.load('../assets/panel-anim-new.glb', (gltf) => {
            group.add(gltf.scene);
            console.log(gltf)

            // Set up the animation mixer
            mixer = new THREE.AnimationMixer(gltf.scene);

            // Get the first animation and create an action
            const clip = gltf.animations[0]; // Assuming there's at least one animation
            action = mixer.clipAction(clip);

            // Play the animation action
            action.play();
        }, undefined, (error) => {
            console.error(error);
        });
    }

}