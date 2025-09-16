import * as THREE from 'three';
import PhysicsSandbox from "./physicsSandbox.js";
import { updateCameraIntrisics } from "./utils/utils.js";

const canvas = document.querySelector('[data-canvas]')
if (!canvas) {
    throw new Error('Could not find element with data-canvas attribute');
}
const scene = new THREE.Scene()

const degreesToRadians = (degrees) => {
  return degrees * (Math.PI / 180)
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
