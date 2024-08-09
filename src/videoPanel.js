import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { debugGui } from "./debugGui";
import { pageToWorldCoords } from "./utils";

const TINT_COLOUR_START = new THREE.Color("#5b1473");
const TINT_COLOUR_END = new THREE.Color("#ffffff");

export class VideoPanel extends THREE.Group {
    mixer = null;
    action = null;
    animPlaybackPercent = 0;
    animClip;
    animDuration;

    constructor(camera) {
        super();

        this.initDebug();

        const colour = TINT_COLOUR_START.clone();

        const material = new THREE.MeshBasicMaterial({
            roughness: 0.1,
            metalness: 0,
            map: this.createVideoTexture(),
            side: THREE.FrontSide,
            color: colour
        });

        new GLTFLoader().load('../assets/panel-anim-bones.glb', (gltf) => {
            const mesh = gltf.scene.children[0].children[0];
            mesh.material = material;
            this.add(gltf.scene);

            // Set up the animation mixer
            this.mixer = new THREE.AnimationMixer(gltf.scene);

            this.animClip = gltf.animations[0];
            this.action = this.mixer.clipAction(this.animClip);
            this.action.play();

            this.animDuration = this.animClip.duration;
        }, undefined, (error) => {
            console.error(error);
        });

        const initialY = pageToWorldCoords(0, window.innerHeight * 1.9, camera).y;
        const targetY = pageToWorldCoords(0, window.innerHeight * 2.5, camera).y;
        this.position.y = initialY;
        this.scale.setScalar(3);

        window.addEventListener("scroll", (e) => {
            const animPercent = THREE.MathUtils.clamp(THREE.MathUtils.inverseLerp(window.innerHeight * 1.2, window.innerHeight * 1.9, window.scrollY), 0, 0.99);
            const yPos = THREE.MathUtils.lerp(initialY, targetY, animPercent);

            material.color = colour.lerpColors(TINT_COLOUR_START, TINT_COLOUR_END, animPercent);

            this.playAnimation(animPercent);
            this.position.y = yPos;
        });
    }

    initDebug() {
        const folder = debugGui.addFolder("VideoPanel");
        folder.add(this, "animPlaybackPercent", 0, 1).onChange(v => this.playAnimation(v));
    }

    playAnimation(percent) {
        if (this.action) {
            const time = Math.min(percent * this.animDuration, this.animDuration);
            this.mixer.setTime(time);
        }
    }

    createVideoTexture() {
        const video = document.createElement('video');
        video.src = 'assets/pexels-2519660-uhd_3840_2160_24fps.mp4';
        video.loop = true;
        video.muted = true;
        video.play();

        const texture = new THREE.VideoTexture(video);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.flipY = false;

        return texture;
    }

    update(dt) {
        // this.mixer && this.mixer.update(dt);
    }
}

const vertexShader = `
    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

// Fragment Shader
const fragmentShader = `
    uniform float time;
    uniform vec2 resolution;
    void main()	{
        float x = mod(time + gl_FragCoord.x, 20.) < 10. ? 1. : 0.;
        float y = mod(time + gl_FragCoord.y, 20.) < 10. ? 1. : 0.;
        gl_FragColor = vec4(vec3(min(x, y)), 1.);
    }
`;
