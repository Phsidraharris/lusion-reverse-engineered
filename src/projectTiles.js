import * as THREE from "three";
import { debugGui } from "./debugGui";
import { createBevelledPlane, elementToWorldRect } from "./utils";

const ELEMENT_IDS = ["tile-1", "tile-2", "tile-3", "tile-4"];

export default class ProjectTiles extends THREE.Group {
    renderTarget;
    portalScene;
    portalCamera;
    taperAmount = {
        value: 0
    };

    shaderMaterial = new THREE.MeshStandardMaterial({
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
        }
    });

    constructor(camera) {
        super();

        this.initPortal();

        ELEMENT_IDS.forEach(elementId => {
            document.getElementById(elementId).addEventListener("mousemove", e => this.onMouseMove(e));
            document.getElementById(elementId).addEventListener("mouseleave", e => this.onMouseLeave(e));

            const tileWorldRect = elementToWorldRect(elementId, camera);
            const mesh = new THREE.Mesh(createBevelledPlane(tileWorldRect.width, tileWorldRect.height, 0.2), this.shaderMaterial);
            mesh.position.copy(tileWorldRect.position);

            this.add(mesh);
        });

        this.initDebug();
    }

    initPortal() {
        this.renderTarget = new THREE.WebGLRenderTarget(512, 512 / (16 / 9));

        this.portalCamera = new THREE.PerspectiveCamera();
        this.portalCamera.position.z = -3;

        this.portalScene = new THREE.Scene();
        this.portalScene.background = new THREE.Color("#222222");

        const light = new THREE.DirectionalLight("white", 2);
        light.position.set(0, 1, 0);

        this.portalScene.add(light);

        this.shaderMaterial.map = this.renderTarget.texture;
        
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
    }

    initDebug() {
        const folder = debugGui.addFolder("Project Tiles");
        folder.add(this.taperAmount, "value", -1, 1)
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

    /**
     * @param {THREE.Renderer} renderer 
     */
    update(renderer) {
        renderer.setRenderTarget(this.renderTarget);
        renderer.render(this.portalScene, this.portalCamera);
        renderer.setRenderTarget(null);
    }
}