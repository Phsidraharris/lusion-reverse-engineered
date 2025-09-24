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

    constructor(camera, { debug = false, lazy = true } = {}) {
        super();
        this._debug = !!debug || import.meta.env.DEV;
        this.camera = camera;
        this._initialized = false;
        this._lazy = lazy;
        this._pendingDeferredInit = false;
        this._log('ctor:start');

        this.initViewMask();
        this.initBallMaterial();
        this.textureLoader = new THREE.TextureLoader();
        this.initReflectingPlane();

        this._attachDomObservers();
        if (this._lazy) {
            this._installIntersectionStart();
        } else {
            this._deferredInit();
        }

        // Expose test harness
        if (typeof window !== 'undefined') {
            window.__PHYSICS_SANDBOX__ = {
                getState: () => ({
                    maskWidth: this.maskWidth,
                    maskHeight: this.maskHeight,
                    hasWorld: !!this.world,
                    bodies: this.meshBodyLookup.size,
                    fallback: this._usedFallback,
                    initialized: this._initialized,
                }),
                forceInit: () => this._deferredInit(true),
                resize: () => this.resize(),
            };
        }
    }

    _log(...args) { if (this._debug) console.log('[PhysicsSandbox]', ...args); }

    _ensureTestBall() {
        if (!this.world) return;
        // Add a single dynamic ball so update loop has something to iterate / animate.
        if (this.meshBodyLookup.size === 0) {
            const maskPos = this.physicsMaskMesh?.position || new THREE.Vector3();
            const dynamic = this.createBall(0.25, { x: maskPos.x, y: maskPos.y, z: maskPos.z + 1 }, false, 0.6);
            this.add(dynamic.mesh);
            this.addToWorld(dynamic.mesh, dynamic.rigidbody);
            this._log('added dynamic test ball');
        }
    }

    _attachDomObservers() {
        if (this.physicsMaskMesh && !this._usedFallback) return; // already have proper element
        // Watch for #physics-sandbox-div appearing later
        const observer = new MutationObserver(() => {
            const el = document.getElementById('physics-sandbox-div');
            if (el) {
                this._log('mask element now present, rebuilding');
                observer.disconnect();
                this._rebuildMaskFromElement();
            }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
        this._mutationObserver = observer;
    }

    _rebuildMaskFromElement() {
        if (this._usedFallback) {
            // Remove fallback mesh
            if (this.physicsMaskMesh) {
                this.remove(this.physicsMaskMesh);
                this.physicsMaskMesh.geometry.dispose();
            }
            this.physicsMaskMesh = null;
        }
        this.initViewMask();
        this.initReflectingPlane();
        // Physics/world may already exist; a resize will rebuild cleanly
        this.resize();
    }

    _installIntersectionStart() {
        const target = document.getElementById('physics-sandbox-div') || document.body;
        const io = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting && !this._initialized && !this._pendingDeferredInit) {
                    this._log('intersection -> begin deferred init');
                    io.disconnect();
                    this._deferredInit();
                }
            });
        }, { threshold: 0.1 });
        io.observe(target);
        this._intersectionObserver = io;
    }

    async _deferredInit(force = false) {
        if (this._initialized && !force) return;
        this._pendingDeferredInit = true;
        try {
            await this.initPhysics();
            this.initStencil();
            this._ensureTestBall();
            window.addEventListener('mousemove', this.onMouseMove, false);
            this._initialized = true;
            this._log('physics-ready');
            try { document.body?.setAttribute('data-physics-ready', 'true'); } catch(_) {}
        } catch (e) {
            console.error('[PhysicsSandbox] deferred init failed', e);
        } finally {
            this._pendingDeferredInit = false;
        }
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
        if (!targetEl) {
            // Fallback: use window dimensions (ensures sandbox still initializes on Pages without element timing)
            this._log('fallback initViewMask - element missing');
            const fallbackWidth = this.getViewportWidthAtZ(0);
            const fallbackHeight = this.getViewportWidthAtZ(0) * 0.5; // arbitrary ratio for placeholder
            this.maskWidth = fallbackWidth;
            this.maskHeight = fallbackHeight;
            const geometry = createBevelledPlane(this.maskWidth, this.maskHeight, 0.1);
            const dummyMat = new THREE.MeshBasicMaterial({ visible: false });
            this.physicsMaskMesh = new THREE.Mesh(geometry, dummyMat);
            this.physicsMaskMesh.position.set(0, 0, 0);
            this.add(this.physicsMaskMesh);
            this.attractionPos.set(0, 0, 0);
            this._usedFallback = true;
            return;
        }
        this._usedFallback = false;

        const divWorldRect = elementToWorldRect("physics-sandbox-div", this.camera);
        const elementHeightWorld = Math.abs(divWorldRect.height);
        const elementWidthWorld = Math.abs(divWorldRect.width);
        const position = divWorldRect.position;
        this.maskWidth = elementWidthWorld;
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
        // Debounce rapid resize calls
        clearTimeout(this._resizeT);
        this._resizeT = setTimeout(async () => {
            await this._doResize();
        }, 120);
    }

    async _doResize() {
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

        this.initViewMask();
        if (this.world) { // if physics already exists, rebuild dependent visuals
            await this.initPhysics();
            this.initStencil();
            this.initReflectingPlane();
        } else if (this._initialized) {
            await this.initPhysics();
            this.initStencil();
            this.initReflectingPlane();
        }
    }
    update(dt) {
        if (!this.world) return;
        if (this.meshBodyLookup.size === 0) {
            // Try once to inject a test ball (in case init order differed)
            this._ensureTestBall();
            return;
        }
        // this.world.step(); // enable if physics simulation desired.
        for (const [mesh, rigidbody] of this.meshBodyLookup.entries()) {
            const dirToCenter = this.attractionPos.clone().sub(mesh.position).setLength(ATTRACTION_FORCE);
            rigidbody.resetForces(true);
            rigidbody.addForce(dirToCenter);
            mesh.position.copy(rigidbody.translation());
            mesh.quaternion.copy(rigidbody.rotation());
        }
    }
}