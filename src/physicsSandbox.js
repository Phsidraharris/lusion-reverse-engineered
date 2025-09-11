import RAPIER, { Ray } from "@dimforge/rapier3d-compat";
import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { createBevelledPlane, elementToWorldRect, pageToWorldCoords } from "./utils/utils";

const OBJECT_COUNT = 1;
const DAMPING = 0.6
const ATTRACTION_FORCE = 10;
const MOUSE_FORCE_COEF = 10;
const MOUSE_LIGHT_INTENSITY = 100;
const STENCIL_REF = 2;

export default class PhysicsSandbox extends THREE.Group {
    ballPosition = new THREE.Vector3();
    meshBodyLookup = new Map();
    attractionPos = new THREE.Vector3(0, 0, 0);
    lastMousePos = new THREE.Vector3();

    constructor(camera) {
        super();

        this.camera = camera;
        this.initViewMask();
        this.initBallMaterial();

        // Use a single textureLoader instance for all textures
        this.textureLoader = new THREE.TextureLoader();
        this.initReflectingPlane();

        // Defer heavy async work to next event loop to avoid blocking UI
        setTimeout(() => {
            this.initPhysics().then(() => {
                this.initStencil();
                window.addEventListener('mousemove', this.onMouseMove, false);
            });
        }, 0);
    }

