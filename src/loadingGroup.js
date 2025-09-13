import { CountUp } from 'countup.js';
import * as THREE from 'three';
import fragmentShader from "./shaders/loadingMeshFrag.glsl";
import vertexShader from "./shaders/loadingMeshVert.glsl";
import { pagePixelsToWorldUnit, pageToWorldCoords } from './utils/utils';

const LOADING_CONTENT_ID = "loading-content";
const HOME_CONTENT_ID = "home-content";

export default class LoadingGroup extends THREE.Group {
    letterRotation = { value: 0 };
    letterScale = { value: 1 };
    backgroundAlpha = { value: 1 };
    loadingProgress = { value: 0, target: 0 };
    postLoadSequenceProgress = { value: 0 };
    isSequenceFinished = false;
    loadingContentEl = document.getElementById(LOADING_CONTENT_ID);
    homeContentEl = document.getElementById(HOME_CONTENT_ID);

    constructor(camera, onDoneLoadSequence) {
        super();

        // Wait for DOM elements to exist before proceeding
        if (!document.getElementById(LOADING_CONTENT_ID) || !document.getElementById(HOME_CONTENT_ID)) {
            window.addEventListener("DOMContentLoaded", () => {
                this._init(camera, onDoneLoadSequence);
            });
        } else {
            this._init(camera, onDoneLoadSequence);
        }
    }

    _init(camera, onDoneLoadSequence) {
        this.loadingContentEl = document.getElementById(LOADING_CONTENT_ID);
        this.homeContentEl = document.getElementById(HOME_CONTENT_ID);

        if (!this.loadingContentEl || !this.homeContentEl) {
            throw new Error("LoadingGroup: Required DOM elements not found.");
        }

        document.body.classList.add("no-scroll");
        this.onDoneLoadSequence = onDoneLoadSequence;

        THREE.DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            if (itemsTotal === 0) return; // avoid NaN
            const percent = itemsLoaded / itemsTotal;
            this.countUp.update(Math.round(percent * 100));
            this.loadingProgress.target = percent;
            this._lastProgressTs = performance.now();
        };

        this.initOdometer();
        this.countUp.start?.();
        this.initMesh(camera);
        this.initDebug();
        // Fallback: force-complete if progress stalls (e.g., assets cached or never triggering)
        this._fallbackInterval = setInterval(() => {
            const now = performance.now();
            if (!this._lastProgressTs) this._lastProgressTs = now;
            // If no progress events for 3s, assume loaded.
            if (now - this._lastProgressTs > 3000 && this.loadingProgress.target < 1) {
                this.loadingProgress.target = 1;
            }
            // Cleanup interval when finished
            if (this.isSequenceFinished) {
                clearInterval(this._fallbackInterval);
            }
        }, 1000);
    }

    initOdometer = () => {
        this.countUp = new CountUp(this.loadingContentEl, 100, {
            formattingFn: (n) => n.toString().padStart(3, '0')
        });
    }

    initMesh = (camera) => {
        const pos = pageToWorldCoords(window.innerWidth * 0.5, window.innerHeight * 0.5, camera);
        const width = pagePixelsToWorldUnit(window.innerWidth, camera);
        const height = pagePixelsToWorldUnit(window.innerHeight, camera);

        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            depthTest: false,
            uniforms: {
                aspect: { value: window.innerWidth / window.innerHeight },
                letterRotation: this.letterRotation,
                letterScale: this.letterScale,
                backgroundAlpha: this.backgroundAlpha,
                loadingProgress: this.loadingProgress,
                postLoadSequenceProgress: this.postLoadSequenceProgress,
            },
            transparent: true
        });

        this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), this.material);
        this.mesh.renderOrder = 1000;
        this.mesh.position.copy(pos);
        this.add(this.mesh);
    }

    initDebug() {
        // GUI removed - using internal defaults
    }

    update = (dt) => {
        if (this.isSequenceFinished) {
            return;
        }

        this.loadingProgress.value = THREE.MathUtils.lerp(this.loadingProgress.value, this.loadingProgress.target, dt * 10) + 0.0000000001;
        this.loadingProgress.value = Math.min(this.loadingProgress.value, 1);

        if (this.loadingProgress.value >= 1) {
            this.postLoadSequenceProgress.value += dt * 0.6;
            this.postLoadSequenceProgress.value = Math.min(this.postLoadSequenceProgress.value, 1);

            if (this.postLoadSequenceProgress.value == 1) {
                this.isSequenceFinished = true;

                document.body.classList.remove("no-scroll");
                this.loadingContentEl.remove();
                this.homeContentEl.classList.remove("fade-out");
                this.onDoneLoadSequence?.();
            }
        }
    }
}