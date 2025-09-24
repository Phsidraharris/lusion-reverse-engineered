import RAPIER, { Ray } from "@dimforge/rapier3d-compat";
import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import adaptiveQuality from './utils/adaptiveQuality.js';
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

        // Post layout stabilization checks (fonts, late style application, fractional DPR rounding)
        this._installStabilization();

        // Late second-pass resize (handles slow layout / async injected styles)
        setTimeout(() => {
            this._log('second-pass timed resize');
            this.resize();
        }, 420);

        // Debug helpers (toggle with Shift+P)
        if (typeof window !== 'undefined' && !window.__PHYSICS_DEBUG_KEY_BOUND__) {
            window.addEventListener('keydown', (e) => {
                if (e.key === 'P' && e.shiftKey) {
                    document.body.classList.toggle('debug-physics');
                    this._log('debug outline toggle ->', document.body.classList.contains('debug-physics'));
                }
            });
            window.__PHYSICS_DEBUG_KEY_BOUND__ = true;
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
        this._log('mask rebuilt from element');
    }

    _installStabilization() {
        // Re-run measurement after fonts load (fonts changing metrics can shift layout)
        try {
            if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(() => {
                    this._log('fonts ready -> resize');
                    this.resize();
                });
            }
        } catch(_) {}

        // ResizeObserver on the target div to catch late layout / container changes
        const el = () => document.getElementById('physics-sandbox-div');
        const target = el();
        if (target && !this._resizeObserver) {
            try {
                this._resizeObserver = new ResizeObserver((entries) => {
                    for (const entry of entries) {
                        if (entry.target === target) {
                            this._log('ResizeObserver -> element size changed');
                            this.resize();
                        }
                    }
                });
                this._resizeObserver.observe(target);
            } catch(err) {
                this._log('ResizeObserver unavailable', err);
            }
        } else if (!target) {
            // Try again shortly if element not yet in DOM
            setTimeout(() => this._installStabilization(), 250);
        }

        // Multi-frame validation: sometimes first layout reports 0 / fractional rounding diff until next frame.
        this._stabilizeFrame = 0;
        const MAX_FRAMES = 6;
        const baseline = { w: this.maskWidth, h: this.maskHeight };
        const validate = () => {
            this._stabilizeFrame++;
            const elRef = el();
            if (elRef) {
                const rect = elRef.getBoundingClientRect();
                // If size changed more than a pixel or 1% relative, rebuild.
                const dw = Math.abs(rect.width - (baseline.w || rect.width));
                const dh = Math.abs(rect.height - (baseline.h || rect.height));
                const relW = dw / (rect.width || 1);
                const relH = dh / (rect.height || 1);
                if ((dw > 1 && relW > 0.01) || (dh > 1 && relH > 0.01)) {
                    this._log('post-frame validation -> size drift detected, rebuilding mask');
                    this._rebuildMaskFromElement();
                    return; // new rebuild will schedule its own resize logic
                }
            }
            if (this._stabilizeFrame < MAX_FRAMES) requestAnimationFrame(validate);
        };
        requestAnimationFrame(validate);
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

    // Helper: compute full viewport height in world units at a given Z (mirrors width helper)
    getViewportHeightAtZ(z) {
        const cam = this.camera;
        if (cam.isPerspectiveCamera) {
            const dist = Math.abs(cam.position.z - z);
            const vFov = THREE.MathUtils.degToRad(cam.fov);
            return 2 * Math.tan(vFov / 2) * dist;
        } else if (cam.isOrthographicCamera) {
            return (cam.top - cam.bottom);
        }
        return window.innerHeight / 100;
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
        // Clamp / expand logic: prefer full viewport width at element Z if wider
    const viewportWidthAtZ = this.getViewportWidthAtZ(position.z);
    const viewportHeightAtZ = this.getViewportHeightAtZ(position.z);
    // For height we also ensure at least viewport height (handles min-h-screen vs content shrink)
    this.maskWidth = Math.max(elementWidthWorld, viewportWidthAtZ);
    this.maskHeight = Math.max(elementHeightWorld, viewportHeightAtZ);

        this._lastMeasurement = {
            elementWidthWorld,
            elementHeightWorld,
            viewportWidthAtZ,
            viewportHeightAtZ,
            chosenWidth: this.maskWidth,
            chosenHeight: this.maskHeight,
            ts: performance.now()
        };
        this._log('mask measure', this._lastMeasurement);

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
    const dpr = adaptiveQuality.clampDPR(window.devicePixelRatio || 1);
    const texScale = adaptiveQuality.tier === 'ultra' ? 1 : adaptiveQuality.tier === 'high' ? 0.75 : adaptiveQuality.tier === 'medium' ? 0.6 : 0.45;
        const tw = Math.round(window.innerWidth * dpr * texScale);
        const th = Math.round(window.innerHeight * dpr * texScale);
        const reflector = new Reflector(geometry, {
            color: 0x888888,
            textureWidth: tw,
            textureHeight: th,
            clipBias: 0.003,
            recursion: 0, // reduce recursion for perf
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
            this._debug && this.logCamera();
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

    logCamera() {
        const c = this.camera;
        if (!c) return;
        if (c.isOrthographicCamera) {
            this._log('camera frustum', {
                left: c.left,
                right: c.right,
                top: c.top,
                bottom: c.bottom,
                near: c.near,
                far: c.far,
                width: c.right - c.left,
                height: c.top - c.bottom,
                aspect: (c.right - c.left) / (c.top - c.bottom || 1)
            });
        } else if (c.isPerspectiveCamera) {
            this._log('camera perspective', {
                fov: c.fov,
                aspect: c.aspect,
                near: c.near,
                far: c.far,
                pos: c.position.toArray()
            });
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