    initViewMask = () => {
        // Use utility to get world rect for the container
        const divWorldRect = elementToWorldRect("physics-sandbox-div", this.camera);
        const width = Math.abs(divWorldRect.width);
        const height = Math.abs(divWorldRect.height);
        const position = divWorldRect.position;

        // Use a metallic, reflective material
        const stencilMat = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(0, 0, 0),
            metalness: 1.0,
            roughness: 0.05,
            reflectivity: 1.0,
            clearcoat: 1.0,
            clearcoatRoughness: 0.01,
            envMapIntensity: 1.5,
            depthWrite: false,
            stencilWrite: true,
            stencilRef: STENCIL_REF,
            stencilFunc: THREE.AlwaysStencilFunc,
            stencilZPass: THREE.ReplaceStencilOp
        });

        const geometry = createBevelledPlane(width, height, 0.1);
        this.physicsMaskMesh = new THREE.Mesh(geometry, stencilMat);
        this.physicsMaskMesh.position.copy(position);
        this.add(this.physicsMaskMesh);

        this.attractionPos.copy(position);
    }



    initBallMaterial() {
        this.ballMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0,0,0),
            metalness: 0,
            roughness: 0.22,
            stencilWrite: true,
            stencilRef: STENCIL_REF,
            stencilFunc: THREE.EqualStencilFunc,
        });
    }
    async initPhysics() {
        await RAPIER.init();

        this.world = new RAPIER.World({ x: 0, y: 0, z: 0 });

        // Get mask dimensions and position
        let width = this.physicsMaskMesh.geometry.parameters.width || 1;
        let height = this.physicsMaskMesh.geometry.parameters.height || 2;
        width = Math.max(width, 10);
        height = Math.max(height, 10);
        const thickness = 2;
        const maskPos = this.physicsMaskMesh.position;
        const wallZ = maskPos.z;
        // Add boundary walls (left, right, top, bottom) at mask position
        const boundaries = [
            // Left wall
            { x: maskPos.x - width/2 - thickness/2, y: maskPos.y, z: wallZ, w: thickness, h: height+thickness },
            // Right wall
            { x: maskPos.x + width/2 + thickness/2, y: maskPos.y, z: wallZ, w: thickness, h: height+thickness },
            // Top wall
            { x: maskPos.x, y: maskPos.y + height/2 + thickness/2, z: wallZ, w: width+thickness, h: thickness },
            // Bottom wall
            { x: maskPos.x, y: maskPos.y - height/2 - thickness/2, z: wallZ, w: width+thickness, h: thickness },
        ];

        boundaries.forEach(b => {
            const wallDesc = RAPIER.RigidBodyDesc.fixed();
            wallDesc.setTranslation(b.x, b.y, b.z);
            const wallShape = RAPIER.ColliderDesc.cuboid(b.w/2, b.h/2, thickness/2);
            this.world.createRigidBody(wallDesc);
            this.world.createCollider(wallShape, wallDesc);
        });

        // Create balls inside mask bounds
        for (let i = 0; i < OBJECT_COUNT; i++) {
            const x = Math.max(maskPos.x - width/2 + 6, Math.min(maskPos.x + width/2 - 6, maskPos.x));
            const y = Math.max(maskPos.y - height/2 + 6, Math.min(maskPos.y + height/2 - 6, maskPos.y));
            // Create a plane instead of a ball, using the same color and material
            const planeGeometry = new THREE.PlaneGeometry(20, 20); // Size can be adjusted as needed
            const planeMaterial = this.ballMaterial.clone();
            const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
            planeMesh.position.set(x, y, maskPos.z - 10);
            planeMesh.receiveShadow = true;
            planeMesh.castShadow = true;
            planeMesh.renderOrder = 3;
            this.add(planeMesh);
            // Optionally, add to meshBodyLookup if you want physics interaction
        }

        // Mouse ball (kinematic), clamped to mask area
        // Mouse ball (kinematic), clamped to mask area
        this.mouseBall = this.createBall(0.1, { x: maskPos.x, y: maskPos.y, z: maskPos.z + 1 }, true);
        this.mouseBall.mesh.add(new THREE.PointLight(new THREE.Color(1, 1, 1), MOUSE_LIGHT_INTENSITY));
        this.add(this.mouseBall.mesh);
    }

    createBall(ballRadius, ballPosition, isKinematic = false, ballRestitution = 0.3) {
        const { x, y, z } = ballPosition;

        const rigidbodyDesc = isKinematic
            ? RAPIER.RigidBodyDesc.kinematicPositionBased()
            : RAPIER.RigidBodyDesc.dynamic();
        rigidbodyDesc.setTranslation(x, y, -10);
        rigidbodyDesc.setLinearDamping(DAMPING);

        const shape = RAPIER.ColliderDesc.ball(ballRadius);
        shape.setMass(ballRadius);
        shape.setRestitution(ballRestitution);

        const rigidbody = this.world.createRigidBody(rigidbodyDesc);
        this.world.createCollider(shape, rigidbody);

        const mesh = new THREE.Mesh(new THREE.SphereGeometry(ballRadius), this.ballMaterial);
        mesh.position.set(x, y, z);
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        mesh.renderOrder = 3;
        return { rigidbody, mesh };
    }

    getRandomPosition(radius) {
        return this.ballPosition.randomDirection().multiplyScalar(radius);
    }

    onMouseMove = (event) => {
        if (!this.world) return;

        const maskPos = this.physicsMaskMesh.position;
        const divWorldRect = elementToWorldRect("physics-sandbox-div", this.camera);
        const width = Math.abs(divWorldRect.width);
        const height = Math.abs(divWorldRect.height);

        // Use the actual mouse ball radius for clamping
        const ballRadius = this.mouseBall?.mesh.geometry.parameters?.radius || 0.6;

        const minX = maskPos.x - width / 2 + ballRadius;
        const maxX = maskPos.x + width / 2 - ballRadius;
        const minY = maskPos.y - height / 2 + ballRadius;
        const maxY = maskPos.y + height / 2 - ballRadius;

        let worldCords = pageToWorldCoords(event.x, event.y, this.camera);

        // Clamp mouse ball position to mask bounds
        worldCords.x = Math.max(minX, Math.min(maxX, worldCords.x));
        worldCords.y = Math.max(minY, Math.min(maxY, worldCords.y));

        const { x, y, z } = worldCords;

        this.mouseBall.rigidbody.setTranslation({ x, y, z });
        this.mouseBall.mesh.position.set(x, y, z);

        this.lastMousePos.copy(this.mouseBall.mesh.position);


    }

    addToWorld(mesh, rigidbody) {
        this.meshBodyLookup.set(mesh, rigidbody);
    }

 

    initStencil() {
        const TEXTURE_PATH = "https://i.postimg.cc/L6FL5RHK/black-with-transparent-grid.png";

        // Use cached loader, but wait for texture to load before creating the mesh
        this.textureLoader.load(
            TEXTURE_PATH,
            (gridTexture) => {
                const divWorldRect = elementToWorldRect("physics-sandbox-div", this.camera);
                const width = Math.abs(divWorldRect.width);
                const height = Math.abs(divWorldRect.height);

                const geometry = new THREE.PlaneGeometry(width, height, 8, 8);

                const material = new THREE.MeshBasicMaterial({
                    map: gridTexture,
                    color: 0xff00ff,
                    transparent: true,
                    opacity: 1,
                    depthWrite: true,
                    depthTest: false,
                });
                const plane = new THREE.Mesh(geometry, material);
                plane.position.copy(this.physicsMaskMesh.position);
                plane.position.z += 1;
                plane.renderOrder = 10;
                this.add(plane);
                this.honeybeeStencilMesh = plane;
            },
            undefined,
            (err) => {
                console.error("Failed to load stencil texture:", err);
            }
        );
    }

      initReflectingPlane() {
        let width = this.physicsMaskMesh.geometry.parameters.width || 1;
        let height = this.physicsMaskMesh.geometry.parameters.height || 2;
        width = Math.max(width, 10);
        height = Math.max(height, 10);
        const geometry = new THREE.PlaneGeometry(width, height);
        const reflector = new Reflector(geometry, {
            color: 0x888888,
            textureWidth: window.innerWidth,
            textureHeight: window.innerHeight,
            clipBias: 0.003,
            recursion: 1,
        });
        reflector.position.copy(this.physicsMaskMesh.position);
        reflector.position.z -= 2; // Place below balls
        reflector.rotation.x = -Math.PI / 2;
        reflector.renderOrder = 1;
        this.add(reflector);
        this.reflectingPlane = reflector;
    }
    resize = async () => {
        // Remove old mask mesh
        if (this.physicsMaskMesh) this.remove(this.physicsMaskMesh);

        // Remove old stencil mesh
        if (this.honeybeeStencilMesh) this.remove(this.honeybeeStencilMesh);

        // Remove old mouse ball
        if (this.mouseBall && this.mouseBall.mesh) {
            this.remove(this.mouseBall.mesh);
            this.mouseBall = null;
        }

        // Optionally clear meshBodyLookup and world
        if (this.meshBodyLookup) this.meshBodyLookup.clear();
        if (this.world) this.world = null;

        this.initViewMask();
        await this.initPhysics();
        this.initStencil(); 
    }

    update(dt) {
        if (!this.world) return;

        // Only update if objects are present
        if (this.meshBodyLookup.size === 0) return;

        // Step physics world only if needed (uncomment if you want physics simulation)
        // this.world.step();

        // Use for...of for better performance over forEach
        for (const [rigidbody, mesh] of this.meshBodyLookup.entries()) {
            const dirToCenter = this.attractionPos.clone().sub(mesh.position).setLength(ATTRACTION_FORCE);
            rigidbody.resetForces(true);
            rigidbody.addForce(dirToCenter);

            mesh.position.copy(rigidbody.translation());
            mesh.quaternion.copy(rigidbody.rotation());
        }
    }
}