import * as THREE from "three";
import { RapierPhysics } from 'three/addons/physics/RapierPhysics.js';

export default class PhysicsSandbox extends THREE.Group {
    /** @type RapierPhysics */
    physics;

    constructor() {
        super();

        this.init();
    }

    async init() {
        this.physics = await RapierPhysics();

        const material = new THREE.MeshStandardMaterial({
            color: "blue"
        });

        const geometryBox = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const boxes = new THREE.InstancedMesh(geometryBox, material, 200);
        boxes.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
        boxes.castShadow = true;
        boxes.receiveShadow = true;
        boxes.userData.physics = { mass: 1 };

        const matrix = new THREE.Matrix4();
        const color = new THREE.Color();
        const position = new THREE.Vector3();
        for (let i = 0; i < boxes.count; i++) {
            matrix.setPosition(position.randomDirection().multiplyScalar(3));
            boxes.setMatrixAt(i, matrix);
            boxes.setColorAt(i, color.setHex(0xffffff * Math.random()));
        }

        this.add(boxes);
    }
}