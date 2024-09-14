import * as THREE from 'three';
import { pagePixelsToWorldUnit } from './utils/utils';
import vertexShader from "./shaders/loadingMeshVert.glsl";
import fragmentShader from "./shaders/loadingMeshFrag.glsl";

export default class LoadingGroup extends THREE.Group {
    constructor(camera) {
        super();

        const width = pagePixelsToWorldUnit(window.innerWidth, camera);
        const height = pagePixelsToWorldUnit(window.innerHeight, camera);

        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            depthTest: false,
            uniforms: {
                aspect: { value: window.innerWidth / window.innerHeight }
            }
        });

        this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), this.material);
        this.mesh.renderOrder = 1000;
        this.add(this.mesh);
    }
}