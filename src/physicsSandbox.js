import * as THREE from "three";
import { RapierPhysics } from 'three/addons/physics/RapierPhysics.js';

export default class PhysicsSandbox extends THREE.Group {
    /** @type RapierPhysics */
    physics;
    boxes;
    positionReuse;

    constructor() {
        super();

        this.init();
    }

    getRandomPosition(radius) {
        if (!this.positionReuse) {
            this.positionReuse = new THREE.Vector3();
        }

        return this.positionReuse.randomDirection().multiplyScalar(radius);
    }

    async init() {
        this.physics = await RapierPhysics();
        const material = new THREE.MeshStandardMaterial({
            color: "blue"
        });

        const geometryBox = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        this.boxes = new THREE.InstancedMesh(geometryBox, material, 200);
        this.boxes.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
        this.boxes.castShadow = true;
        this.boxes.receiveShadow = true;
        this.boxes.userData.physics = { mass: 1 };

        const matrix = new THREE.Matrix4();
        const color = new THREE.Color();
        for (let i = 0; i < this.boxes.count; i++) {
            matrix.setPosition(this.getRandomPosition(3));
            this.boxes.setMatrixAt(i, matrix);
            this.boxes.setColorAt(i, color.setHex(0xffffff * Math.random()));
        }
        this.add(this.boxes);

        const floor = new THREE.Mesh(
            new THREE.BoxGeometry(10, 5, 10),
            new THREE.ShadowMaterial({ color: 0x444444 })
        );
        floor.position.y = -10;
        floor.receiveShadow = true;
        floor.userData.physics = { mass: 0 };
        this.add(floor);

        this.physics.addScene(this);
    }

    update(dt) {
        if (!this.physics || !this.boxes) {
            return;
        }

        const index = Math.floor(Math.random() * this.boxes.count);
        this.physics.setMeshPosition(this.boxes, this.getRandomPosition(3), index);
    }
}