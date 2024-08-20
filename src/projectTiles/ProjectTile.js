import * as THREE from "three";
import { createBevelledPlane, elementToWorldRect } from "../utils";

const ASPECT = 16 / 9;
const CAMERA_POS_START = new THREE.Vector3(0, 1.2, 3);
const CAMERA_LOOKAT = new THREE.Vector3(0, 0.9, 0);
const RENDER_TEXTURE_WIDTH = 512;
const RENDER_TEXTURE_HEIGHT = RENDER_TEXTURE_WIDTH / ASPECT;

export default class ProjectTile extends THREE.Group {
    tileElementId;
    pageOrthoCamera;
    renderTarget = new THREE.WebGLRenderTarget(RENDER_TEXTURE_WIDTH, RENDER_TEXTURE_HEIGHT, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
    });
    portalCamera = new THREE.PerspectiveCamera(45, ASPECT, 0, 100);
    portalScene = new THREE.Scene();
    tileMesh;
    taperAmount = {
        value: 0
    };
    tileMeshTargetScale = 1;

    tileMeshMat = new THREE.MeshBasicMaterial({
        onBeforeCompile: shader => {
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
    targetCameraPosition = CAMERA_POS_START.clone();//new THREE.Vector3(CAMERA_POS_START.x, CAMERA_POS_START.y, CAMERA_POS_START.z);

    get renderTexture() {
        return this.renderTarget.texture;
    }

    constructor(elementId, orthoCamera) {
        super();

        this.elementId = elementId;
        this.pageOrthoCamera = orthoCamera;

        this.portalCamera.position.copy(this.targetCameraPosition);

        this.portalScene.background = new THREE.Color("#222");

        const light = new THREE.DirectionalLight("white", 2);
        light.position.set(0, 1, 0);
        this.portalScene.add(light);

        const portalObjMat = new THREE.MeshStandardMaterial();

        for (let i = 0; i < 3; i++) {
            const portalBox = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), portalObjMat);
            portalBox.position.random();
            portalBox.position.z = -Math.random() * 10;
            portalBox.rotateY(Math.PI * 0.25);
            portalBox.rotateX(Math.PI * 0.25);

            this.portalScene.add(portalBox);
            this.portalCamera.lookAt(CAMERA_LOOKAT);
        }

        this.initTileMesh();

        document.getElementById(elementId).addEventListener("mousemove", this.onMouseMove);
        document.getElementById(elementId).addEventListener("mouseleave", this.onMouseLeave);
        document.getElementById(elementId).addEventListener("click", this.onClick);
    }

    initTileMesh() {
        const tileWorldRect = elementToWorldRect(this.elementId, this.pageOrthoCamera);
        this.tileMeshMat.map = this.renderTexture;
        this.tileMesh = new THREE.Mesh(createBevelledPlane(tileWorldRect.width, tileWorldRect.height, 0.2), this.tileMeshMat);
        this.tileMesh.position.copy(tileWorldRect.position);

        this.add(this.tileMesh);
    }

    onMouseMove = (e) => {
        const rect = e.target.getBoundingClientRect();
        const xAbs = e.clientX - rect.left; //x position within the element.
        const yAbs = e.clientY - rect.top;  //y position within the element.

        let x = xAbs / rect.width;
        let y = yAbs / rect.height;

        x = (x - 0.5) * 2;
        y = (y - 0.5) * 2;

        this.targetCameraPosition.x = CAMERA_POS_START.x + x;
        this.targetCameraPosition.y = CAMERA_POS_START.y + y;
        this.targetCameraPosition.z = CAMERA_POS_START.z;
    }

    onMouseLeave = (e) => {
        this.targetCameraPosition.copy(CAMERA_POS_START);
    }

    onClick = (e) => {
        this.tileMeshTargetScale = 10;
    }

    update(dt, renderer) {
        const scale = THREE.MathUtils.lerp(this.tileMesh.scale.x, this.tileMeshTargetScale, dt * 5);

        this.tileMesh.scale.setScalar(scale);
        this.portalCamera.position.lerp(this.targetCameraPosition, dt * 10);
        this.portalCamera.lookAt(CAMERA_LOOKAT);

        renderer.setRenderTarget(this.renderTarget);
        renderer.render(this.portalScene, this.portalCamera);
        renderer.setRenderTarget(null);

    }

    cleanup() {
        this.renderTarget.dispose();
        this.tileMeshMat.dispose();

        document.getElementById(this.elementId).removeEventListener("mousemove", this.onMouseMove);
        document.getElementById(this.elementId).removeEventListener("mouseleave", this.onMouseLeave);
    }
}