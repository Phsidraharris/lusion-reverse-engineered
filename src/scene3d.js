import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { NURBSTube } from './nurbsTube';
import { AnimatedTube } from './animatedTube';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const SCROLL_SCALE = 0.015;
const ENABLE_CONTROL = true;

let renderer;
let stats;
let camera;
let scene;
let videoMesh;
let nurbsTube;
let controls;

const clock = new THREE.Clock(true);

function init() {
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onWindowResized);

    const canvas = document.getElementById("canvas");

    renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    // renderer.toneMapping = THREE.ACESFilmicToneMapping;

    stats = new Stats();
    document.body.appendChild(stats.dom);

    const frustum = frustumFromWindowWidth();
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.OrthographicCamera(frustum * aspect / - 2, frustum * aspect / 2, frustum / 2, frustum / - 2, 0.1, 1000);
    camera.position.z = 100;

    controls = new OrbitControls(camera, canvas);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.1, 0.1, 0.1, 1);

    new RGBELoader().setPath('assets/').load('quarry_01_1k.hdr', function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
    });

    const material = new THREE.MeshStandardMaterial({
        roughness: 0.1,
        metalness: 0,
        map: createVideoTexture(),
    });

    videoMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.9, 16, 16), material);
    scene.add(videoMesh);

    const light = new THREE.DirectionalLight(0xffffff, 0.4);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    nurbsTube = new NURBSTube();
    scene.add(nurbsTube);

    const animatedTube = new AnimatedTube();
    scene.add(animatedTube)
}

function createVideoTexture() {
    const video = document.createElement('video');
    video.src = 'assets/pexels-milky-way-glowing-at-night-857136.mp4';
    video.loop = true;
    video.muted = true;
    video.play();

    const texture = new THREE.VideoTexture(video);
    texture.colorSpace = THREE.SRGBColorSpace;

    return texture;
}

function frustumFromWindowWidth() {
    // Pick an arbitrary width and frustum. Every other window width will be based off this
    const calibrationWidth = 1280;
    const calibrationFrustum = 15;

    const scale = calibrationWidth / window.innerWidth;
    return calibrationFrustum * scale;
}

function onWindowResized() {
    renderer.setSize(window.innerWidth, window.innerHeight);

    const frustum = frustumFromWindowWidth();
    const aspect = window.innerWidth / window.innerHeight;
    camera.left = - frustum * aspect / 2;
    camera.right = frustum * aspect / 2;
    camera.top = frustum / 2;
    camera.bottom = - frustum / 2;
    camera.updateProjectionMatrix();

    console.log("New frustum: ", frustum);
}

function onScroll() {
    camera.position.y = -window.scrollY * SCROLL_SCALE;
}

function animate() {
    const t = clock.getElapsedTime() % 1;

    renderer.render(scene, camera);
    stats.update();
    controls.update();
}

init();