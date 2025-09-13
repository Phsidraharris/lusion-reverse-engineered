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
    maskWidth = 0;
    maskHeight = 0;

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

    // Helper: compute full viewport width in world units at a given Z
    getViewportWidthAtZ(z) {
        const cam = this.camera;
        if (cam.isPerspectiveCamera) {
            const dist = Math.abs(cam.position.z - z);
            const vFov = THREE.MathUtils.degToRad(cam.fov);              // vertical FOV in radians
            const viewportHeightAtZ = 2 * Math.tan(vFov / 2) * dist;
            const viewportWidthAtZ = viewportHeightAtZ * cam.aspect;
            return viewportWidthAtZ;
        } else if (cam.isOrthographicCamera) {
            return (cam.right - cam.left);
        }
        // Fallback
        return window.innerWidth / 100;
    }

    initViewMask = () => {
        const targetEl = document.getElementById("physics-sandbox-div");
        if (!targetEl) return;

        // Keep element-derived height (so it matches hero section height)
        const divWorldRect = elementToWorldRect("physics-sandbox-div", this.camera);
        const elementHeightWorld = Math.abs(divWorldRect.height);
        const position = divWorldRect.position;

        // Force FULL viewport width at the plane's Z depth
        const fullViewportWidth = this.getViewportWidthAtZ(position.z);

        this.maskWidth = fullViewportWidth;
        this.maskHeight = elementHeightWorld;

        if (this.physicsMaskMesh) {
            this.remove(this.physicsMaskMesh);
            this.physicsMaskMesh.geometry.dispose();
        }

        const geometry = createBevelledPlane(this.maskWidth, this.maskHeight, 0.1);
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

        const width = this.maskWidth;
        const height = this.maskHeight;
        const thickness = 2;
        const maskPos = this.physicsMaskMesh.position;
        const wallZ = maskPos.z;

        const boundaries = [
            { x: maskPos.x - width/2 - thickness/2, y: maskPos.y, z: wallZ, w: thickness, h: height+thickness },
            { x: maskPos.x + width/2 + thickness/2, y: maskPos.y, z: wallZ, w: thickness, h: height+thickness },
            { x: maskPos.x, y: maskPos.y + height/2 + thickness/2, z: wallZ, w: width+thickness, h: thickness },
            { x: maskPos.x, y: maskPos.y - height/2 - thickness/2, z: wallZ, w: width+thickness, h: thickness },
        ];

        boundaries.forEach(b => {
            const rb = this.world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(b.x, b.y, b.z));
            this.world.createCollider(RAPIER.ColliderDesc.cuboid(b.w/2, b.h/2, thickness/2), rb);
        });

        // Clear previous plane objects (optional if you rebuild)
        // Create single plane or other objects centered
        const planeGeometry = new THREE.PlaneGeometry(20, 20);
        const planeMaterial = this.ballMaterial.clone();
        const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
        planeMesh.position.set(maskPos.x, maskPos.y, maskPos.z - 10);
        planeMesh.renderOrder = 3;
        this.add(planeMesh);

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
        if (!this.world || !this.physicsMaskMesh) return;
        const maskPos = this.physicsMaskMesh.position;

        const width = this.maskWidth;
        const height = this.maskHeight;
        const ballRadius = this.mouseBall?.mesh.geometry.parameters?.radius || 0.6;

        const minX = maskPos.x - width/2 + ballRadius;
        const maxX = maskPos.x + width/2 - ballRadius;
        const minY = maskPos.y - height/2 + ballRadius;
        const maxY = maskPos.y + height/2 - ballRadius;

        let worldCords = pageToWorldCoords(event.x, event.y, this.camera);
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
        this.textureLoader.load(
            TEXTURE_PATH,
            (gridTexture) => {
                if (!this.physicsMaskMesh) return;

                const width = this.maskWidth || this.physicsMaskMesh.geometry.parameters?.width;
                const height = this.maskHeight || this.physicsMaskMesh.geometry.parameters?.height;

                if (this.honeybeeStencilMesh) {
                    this.remove(this.honeybeeStencilMesh);
                    this.honeybeeStencilMesh.geometry.dispose();
                }

                const geometry = new THREE.PlaneGeometry(width, height, 4, 4);
                const material = new THREE.MeshBasicMaterial({
                    map: gridTexture,
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
            (err) => console.error("Failed to load stencil texture:", err)
        );
    }

    initReflectingPlane() {
        if (this.reflectingPlane) {
            this.remove(this.reflectingPlane);
            this.reflectingPlane.geometry.dispose();
        }
        const width = this.maskWidth || this.physicsMaskMesh?.geometry.parameters?.width || 10;
        const height = this.maskHeight || this.physicsMaskMesh?.geometry.parameters?.height || 10;

        const geometry = new THREE.PlaneGeometry(width, height);
        const reflector = new Reflector(geometry, {
            color: 0x888888,
            textureWidth: window.innerWidth,
            textureHeight: window.innerHeight,
            clipBias: 0.003,
            recursion: 1,
        });
        reflector.position.copy(this.physicsMaskMesh.position);
        reflector.position.z -= 2;
        reflector.rotation.x = -Math.PI / 2;
        reflector.renderOrder = 1;
        this.add(reflector);
        this.reflectingPlane = reflector;
    }

    resize = async () => {
        if (this.physicsMaskMesh) {
            this.remove(this.physicsMaskMesh);
            this.physicsMaskMesh.geometry.dispose();
            this.physicsMaskMesh = null;
        }
        if (this.honeybeeStencilMesh) {
            this.remove(this.honeybeeStencilMesh);
            this.honeybeeStencilMesh.geometry.dispose();
            this.honeybeeStencilMesh = null;
        }
        if (this.reflectingPlane) {
            this.remove(this.reflectingPlane);
            this.reflectingPlane.geometry.dispose();
            this.reflectingPlane = null;
        }
        if (this.mouseBall && this.mouseBall.mesh) {
            this.remove(this.mouseBall.mesh);
            this.mouseBall = null;
        }
        this.meshBodyLookup.clear();
        this.world = null;

        this.initViewMask();          // now uses full viewport width
        await this.initPhysics();
        this.initStencil();
        this.initReflectingPlane();
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