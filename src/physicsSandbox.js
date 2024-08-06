import RAPIER, { Ray } from "@dimforge/rapier3d";
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { debugGui } from "./debugGui";

const OBJECT_COUNT = 30;
const DAMPING = 0.6
const ATTRACTION_FORCE = 3.5;
const MOUSE_FORCE_COEF = 10;
const MOUSE_LIGHT_INTENSITY = 40;
const STENCIL_REF = 1;

export default class PhysicsSandbox extends THREE.Group {
    boxes;
    positionReuse;
    physicsBoxes = [];

    /** @type RAPIER.World */
    world = null;
    /** @type Map<THREE.Mesh, RAPIER.RigidBody */
    meshBodyLookup = new Map();
    /** @type {{ mesh: THREE.Mesh, rigidbody: RAPIER.RigidBody }} */
    mouseBall;
    camera;
    attractionPos = new THREE.Vector3(0, 0, 0);
    world = new RAPIER.World({ x: 0, y: 0, z: 0 });
    lastMousePos = new THREE.Vector3();

    constructor(camera) {
        super();

        this.camera = camera;

        this.initViewMask();
        this.initObjects();
        this.initDebug();

        window.addEventListener('mousemove', this.onMouseMove, false);
    }

    initViewMask = () => {
        const stencilMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(0.02, 0.02, 0.02),
            depthWrite: false,
            stencilWrite: true,
            stencilRef: STENCIL_REF,
            stencilFunc: THREE.AlwaysStencilFunc,
            stencilZPass: THREE.ReplaceStencilOp
        });
        const loader = new GLTFLoader();
        loader.load('../assets/physics-mask.glb', (gltf) => {
            const mesh = gltf.scene.children[0];
            mesh.material = stencilMat;
            mesh.renderOrder = 1;
            mesh.position.y -= 1;
            this.add(mesh);
        });
    }

    initObjects() {
        for (let i = 0; i < OBJECT_COUNT; i++) {
            const ball = this.createBall(0.6, this.getRandomPosition(5));
            this.add(ball.mesh);
            this.addToWorld(ball.mesh, ball.rigidbody);
        }

        this.mouseBall = this.createBall(0.6, { x: 0, y: 0, z: 0 }, true);
        this.mouseBall.mesh.add(new THREE.PointLight(new THREE.Color(1, 1, 1), MOUSE_LIGHT_INTENSITY));
        this.add(this.mouseBall.mesh);
    }

    initDebug() {
        const folder = debugGui.addFolder("Physics sandbox");
    }

    createBall(ballRadius, ballPosition, isKinematic = false, ballRestitution = 0.3) {
        const { x, y, z } = ballPosition;

        const rigidbodyDesc = isKinematic
            ? RAPIER.RigidBodyDesc.kinematicPositionBased()
            : RAPIER.RigidBodyDesc.dynamic();
        rigidbodyDesc.setTranslation(x, y, z);
        rigidbodyDesc.setLinearDamping(DAMPING);

        const shape = RAPIER.ColliderDesc.ball(ballRadius);
        shape.setMass(ballRadius);
        shape.setRestitution(ballRestitution);

        const rigidbody = this.world.createRigidBody(rigidbodyDesc);
        this.world.createCollider(shape, rigidbody);

        const material = new THREE.MeshStandardMaterial({
            color: 0xE91E63,
            metalness: 0,
            roughness: 0.22,
            stencilWrite: true,
            stencilRef: STENCIL_REF,
            stencilFunc: THREE.EqualStencilFunc,
        });

        const mesh = new THREE.Mesh(new THREE.SphereGeometry(ballRadius), material);
        mesh.position.set(x, y, z);
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        mesh.renderOrder = 2;
        return { rigidbody, mesh };
    }

    getRandomPosition(radius) {
        if (!this.positionReuse) {
            this.positionReuse = new THREE.Vector3();
        }

        return this.positionReuse.randomDirection().multiplyScalar(radius);
    }

    onMouseMove = (event) => {
        const normalisedX = (event.clientX / window.innerWidth) * 2 - 1;
        const normalisedY = -(event.clientY / window.innerHeight) * 2 + 1;

        const x = normalisedX * 10;
        const y = normalisedY * 10;
        const z = 0;

        this.mouseBall.rigidbody.setTranslation({ x, y, z });
        this.mouseBall.mesh.position.set(x, y, z);

        const mouseDelta = this.mouseBall.mesh.position.clone().sub(this.lastMousePos);

        this.lastMousePos.copy(this.mouseBall.mesh.position);

        const ray = new Ray(this.camera.position, this.lastMousePos.clone().sub(this.camera.position));
        const hit = this.world.castRay(ray, 50, true);

        if (hit) {
            this.meshBodyLookup.forEach((rigidbody, mesh) => {
                if (rigidbody === hit.collider.parent()) {
                    rigidbody.applyImpulseAtPoint(mouseDelta.multiplyScalar(MOUSE_FORCE_COEF), this.lastMousePos, true);
                }
            });
        }
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
            this.world.step();
        }

        this.meshBodyLookup.forEach((rigidbody, mesh) => {
            const dirToCenter = this.attractionPos.clone().sub(mesh.position).setLength(ATTRACTION_FORCE);
            rigidbody.resetForces(true);
            rigidbody.addForce(dirToCenter);

            mesh.position.copy(rigidbody.translation());
            mesh.quaternion.copy(rigidbody.rotation());
        });
    }
}