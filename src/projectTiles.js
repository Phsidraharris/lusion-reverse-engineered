import * as THREE from "three";
import { debugGui } from "./debugGui";
import { createBevelledPlane, elementToWorldRect } from "./utils";
import ProjectTile from "./projectTiles/ProjectTile";

const ELEMENT_IDS = ["tile-1", "tile-2", "tile-3", "tile-4"];

export default class ProjectTiles extends THREE.Group {
    renderTarget;
    portalScene;
    portalCamera;


    projectTile;

    constructor(camera) {
        super();

        const elementId = "tile-1";

        this.projectTile = new ProjectTile(elementId, camera);

        this.add(this.projectTile.tileMesh);

        // this.initPortal();

        // ELEMENT_IDS.forEach(elementId => {
        //     // document.getElementById(elementId).addEventListener("mousemove", e => this.onMouseMove(e));
        //     // document.getElementById(elementId).addEventListener("mouseleave", e => this.onMouseLeave(e));

        //     const tileWorldRect = elementToWorldRect(elementId, camera);
        //     const mesh = new THREE.Mesh(createBevelledPlane(tileWorldRect.width, tileWorldRect.height, 0.2), this.shaderMaterial);
        //     mesh.position.copy(tileWorldRect.position);

        //     this.add(mesh);
        // });

    }

    // initPortal() {
    //     this.renderTarget = new THREE.WebGLRenderTarget(512, 512 / (16 / 9));

    //     this.portalCamera = new THREE.PerspectiveCamera();
    //     this.portalCamera.position.z = -3;

    //     this.portalScene = new THREE.Scene();
    //     this.portalScene.background = new THREE.Color("#222222");

    //     const light = new THREE.DirectionalLight("white", 2);
    //     light.position.set(0, 1, 0);

    //     this.portalScene.add(light);

    //     this.shaderMaterial.map = this.renderTarget.texture;

    //     const portalObjMat = new THREE.MeshStandardMaterial();

    //     for (let i = 0; i < 3; i++) {
    //         const portalBox = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), portalObjMat);
    //         portalBox.position.random();
    //         portalBox.position.z = Math.random() * 10;
    //         portalBox.rotateY(Math.PI * 0.25);
    //         portalBox.rotateX(Math.PI * 0.25);

    //         this.portalScene.add(portalBox);
    //         this.portalCamera.lookAt(0, 0, 0);
    //     }
    // }


    /**
     * @param {THREE.Renderer} renderer 
     */
    update(renderer) {
        this.projectTile.update(renderer);
    }
}