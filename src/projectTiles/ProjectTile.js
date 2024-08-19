import * as THREE from "three";
import { createBevelledPlane, elementToWorldRect } from "../utils";

export default class ProjectTile {
    renderTarget = new THREE.WebGLRenderTarget(512, 512 / (16 / 9));
    portalCamera = new THREE.PerspectiveCamera();
    portalScene = new THREE.Scene();
    tileMesh;
    taperAmount = {
        value: 0
    };
    tileMeshMat = new THREE.MeshStandardMaterial({
        onBeforeCompile: shader => {
            // shader.uniforms.map.value = this.renderTarget.texture;
            shader.uniforms.taperAmount = this.taperAmount;

            shader.uniforms.time = { value: 0 };
            shader.vertexShader = `uniform float taperAmount; 
                                  ${shader.vertexShader}`;
            shader.vertexShader = shader.vertexShader.replace(
                `#include <begin_vertex>`,
                `#include <begin_vertex>
                transformed = position;
                transformed.x *= 1.0 - mix(0.0,uv.y, taperAmount);
                `
            );
        },
    });

    get renderTexture() {
        return this.renderTarget.texture;
    }

    constructor(elementId, orthoCamera) {
        this.portalCamera.position.z = -3;
        this.portalScene.background = new THREE.Color("#fff");

        const light = new THREE.DirectionalLight("white", 2);
        light.position.set(0, 1, 0);
        this.portalScene.add(light);

        const portalObjMat = new THREE.MeshStandardMaterial();

        for (let i = 0; i < 3; i++) {
            const portalBox = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), portalObjMat);
            portalBox.position.random();
            portalBox.position.z = Math.random() * 10;
            portalBox.rotateY(Math.PI * 0.25);
            portalBox.rotateX(Math.PI * 0.25);

            this.portalScene.add(portalBox);
            this.portalCamera.lookAt(0, 0, 0);
        }

        this.initTileMesh(elementId, orthoCamera);

        document.getElementById(elementId).addEventListener("mousemove", e => this.onMouseMove(e));
        document.getElementById(elementId).addEventListener("mouseleave", e => this.onMouseLeave(e));
    }

    initTileMesh(elementId, orthoCamera) {
        const tileWorldRect = elementToWorldRect(elementId, orthoCamera);
        this.tileMeshMat.map = this.renderTexture;
        this.tileMesh = new THREE.Mesh(createBevelledPlane(tileWorldRect.width, tileWorldRect.height, 0.2), this.tileMeshMat);
        this.tileMesh.position.copy(tileWorldRect.position);
    }

    onMouseMove = (e) => {
        const rect = e.target.getBoundingClientRect();
        const xAbs = e.clientX - rect.left; //x position within the element.
        const yAbs = e.clientY - rect.top;  //y position within the element.

        let x = xAbs / rect.width;
        let y = yAbs / rect.height;

        x = (x - 0.5) * 2;
        y = (y - 0.5) * 2;

        const movementDamping = 1;
        this.portalCamera.position.x = x * movementDamping;
        this.portalCamera.position.y = y * movementDamping;
        this.portalCamera.lookAt(0, 0, 0);
    }

    onMouseLeave = (e) => {
        this.portalCamera.position.x = 0;
        this.portalCamera.position.y = 0;
        this.portalCamera.position.z = -3;
        this.portalCamera.lookAt(0, 0, 0);
    }

    update(renderer) {
        renderer.setRenderTarget(this.renderTarget);
        renderer.render(this.portalScene, this.portalCamera);
        renderer.setRenderTarget(null);
    }
}

// 1. create it. add objects to scene.
// 2. grab the render texture