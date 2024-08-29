import * as THREE from "three";
import { WiggleBone } from "wiggle";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { WiggleRigHelper } from "wiggle/helper";

export default class VideoPanelWiggleBones extends THREE.Group {
  constructor() {
    super();

    this.init();
  }

  init = async () => {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync('../assets/panel-anim-wiggle-bones.glb');

    const mesh = gltf.scene.getObjectByName("Plane");
    let rootBone;
    const wiggleBones = [];

    const helper = new WiggleRigHelper({
      skeleton: mesh.skeleton,
    });
    this.add(helper);

    mesh.skeleton.bones.forEach((bone) => {
      if (!bone.parent.isBone) {
        rootBone = bone;
      } else {
        const wiggleBone = new WiggleBone(bone, {
          velocity: 0.5,
        });
        wiggleBones.push(wiggleBone);
      }
    });
  }
  update = (dt) => {

  }
}