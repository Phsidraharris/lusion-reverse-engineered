import * as THREE from 'three';
import { pagePixelsToWorldUnit } from './utils/utils';
import vertexShader from "./shaders/loadingMeshVert.glsl";
import fragmentShader from "./shaders/loadingMeshFrag.glsl";
import { debugGui } from './debugGui';

export default class LoadingGroup extends THREE.Group {
    letterRotation = { value: 0 };
    letterScale = { value: 1 };
    backgroundAlpha = { value: 1 };
    loadingProgress = { value: 0, target: 0 };
    postLoadSequenceProgress = { value: 0 };
    isSequenceFinished = false;

    constructor(camera, onDoneLoadSequence) {
        super();

        this.onDoneLoadSequence = onDoneLoadSequence;

        THREE.DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) => this.loadingProgress.target = itemsLoaded / itemsTotal;

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
        this.add(this.mesh);

        this.initDebug()
    }

    initDebug() {
        const folder = debugGui.addFolder("Loading");
        folder.add(this.letterRotation, "value", -Math.PI / 2, 0).name("Letter rotation");
        folder.add(this.letterScale, "value", 1, 10).name("Letter scale");
        folder.add(this.backgroundAlpha, "value", 0, 1).name("Background alpha");
        folder.add(this.loadingProgress, "value", 0, 1).name("Loading progress");
        folder.add(this.postLoadSequenceProgress, "value", 0, 1).name("Post load sequence");
    }

    update = (dt) => {
        if (this.isSequenceFinished) {
            return;
        }

        this.loadingProgress.value = THREE.MathUtils.lerp(this.loadingProgress.value, this.loadingProgress.target, dt * 10) + 0.000001;
        this.loadingProgress.value = Math.min(this.loadingProgress.value, 1);

        if (this.loadingProgress.value >= 1) {
            this.postLoadSequenceProgress.value += dt * 0.6;
            this.postLoadSequenceProgress.value = Math.min(this.postLoadSequenceProgress.value, 1);

            if (this.postLoadSequenceProgress.value == 1) {
                this.isSequenceFinished = true;
                this.onDoneLoadSequence?.();
            }
        }
    }
}