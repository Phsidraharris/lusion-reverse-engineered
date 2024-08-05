import * as THREE from "three";
import { phy, math } from 'phy-engine';
import { radians } from "three/examples/jsm/nodes/Nodes.js";

export default class PhysicsSandbox extends THREE.Group {
    boxes;
    positionReuse;
    physicsBoxes = [];

    constructor(scene, renderer) {
        super();

        this.init();

        phy.init({
            type: 'PHYSX',
            worker: true,
            compact: true,
            scene: scene,
            renderer: renderer,
            callback: this.physicsReady,
        })
    }

    physicsReady = () => {
        // config physics setting with null gravity
        phy.set({ substep: 2, gravity: [0, 0, 0], fps: 60 })

        const material = new THREE.MeshStandardMaterial({
            color: "blue"
        });

        const planet = new THREE.Mesh(new THREE.SphereGeometry(2), material);

        phy.add({
            type: 'mesh',
            name: 'planet',
            shape: planet.geometry,
            material: material,
            friction: 0.2,
            density: 1,
            radius: 2
        });

        const plane = phy.add({ type: 'plane', size: [300, 1, 300], material: 'shadow', visible: true, pos: [0, -6, 0] });

        for (let i = 0; i < 10; i++) {
            const box = phy.add({ type: 'box', size: [1, 1, 1], pos: [-5 + i * 2, 0, 0], density: 1, material: material, radius: 0.1 });
            this.physicsBoxes.push(box);
        }
    }

    getRandomPosition(radius) {
        if (!this.positionReuse) {
            this.positionReuse = new THREE.Vector3();
        }

        return this.positionReuse.randomDirection().multiplyScalar(radius);
    }

    async init() {
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
    }

    update(dt) {

        if (this.physicsBoxes.length === 0) {
            return;
        }

        console.log(this.physicsBoxes)

        const changes = this.physicsBoxes.map(box => ({ name: box.name, force: [-box.position.x, -box.position.y, -box.position.z] }));
        phy.change(changes);
    }
}