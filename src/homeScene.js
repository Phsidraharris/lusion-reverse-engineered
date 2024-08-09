import * as THREE from "three";
import Stats from 'three/addons/libs/stats.module.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import PhysicsSandbox from "./physicsSandbox";
import { updateCameraIntrisics } from "./utils";
import { AnimatedTube } from "./animatedTube";

class HomeScene {
    frustumSize = 10;    // value of 1 results in 1 world space unit equating to height of viewport
    camera;
    renderer;
    scene;
    stats = new Stats();
    physicsSandbox;
    animatedTube;

    constructor() {
        this.initThree();
        this.initScene();

        document.body.appendChild(this.stats.dom);

        window.addEventListener("scroll", this.onScroll);
        window.addEventListener('resize', this.onWindowResized);
    }

    initThree = () => {
        const canvas = document.getElementById("canvas");

        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas, stencil: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setAnimationLoop(this.animate);

        this.camera = new THREE.OrthographicCamera();
        this.camera.near = 0;
        this.camera.far = 1000;
        this.camera.position.z = 10;
        updateCameraIntrisics(this.camera, this.frustumSize);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(window.getComputedStyle(document.body).backgroundColor);

        new RGBELoader().setPath('assets/').load('quarry_01_1k.hdr', (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            this.scene.environment = texture;
            // this.scene.backgroundIntensity = 0;
        });
    }

    initScene = () => {
        this.physicsSandbox = new PhysicsSandbox(this.camera);
        this.scene.add(this.physicsSandbox);

        this.animatedTube = new AnimatedTube(this.camera);
        this.scene.add(this.animatedTube)
    }

    onScroll = () => {
        // Move the threejs camera's y position to make it appear to be scrolling with the page.
        this.camera.position.y = -window.scrollY / window.innerHeight * this.frustumSize;
    }

    onWindowResized = () => {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        updateCameraIntrisics(this.camera, this.frustumSize);
    }

    animate = () => {
        this.renderer.render(this.scene, this.camera);
        this.stats.update();
        this.physicsSandbox && this.physicsSandbox.update();
    }
}

new HomeScene();