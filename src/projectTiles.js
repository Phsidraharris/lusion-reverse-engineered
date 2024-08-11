import * as THREE from "three";
import { createBevelledPlane, elementToWorldRect, getElementPageCoords, pagePixelsToWorldUnit, pageToWorldCoords } from "./utils";
import { debugGui } from "./debugGui";

const ELEMENT_IDS = ["tile-1", "tile-2", "tile-3", "tile-4"];

const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform sampler2D texture;
    uniform float blurRadius;
    varying vec2 vUv;
    void main() {
        vec4 sum = vec4(0.0);
        for (float i = -4.0; i <= 4.0; i++) {
            for (float j = -4.0; j <= 4.0; j++) {
                vec2 offset = vec2(i, j) * blurRadius;
                sum += texture2D(texture, vUv + offset);
            }
        }
        gl_FragColor = sum / 81.0;
    }
`;

export default class ProjectTiles extends THREE.Group {
    portalMaterial;
    renderTarget;
    portalScene;
    portalCamera;

    constructor(camera) {
        super();

        this.initPortal();

        ELEMENT_IDS.forEach(elementId => {
            document.getElementById(elementId).addEventListener("mousemove", e => this.onMouseMove(e));

            const tile1WorldRect = elementToWorldRect(elementId, camera);

            console.log("tile", tile1WorldRect.position)
            const tile1 = new THREE.Mesh(createBevelledPlane(tile1WorldRect.width, tile1WorldRect.height, 0.2), this.portalMaterial);
            tile1.position.copy(tile1WorldRect.position);
            this.add(tile1);
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

        this.portalMaterial = new THREE.MeshStandardMaterial({ map: this.renderTarget.texture });

        const boxMat = new THREE.MeshStandardMaterial();

        for (let i = 0; i < 3; i++) {
            const portalBox = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), boxMat);
            portalBox.position.random();
            portalBox.position.z = Math.random() * 18;
            portalBox.rotateY(Math.PI * 0.25);
            portalBox.rotateX(Math.PI * 0.25);

            this.portalScene.add(portalBox);
            this.portalCamera.lookAt(0, 0, 0);
        }
    }

    initDebug() {
        const folder = debugGui.addFolder("Project Tiles");
        folder.add(this.portalCamera.position, "x", -10, 10);
        folder.add(this.portalCamera.position, "y", -10, 10);
        folder.add(this.portalCamera.position, "z", -10, 10);
        folder.add(this.portalCamera.rotation, "x", -10, 10);
        folder.add(this.portalCamera.position, "y", -10, 10);
        folder.add(this.portalCamera.position, "z", -10, 10);
    }

    onMouseMove = (e) => {
        const elementId = e.target.id;

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

    /**
     * 
     * @param {THREE.Renderer} renderer 
     */
    update(renderer) {
        renderer.setRenderTarget(this.renderTarget);
        renderer.render(this.portalScene, this.portalCamera);
        renderer.setRenderTarget(null);
    }
}