import * as THREE from 'three';
import { pagePixelsToWorldUnit } from './utils/utils';
import vertexShader from "./shaders/loadingMeshVert.glsl";
import fragmentShader from "./shaders/loadingMeshFrag.glsl";
import { debugGui } from './debugGui';

export default class LoadingGroup extends THREE.Group {
    letterRotation = { value: 0 };
    letterScale = { value: 1 }
    backgroundAlpha = { value: 1 }

    constructor(camera) {
        super();

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
                backgroundAlpha: this.backgroundAlpha
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
        folder.add(this.letterRotation, "value", 0, Math.PI / 2).name("Letter rotation");
        folder.add(this.letterScale, "value", 1, 10).name("Letter scale");
        folder.add(this.backgroundAlpha, "value", 0, 1).name("Background alpha");
    }
}