import * as THREE from "three";
import { animateAsync, waitAsync } from "../utils/animationUtils";
import { createBevelledPlane, elementToWorldRect } from "../utils/utils";
import { debugGui } from "../debugGui";
import TileMeshMaterial from "./TileMeshMaterial";

const ASPECT = 16 / 9;
const CAMERA_POS_START = new THREE.Vector3(0, 0, 4);
const CAMERA_LOOKAT = new THREE.Vector3(0, 0, 0);
const CAMERA_MOVEMENT_COEF = 0.6;
const RENDER_TEXTURE_WIDTH = 512;
const RENDER_TEXTURE_HEIGHT = RENDER_TEXTURE_WIDTH / ASPECT;

export default class ProjectTile extends THREE.Group {
    tileElementId;
    homeScene;
    renderTarget = new THREE.WebGLRenderTarget(RENDER_TEXTURE_WIDTH, RENDER_TEXTURE_HEIGHT, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
    });
    portalCamera = new THREE.PerspectiveCamera(45, ASPECT);
    portalScene = new THREE.Scene();
    taperAmount = { value: 0 };
    tileMesh;
    tileMeshMat = new TileMeshMaterial(this.taperAmount);
    targetCameraPosition = CAMERA_POS_START.clone();//new THREE.Vector3(CAMERA_POS_START.x, CAMERA_POS_START.y, CAMERA_POS_START.z);
    forceRenderOnce = true;

    get renderTexture() {
        return this.renderTarget.texture;
    }

    constructor(elementId, homeScene) {
        super();

        this.elementId = elementId;
        this.homeScene = homeScene;

        this.initPortalScene();
        this.initTileMesh();

        document.getElementById(elementId).addEventListener("mousemove", this.onMouseMove);
        document.getElementById(elementId).addEventListener("mouseleave", this.onMouseLeave);
        document.getElementById(elementId).addEventListener("click", this.onClick);

        this.initDebug();
    }

    initPortalScene = () => {
        this.portalScene.background = new THREE.Color("#222");

        this.portalCamera.position.copy(this.targetCameraPosition);
        this.portalCamera.lookAt(CAMERA_LOOKAT);

        const portalObjMat = new THREE.MeshStandardMaterial({ transparent: true });
        const portalSphere = new THREE.Mesh(new THREE.SphereGeometry(0.3), portalObjMat);

        const portalBox = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), portalObjMat);
        portalBox.rotateY(Math.PI * 0.25);
        portalBox.rotateX(Math.PI * 0.25);

        this.portalScene.add(portalBox, portalSphere);

        const light = new THREE.DirectionalLight("white", 2);
        light.position.random();
        this.portalScene.add(light);
    }

    initTileMesh() {
        const tileWorldRect = elementToWorldRect(this.elementId, this.homeScene.camera);
        this.tileMeshMat.map = this.renderTexture;
        this.tileMesh = new THREE.Mesh(createBevelledPlane(tileWorldRect.width, tileWorldRect.height, 0.2), this.tileMeshMat);
        this.tileMesh.position.copy(tileWorldRect.position);

        this.add(this.tileMesh);
    }

    addToPortalScene = (object) => {
        this.portalScene.add(object);
    }

    onMouseMove = (e) => {
        const rect = e.target.getBoundingClientRect();
        const xAbs = e.clientX - rect.left; //x position within the element.
        const yAbs = e.clientY - rect.top;  //y position within the element.

        let x = xAbs / rect.width;
        let y = yAbs / rect.height;

        x = (x - 0.5) * 2 * CAMERA_MOVEMENT_COEF;
        y = (y - 0.5) * 2 * CAMERA_MOVEMENT_COEF;

        this.targetCameraPosition.x = CAMERA_POS_START.x + x;
        this.targetCameraPosition.y = CAMERA_POS_START.y - y;
        this.targetCameraPosition.z = CAMERA_POS_START.z;
    }

    onMouseLeave = (e) => {
        this.targetCameraPosition.copy(CAMERA_POS_START);
    }

    onClick = async () => {
        function addCssClass(isForward) {
            const homeContent = document.getElementById("home-content");
            if (isForward) {
                homeContent.classList.add("fade-out");
            }
            else {
                homeContent.classList.remove("fade-out");
            }
        }

        const zoomSequence = async (portalCamTargetZoom, pageCamTargetFrustum, pageCamTargetPosition, pageCamTargetRotationZ) => {
            const portalCamStartZoom = this.portalCamera.zoom;
            const pageCamStartFrustum = this.homeScene.frustumSize;
            const pageCamStartPosition = this.homeScene.camera.position.clone();
            const pageCamStartRotationZ = this.homeScene.camera.rotation.z;

            await animateAsync(500, (percent) => {
                const portalCamZoom = THREE.MathUtils.lerp(portalCamStartZoom, portalCamTargetZoom, percent);
                const pageCamFrustum = THREE.MathUtils.lerp(pageCamStartFrustum, pageCamTargetFrustum, percent);
                const pageCamRotationZ = THREE.MathUtils.lerp(pageCamStartRotationZ, pageCamTargetRotationZ, percent);

                this.homeScene.setCameraFrustumSize(pageCamFrustum);
                this.homeScene.camera.position.lerpVectors(pageCamStartPosition, pageCamTargetPosition, percent);
                this.homeScene.camera.rotation.z = pageCamRotationZ;

                this.portalCamera.zoom = portalCamZoom;
                this.portalCamera.updateProjectionMatrix();
            });
        }

        const portalCamStartZoom = this.portalCamera.zoom;
        const pageCamStartFrustumSize = this.homeScene.frustumSize;
        const pageCamStartPosition = this.homeScene.camera.position.clone();
        const pageCamStartRotationZ = this.homeScene.camera.rotation.z;

        addCssClass(true);
        await waitAsync(1000);
        await zoomSequence(3, 3, this.tileMesh.position.clone(), 0.1);

        // Example of going back:
        await waitAsync(1000);
        await zoomSequence(portalCamStartZoom, pageCamStartFrustumSize, pageCamStartPosition, pageCamStartRotationZ);
        addCssClass(false);
    }

    calculatePageCamTargetZoom = () => {
        // how many times taller is page vs tile?
    }

    initDebug = () => {
        const folder = debugGui.addFolder("Project Tile");
        folder.add(this.taperAmount, "value", -1, 1);
    }

    update(dt, renderer) {
        this.portalCamera.position.lerp(this.targetCameraPosition, dt * 10);
        // this.portalCamera.lookAt(CAMERA_LOOKAT);

        // if (!this.forceRenderOnce) {
        //     const vec = new THREE.Vector3();
        //     vec.subVectors(this.targetCameraPosition, this.portalCamera.position);

        //     if (vec.lengthSq() < 0.00001) {
        //         return;
        //     }
        // }
        renderer.setRenderTarget(this.renderTarget);
        renderer.render(this.portalScene, this.portalCamera);
        renderer.setRenderTarget(null);

        // this.forceRenderOnce = false;
    }

    cleanup() {
        this.renderTarget.dispose();
        this.tileMeshMat.dispose();

        document.getElementById(this.elementId).removeEventListener("mousemove", this.onMouseMove);
        document.getElementById(this.elementId).removeEventListener("mouseleave", this.onMouseLeave);
    }
}