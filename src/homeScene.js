import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import PhysicsSandbox from "./physicsSandbox.js";
import LoadingGroup from "./loadingGroup.js";
import { AnimatedTube } from "./animatedTube.js";
import VideoPanelShader from "./videoPanelShader.js";
import ProjectTiles from "./projectTiles.js";
import adaptiveQuality from './utils/adaptiveQuality.js';
import { initDebugOverlay } from './utils/debugOverlay.js';
import { observeOnce } from './utils/lazyObserve.js';
import { createDynamicResolution } from './utils/dynamicResolution.js';
import { registerVisibility } from './utils/visibility.js';
import { subscribeScroll } from './utils/scrollFrame.js';
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

    // Use scroll frame batching
    this._unsubscribeScroll = subscribeScroll(this.onScroll);
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
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas, stencil: true, powerPreference: 'high-performance' });
        this.renderer.setPixelRatio(adaptiveQuality.clampDPR(window.devicePixelRatio));
        this._dynamicRes = createDynamicResolution(this.renderer, {
            min: adaptiveQuality.tier === 'low' ? 0.75 : 0.85,
            max: adaptiveQuality.clampDPR(window.devicePixelRatio),
            downscaleThreshold: adaptiveQuality.tier === 'ultra' ? 24 : 20,
            upscaleThreshold: adaptiveQuality.tier === 'low' ? 12 : 14,
        });
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

        // Defer HDR environment load to idle / after first paint to reduce TTI.
        const loadHdr = () => {
            try {
                const loader = new RGBELoader();
                loader.load('/assets/hdri/studio_small_08_1k.hdr', (texture) => {
                    texture.mapping = THREE.EquirectangularReflectionMapping;
                    this.scene.environment = texture;
                });
            } catch (error) {
                console.warn('HDR environment loading failed:', error);
            }
        };
        if ('requestIdleCallback' in window) {
            requestIdleCallback(loadHdr, { timeout: 2500 });
        } else {
            setTimeout(loadHdr, 1500);
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

        if (adaptiveQuality.physicsEnabled) {
            try {
                this.physicsSandbox = new PhysicsSandbox(this.camera);
                this.scene.add(this.physicsSandbox);
            } catch (error) {
                console.warn('PhysicsSandbox initialization failed:', error);
            }
        }

        try {
            this.animatedTube = new AnimatedTube(this.camera);
            this.scene.add(this.animatedTube);
        } catch (error) {
            console.warn('AnimatedTube initialization failed:', error);
        }

        // Lazy load video panel when section enters viewport
        if (adaptiveQuality.enableVideoPanel) {
            observeOnce('video-panel-section', () => {
                try {
                    this.videoPanel = new VideoPanelShader(this.camera);
                    this.scene.add(this.videoPanel);
                } catch (error) {
                    console.warn('VideoPanelShader initialization failed:', error);
                }
            });
        }

        try {
            this.projectTiles = new ProjectTiles(this);
            this.scene.add(this.projectTiles);
            // Defer expensive GLTF loads until first tile intersects
            observeOnce('tile-1', () => {
                this.projectTiles.initTiles?.();
            });
        } catch (error) {
            console.warn('ProjectTiles initialization failed:', error);
        }
        // Optional debug overlay (user triggers via ?debugPerf=1)
        initDebugOverlay();
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
        const frameStart = performance.now();
        const dt = this.clock.getDelta();
        this._frameIndex = (this._frameIndex || 0) + 1;

        // Visibility gating
        this._visPhysics = this._visPhysics || registerVisibility('physics-sandbox-div');
        this._visVideo = this._visVideo || registerVisibility('video-panel-section');
        this._visTiles = this._visTiles || registerVisibility('tile-1');

        this.loadingGroup && this.loadingGroup.update(dt);

        const tier = adaptiveQuality.tier;
        const every = (n) => (this._frameIndex % n === 0);

        // Update ordering (cheap -> expensive)
        if (this.physicsSandbox && (tier !== 'low') && this._visPhysics()) {
            this.physicsSandbox.update(dt);
        }
        if (this.animatedTube) {
            // mild throttling on low tier
            if (tier === 'low' ? every(2) : true) this.animatedTube.update(dt);
        }
        if (this.videoPanel && this._visVideo()) {
            if (tier === 'low' ? every(3) : true) this.videoPanel.update(dt);
        }
        if (this.projectTiles && this._visTiles()) {
            if (tier === 'low' ? every(2) : true) this.projectTiles.update(dt, this.renderer);
        }

        // Dynamic resolution scaling (after potential throttling)
        const frameMs = performance.now() - frameStart;
        this._dynamicRes && this._dynamicRes.update(dt, frameMs);

        if (frameMs > 20) {
            window.__RODIAX_FRAME_SKIPS__ = (window.__RODIAX_FRAME_SKIPS__ || 0) + (frameMs > 32 ? 2 : 1);
        }

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
    this._unsubscribeScroll && this._unsubscribeScroll();
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
