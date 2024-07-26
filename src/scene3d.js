import * as THREE from 'three';

import { Bend, ModConstant, ModifierStack } from "three.modifiers";
import Stats from 'three/addons/libs/stats.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { FontLoader, TextGeometry } from 'three/examples/jsm/Addons.js';
import { MathUtils } from 'three/src/math/MathUtils.js';

let renderer;
let stats;
let camera;
let scene;
let modifier;

const bendModifier = new Bend(0, 0.3, 1);
bendModifier.constraint = ModConstant.LEFT;

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
    camera.position.z = 10;

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

    const cube = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.9, 0.1, 4, 4, 4), material);
    cube.position.x -= 2;
    scene.add(cube);

    const light = new THREE.DirectionalLight(0xffffff, 4);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    const loader = new GLTFLoader();
    loader.load(
        'assets/video-plane.glb',
        function (gltf) {
            console.log("scene", gltf.scene);

            gltf.scene.traverse((node) => {
                if (node.isMesh) {
                    node.material = material;

                    if (modifier === undefined) {
                        modifier = new ModifierStack(node);
                    }
                    else {
                        throw "Modifier already defined";
                    }

                    modifier.addModifier(bendModifier);
                }
                console.log(node)
            });

            scene.add(gltf.scene);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error("Error", error);
        }
    );
}

function add3dText(text) {
    const textMat = new THREE.MeshStandardMaterial({
        roughness: 0.1,
        metalness: 1
    });

    const loader = new FontLoader();
    loader.load('assets/optimer_regular.typeface.json', function (response) {

        const font = response;

        const textGeo = new TextGeometry(text, {
            font: font,
            size: 16,
            depth: 4,
            curveSegments: 16,
            bevelThickness: 1,
            bevelSize: 2,
            bevelEnabled: true
        });

        const textMesh = new THREE.Mesh(textGeo, textMat);
        scene.add(textMesh);

        textGeo.computeBoundingBox();
    });
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
    const scrollProgress = window.scrollY / (document.body.clientHeight);
    camera.position.y = -scrollProgress * 100;
}

function animate() {
    const t = clock.getElapsedTime() % 1;

    renderer.render(scene, camera);
    stats.update();

    bendModifier.force = Math.sin(clock.getElapsedTime());
    modifier && modifier.apply();
}

init();