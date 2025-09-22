import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import PhysicsSandbox from "./physicsSandbox.js";
import LoadingGroup from "./loadingGroup.js";
import { AnimatedTube } from "./animatedTube.js";
import VideoPanelShader from "./videoPanelShader.js";
import ProjectTiles from "./projectTiles.js";
import { updateCameraIntrisics } from "./utils/utils.js";

class HomeScene {
    constructor() {
        this.frustumSize = 10;
        this.clock = new THREE.Clock();
        
        this.initThree();

        setTimeout(() => {
            this.initScene();
            this.initVideoPanelAnimations();
        }, 1);

        window.addEventListener("scroll", this.onScroll);
        window.addEventListener("resize", this.onWindowResized);

        if (import.meta.env.DEV) {
            this.stats = new Stats();
            document.body.appendChild(this.stats.dom);
        }
    }

    initThree = () => {
        const canvas = document.getElementById("canvas");
        if (!canvas) {
            throw new Error("Canvas element with id 'canvas' not found. Make sure your HTML contains <canvas id='canvas'></canvas> and scripts run after DOMContentLoaded.");
        }
        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas, stencil: true });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setAnimationLoop(this.animate);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;

        this.camera = new THREE.OrthographicCamera();
        this.camera.near = 0;
        this.camera.far = 1000;
        this.camera.position.z = 10;
        updateCameraIntrisics(this.camera, this.frustumSize);

        this.onScroll();

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#0f172a'); // Default dark background

        // Load HDR environment if available
        try {
            const loader = new RGBELoader();
            loader.load('/assets/hdri/studio_small_08_1k.hdr', (texture) => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                this.scene.environment = texture;
            });
        } catch (error) {
            console.warn('HDR environment loading failed:', error);
        }
    }

    initScene = () => {
        try {
            this.loadingGroup = new LoadingGroup(this.camera, () => {
                this.scene.remove(this.loadingGroup);
                this.loadingGroup = undefined;
            });
            this.scene.add(this.loadingGroup);
        } catch (error) {
            console.warn('LoadingGroup initialization failed:', error);
        }

        try {
            this.physicsSandbox = new PhysicsSandbox(this.camera);
            this.scene.add(this.physicsSandbox);
        } catch (error) {
            console.warn('PhysicsSandbox initialization failed:', error);
        }

        try {
            this.animatedTube = new AnimatedTube(this.camera);
            this.scene.add(this.animatedTube);
        } catch (error) {
            console.warn('AnimatedTube initialization failed:', error);
        }

        try {
            this.videoPanel = new VideoPanelShader(this.camera);
            this.scene.add(this.videoPanel);
        } catch (error) {
            console.warn('VideoPanelShader initialization failed:', error);
        }

        try {
            this.projectTiles = new ProjectTiles(this);
            this.scene.add(this.projectTiles);
        } catch (error) {
            console.warn('ProjectTiles initialization failed:', error);
        }
    }

    onScroll = () => {
        if (this.camera) {
            // Move the threejs camera's y position to make it appear to be scrolling with the page.
            this.camera.position.y = -window.scrollY / window.innerHeight * this.frustumSize;
        }
    }

    setCameraFrustumSize = (frustumSize) => {
        this.frustumSize = frustumSize;
        if (this.camera) {
            updateCameraIntrisics(this.camera, this.frustumSize);
        }
    }

    onWindowResized = () => {
        if (this.renderer && this.camera) {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            updateCameraIntrisics(this.camera, this.frustumSize);

            this.physicsSandbox && this.physicsSandbox.resize();
            this.animatedTube && this.animatedTube.resize();
            this.videoPanel && this.videoPanel.resize();
            this.projectTiles && this.projectTiles.resize();
        }
    }

    animate = () => {
        const dt = this.clock.getDelta();

        this.loadingGroup && this.loadingGroup.update(dt);
        this.physicsSandbox && this.physicsSandbox.update(dt);
        this.animatedTube && this.animatedTube.update(dt);
        this.videoPanel && this.videoPanel.update(dt);
        this.projectTiles && this.projectTiles.update(dt, this.renderer);

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
        this.stats && this.stats.update();
    }

    initDebug = () => {
        // GUI removed: using default animation parameters
    }

    initVideoPanelAnimations() {
        const section = document.getElementById('video-panel-section');
        if (!section) return;
        const topline = document.getElementById('h1-topline');
        const tagline = document.getElementById('h1-tagline');
        if (!topline || !tagline) return;
        // If already animated (e.g., from previous view), skip.
        if (topline.classList.contains('animate')) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    topline.classList.add('animate');
                    tagline.classList.add('animate');
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });
        observer.observe(section);
    }

    destroy() {
        // Cleanup event listeners
        window.removeEventListener("scroll", this.onScroll);
        window.removeEventListener("resize", this.onWindowResized);
        
        // Cleanup Three.js resources
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        // Remove stats if present
        if (this.stats && this.stats.dom && this.stats.dom.parentNode) {
            this.stats.dom.parentNode.removeChild(this.stats.dom);
        }
    }
}

// Export and create instance
export default HomeScene;

// Create instance when DOM is ready
let homeSceneInstance = null;

if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            homeSceneInstance = new HomeScene();
        });
    } else {
        homeSceneInstance = new HomeScene();
    }
}

export { homeSceneInstance };
