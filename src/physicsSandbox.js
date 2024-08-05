import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d";

const OBJECT_COUNT = 100;

export default class PhysicsSandbox extends THREE.Group {
    boxes;
    positionReuse;
    physicsBoxes = [];

    /** @type RAPIER.World */
    world = null;

    /** @type Map<THREE.Mesh, RAPIER.RigidBody */
    meshBodyLookup = new Map();

    mouseBall;

    camera;

    constructor(camera) {
        super();

        this.world = new RAPIER.World({ x: 0, y: 0, z: 0 });

        for (let i = 0; i < OBJECT_COUNT; i++) {
            const ball = this.createBall(0.2, this.getRandomPosition(5));
            this.add(ball.mesh);
            this.addToWorld(ball.mesh, ball.rigidbody);
        }

        this.mouseBall = this.createBall(2, { x: 0, y: 0, z: 0 }, true);
        this.mouseBall.mesh.add(new THREE.PointLight(new THREE.Color(1, 1, 1), 100));
        this.add(this.mouseBall.mesh);

        this.camera = camera;

        window.addEventListener('mousemove', this.onMouseMove, false);
    }

    createBall(ballRadius, ballPosition, isKinematic = false, ballMass = 1, ballRestitution = 0.1) {
        const { x, y, z } = ballPosition;

        const shape = RAPIER.ColliderDesc.ball(ballRadius);
        shape.setMass(ballMass);
        shape.setRestitution(ballRestitution);

        const rigidbodyDesc = isKinematic
            ? RAPIER.RigidBodyDesc.kinematicPositionBased()
            : RAPIER.RigidBodyDesc.dynamic();
        rigidbodyDesc.setTranslation(x, y, z);

        const rigidbody = this.world.createRigidBody(rigidbodyDesc);
        this.world.createCollider(shape, rigidbody);

        const material = new THREE.MeshStandardMaterial({
            color: "blue"
        });

        const mesh = new THREE.Mesh(new THREE.SphereGeometry(ballRadius), material);
        mesh.position.set(x, y, z);
        mesh.receiveShadow = true;
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
        const normalizedZ = THREE.MathUtils.inverseLerp(this.camera.near, this.camera.far, this.camera.position.z);

        vector.set(
            (event.clientX / window.innerWidth) * 2 - 1,
            - (event.clientY / window.innerHeight) * 2 + 1,
            0.989   // more negative, closer to camera, higher = further.
        );
        vector.unproject(this.camera);
        let { x, y, z } = vector;
        // z = 1;
        this.mouseBall.rigidbody.setTranslation({ x, y, z });
        this.mouseBall.mesh.position.set(x, y, z);

        console.log(x, y, z)
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

        const center = new THREE.Vector3(0, 0, 0);
        this.meshBodyLookup.forEach((rigidbody, mesh) => {
            const dirToCenter = center.clone().sub(mesh.position).multiplyScalar(0.9);
            rigidbody.resetForces(true);
            rigidbody.addForce(dirToCenter);

            mesh.position.copy(rigidbody.translation());
            mesh.quaternion.copy(rigidbody.rotation());

        });
    }
}