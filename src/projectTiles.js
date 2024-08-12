import * as THREE from "three";
import { createBevelledPlane, elementToWorldRect, getElementPageCoords, pagePixelsToWorldUnit, pageToWorldCoords } from "./utils";
import { debugGui } from "./debugGui";

const ELEMENT_IDS = ["tile-1", "tile-2", "tile-3", "tile-4"];

const vertexShader = `
    uniform float v;
    varying vec3 vNormal;
    void main() {
        vNormal = normalize(normalMatrix * normal);

        // Calculate the taper factor based on the position along the y-axis
        float taperFactor = 1.0 - 0.5 * (position.y / v);

        // Apply taper factor to the x and z coordinates
        vec3 newPosition = position;
        newPosition.x *= taperFactor;
        newPosition.z *= taperFactor;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
`;

const fragmentShader = `
    varying vec3 vNormal;
    void main() {
        gl_FragColor = vec4(vNormal * 0.5 + 0.5, 1.0);
    }
`;

const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
        v: { value: 1.0 }
    }
});

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
            document.getElementById(elementId).addEventListener("mouseleave", e => this.onMouseLeave(e));

            const tileWorldRect = elementToWorldRect(elementId, camera);
            const mesh = new THREE.Mesh(createBevelledPlane(tileWorldRect.width, tileWorldRect.height, 0.2), shaderMaterial);
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

        this.portalMaterial = new THREE.MeshStandardMaterial({ map: this.renderTarget.texture });

        const boxMat = new THREE.MeshStandardMaterial();

        for (let i = 0; i < 3; i++) {
            const portalBox = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), boxMat);
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
        folder.add(this.portalCamera.position, "x", -10, 10);
        folder.add(this.portalCamera.position, "y", -10, 10);
        folder.add(this.portalCamera.position, "z", -10, 10);
        folder.add(this.portalCamera.rotation, "x", -10, 10);
        folder.add(this.portalCamera.position, "y", -10, 10);
        folder.add(this.portalCamera.position, "z", -10, 10);
        folder.add(shaderMaterial.uniforms.v, "value", 1, 100)

        console.log(shaderMaterial.uniforms)
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
     * 
     * @param {THREE.Renderer} renderer 
     */
    update(renderer) {
        renderer.setRenderTarget(this.renderTarget);
        renderer.render(this.portalScene, this.portalCamera);
        renderer.setRenderTarget(null);
    }
}