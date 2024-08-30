import * as THREE from "three";
import { WiggleBone } from "wiggle";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { WiggleRigHelper } from "wiggle/helper";
import { debugGui } from "./debugGui";
import { MeshStandardMaterial } from "three";
import { createVideoTexture } from "./utils/utils";

const SPRING_STIFFNESS = 400;
const SPRING_DAMPING = 30;

export default class VideoPanelWiggleBones extends THREE.Group {
  wiggleBones = [];
  animationPercent = 0;

  constructor() {
    super();

    this.init();
    this.initDebug();
  }

  init = async () => {
    const material = new MeshStandardMaterial({ map: createVideoTexture("assets/pexels-2519660-uhd_3840_2160_24fps.mp4") });

    const gltf = await new GLTFLoader().loadAsync("../assets/panel-anim-wiggle-bones.glb");
    const mesh = gltf.scene.getObjectByName("Plane");
    const helper = new WiggleRigHelper({ skeleton: mesh.skeleton });

    mesh.material = material;

    this.add(gltf.scene);
    this.add(helper);

    this.rootL = gltf.scene.getObjectByName("RootL");
    this.rootR = gltf.scene.getObjectByName("RootR");


    for (let bone of mesh.skeleton.bones) {
      if (bone.parent.isBone) {
        this.wiggleBones.push(new WiggleBone(bone, { stiffness: SPRING_STIFFNESS, damping: SPRING_DAMPING }));
      }
    }

    this.curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(-3, -3, 0)
    );
  }

  initDebug = () => {
    const folder = debugGui.addFolder("Wiggle Bones");
    folder.add(this, "animationPercent", 0, 1)
  }

  update = (dt) => {
    if (this.curve) {
      const point = this.curve.getPointAt(this.animationPercent);
      this.rootL.position.copy(point)
    }
    this.wiggleBones.forEach((wb) => wb.update());
  }
}