import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { FontLoader, TextGeometry } from 'three/examples/jsm/Addons.js';

let renderer;
let stats;
let camera;
let scene;

function init() {
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onWindowResized);

    const canvas = document.getElementById("canvas");

    renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    stats = new Stats();
    document.body.appendChild(stats.dom);

    // camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    // camera.position.z = 75;

    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 75;
    camera = new THREE.OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 0.1, 1000);
    camera.position.z = 100;
    // scene.add(camera);

    scene = new THREE.Scene();

    new RGBELoader().setPath('assets/').load('quarry_01_1k.hdr', function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
        scene.environment = texture;
    });

    const torusMaterial = new THREE.MeshStandardMaterial({
        roughness: 0.1,
        metalness: 0
    });

    const torus = new THREE.Mesh(new THREE.TorusKnotGeometry(8, 3, 128, 16), torusMaterial);
    torus.receiveShadow = true;
    torus.castShadow = true;
    scene.add(torus);

    const loader = new FontLoader();
    loader.load('assets/optimer_regular.typeface.json', function (response) {

        const font = response;

        const textGeo = new TextGeometry("text", {
            font: font,
            size: 20,
            depth: 4,
            curveSegments: 16,

            bevelThickness: 1,
            bevelSize: 2,
            bevelEnabled: true
        });

        const textMesh = new THREE.Mesh(textGeo, torusMaterial);
        scene.add(textMesh);

        textGeo.computeBoundingBox();
    });
}

function onWindowResized() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

function onScroll() {
    const scrollProgress = window.scrollY / (document.body.clientHeight);
    camera.position.y = -scrollProgress * 200;
}

function animate() {
    renderer.render(scene, camera);
    stats.update();
}

init();