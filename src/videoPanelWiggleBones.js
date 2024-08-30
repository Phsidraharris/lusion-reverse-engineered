import * as THREE from "three";
import { WiggleBone } from "wiggle";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { WiggleRigHelper } from "wiggle/helper";

export default class VideoPanelWiggleBones extends THREE.Group {
  wiggleBones = [];

  constructor() {
    super();

    this.init();
  }

  init = async () => {
    const gltf = await new GLTFLoader().loadAsync('../assets/panel-anim-wiggle-bones.glb');
    this.add(gltf.scene);

    const rootL = gltf.scene.getObjectByName("RootL");
    const mesh = gltf.scene.getObjectByName("Plane");

    const helper = new WiggleRigHelper({
      skeleton: mesh.skeleton,
    });
    this.add(helper);

    const stiffness = 400;
    const damping = 30;
    for (let bone of mesh.skeleton.bones) {
      if (bone.parent.isBone) {
        this.wiggleBones.push(new WiggleBone(bone, { stiffness, damping }));
      }
    }
  }

  update = (dt) => {
    this.wiggleBones.forEach((wb) => wb.update());
  }
}