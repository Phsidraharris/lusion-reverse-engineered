import * as THREE from 'three';
import PhysicsSandbox from "./physicsSandbox.js";
import { updateCameraIntrisics } from "./utils/utils.js";

const canvas = document.querySelector('[data-canvas]')
if (!canvas) {
    throw new Error('Could not find element with data-canvas attribute');
}
const scene = new THREE.Scene()

    constructor() {
        this.initThree();

        setTimeout(() => {
            this.initScene();
            this.initVideoPanelAnimations();
        }, 1);

        window.addEventListener("scroll", this.onScroll);
        window.addEventListener("resize", this.onWindowResized);

        if (import.meta.env.DEV) {
            this.stats = new Stats();
            document.body.appendChild(this.stats.dom);
        }
    }

    initThree = () => {
        const canvas = document.getElementById("canvas");
        if (!canvas) {
            throw new Error("Canvas element with id 'canvas' not found. Make sure your HTML contains <canvas id='canvas'></canvas> and scripts run after DOMContentLoaded.");
        }
        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas, stencil: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setAnimationLoop(this.animate);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;

        this.camera = new THREE.OrthographicCamera();
        this.camera.near = 0;
        this.camera.far = 1000;
        this.camera.position.z = 10;
        updateCameraIntrisics(this.camera, this.frustumSize);

        this.onScroll();

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(window.getComputedStyle(document.body).backgroundColor);

        new HDRLoader().load(hdr, (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            this.scene.environment = texture;
        });
    }

    initScene = () => {
        this.loadingGroup = new LoadingGroup(this.camera, () => {
            this.scene.remove(this.loadingGroup);
            this.loadingGroup = undefined;
        });
        this.scene.add(this.loadingGroup);

        this.physicsSandbox = new PhysicsSandbox(this.camera);
        this.scene.add(this.physicsSandbox);

        this.animatedTube = new AnimatedTube(this.camera);
        this.scene.add(this.animatedTube);

        this.videoPanel = new VideoPanelShader(this.camera);
        this.scene.add(this.videoPanel);

        this.projectTiles = new ProjectTiles(this);
        this.scene.add(this.projectTiles);
    }

    onScroll = () => {
        // Move the threejs camera"s y position to make it appear to be scrolling with the page.
        this.camera.position.y = -window.scrollY / window.innerHeight * this.frustumSize;
    }

    setCameraFrustumSize = (frustumSize) => {
        this.frustumSize = frustumSize;
        updateCameraIntrisics(this.camera, this.frustumSize);
    }

    onWindowResized = () => {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        updateCameraIntrisics(this.camera, this.frustumSize);

        this.physicsSandbox && this.physicsSandbox.resize();
        this.animatedTube && this.animatedTube.resize();
        this.videoPanel && this.videoPanel.resize();
        this.projectTiles && this.projectTiles.resize();
    }

    animate = () => {
        const dt = this.clock.getDelta();

        this.loadingGroup && this.loadingGroup.update(dt);
        this.physicsSandbox && this.physicsSandbox.update(dt);
        this.animatedTube && this.animatedTube.update(dt);
        this.videoPanel && this.videoPanel.update(dt);
        this.projectTiles && this.projectTiles.update(dt, this.renderer);

        this.renderer.render(this.scene, this.camera);
        this.stats && this.stats.update();
    }

    initDebug = () => {
    // GUI removed: using default animation parameters
    }

    initVideoPanelAnimations() {
        const section = document.getElementById('video-panel-section');
        if (!section) return;
        const topline = document.getElementById('h1-topline');
        const tagline = document.getElementById('h1-tagline');
        if (!topline || !tagline) return;
        // If already animated (e.g., from previous view), skip.
        if (topline.classList.contains('animate')) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    topline.classList.add('animate');
                    tagline.classList.add('animate');
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });
        observer.observe(section);
    }
}

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const frustumSize = 10;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, stencil: true });
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Camera
const camera = new THREE.OrthographicCamera();
camera.near = 0;
camera.far = 1000;
camera.position.z = 10;
scene.add(camera);
updateCameraIntrisics(camera, frustumSize);


window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    updateCameraIntrisics(camera, frustumSize);

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Material
const material = new THREE.MeshLambertMaterial({ color: 0xffffff })

// Geometry
const geometry = new THREE.BoxGeometry(3, 3, 3)
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Lighting
const lightAmbient = new THREE.AmbientLight(0x9eaeff, 0.2)
scene.add(lightAmbient)

const lightDirectional = new THREE.DirectionalLight(0xffffff, 1)
scene.add(lightDirectional)
lightDirectional.position.set(5, 5, 5)

// --- Physics Sandbox Integration ---
const physicsTarget = document.getElementById('physics-sandbox-div');
const physicsSandbox = new PhysicsSandbox(camera, { 
    lazy: false,
    targetElement: physicsTarget 
});
scene.add(physicsSandbox);
// --- End Integration ---

const clock = new THREE.Clock();

const animate = () => {
    const dt = clock.getDelta();

    // Update cube rotation
    mesh.rotation.x += dt * 0.2;
    mesh.rotation.y += dt * 0.2;

    // Update physics
    physicsSandbox.update(dt);

    // Render the scene
    renderer.render(scene, camera);

    // Call animate again on the next frame
    requestAnimationFrame(animate);
}

// Start the animation loop
animate();
