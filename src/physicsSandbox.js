import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d";

const OBJECT_COUNT = 10;

export default class PhysicsSandbox extends THREE.Group {
    boxes;
    positionReuse;
    physicsBoxes = [];

    /** @type RAPIER.World */
    world = null;

    meshBodyLookup = new Map();

    mouseBall;

    camera;

    constructor(camera) {
        super();

        this.world = new RAPIER.World({ x: 0, y: 0, z: 0 });

        for (let i = 0; i < OBJECT_COUNT; i++) {
            const ball = this.createBall();
            this.add(ball.mesh);
            this.addToWorld(ball.mesh, ball.rigidbody);
        }

        this.mouseBall = this.createBall();
        this.add(this.mouseBall.mesh);

        this.camera = camera;

        window.addEventListener('mousemove', this.onMouseMove, false);
    }

    createBall() {
        const ballRadius = 0.5;
        const ballMass = 1;
        const ballRestitution = 0.6;    // 0 = no bounce, 1 = full bounce

        const shape = RAPIER.ColliderDesc.ball(ballRadius);
        shape.setMass(ballMass);
        shape.setRestitution(ballRestitution);

        const rigidbodyDesc = RAPIER.RigidBodyDesc.dynamic();
        rigidbodyDesc.setTranslation(0, 0, 0);

        const rigidbody = this.world.createRigidBody(rigidbodyDesc);
        this.world.createCollider(shape, rigidbody);

        const material = new THREE.MeshStandardMaterial({
            color: "blue"
        });

        const mesh = new THREE.Mesh(new THREE.SphereGeometry(ballRadius), material);

        return { rigidbody, mesh };
    }

    getRandomPosition(radius) {
        if (!this.positionReuse) {
            this.positionReuse = new THREE.Vector3();
        }

        return this.positionReuse.randomDirection().multiplyScalar(radius);
    }

    onMouseMove = (event) => {
        let vector = new THREE.Vector3();
        vector.set(
            (event.clientX / window.innerWidth) * 2 - 1,
            - (event.clientY / window.innerHeight) * 2 + 1,
        );
        vector.unproject(this.camera);

        this.mouseBall.rigidbody.setTranslation({ x: vector.z, y: vector.y, z: 0 });
        this.mouseBall.mesh.position.set(vector.x, vector.y, 10);
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

    addToWorld(mesh, rigidbody) {
        this.meshBodyLookup.set(mesh, rigidbody);
    }

    update(dt) {
        if (this.world) {
            this.world.timestep = dt;
            this.world.step();
        }

        this.meshBodyLookup.forEach((rigidbody, mesh) => {
            mesh.position.copy(rigidbody.translation());
            mesh.quaternion.copy(rigidbody.rotation());
        });
    }
}