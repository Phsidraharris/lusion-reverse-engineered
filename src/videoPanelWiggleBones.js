import * as THREE from "three";
import { WiggleBone } from "wiggle";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { WiggleRigHelper } from "wiggle/helper";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

export default class VideoPanelWiggleBones extends THREE.Group {
  constructor(camera) {
    super();

    this.control = new TransformControls(camera, document.getElementById("canvas"));
    this.control.addEventListener("dragging-changed", function (event) {
      orbit.enabled = !event.value;
    });
    this.add(this.control)

    this.init();
  }

  init = async () => {
    const gltf = await new GLTFLoader().loadAsync('../assets/panel-anim-wiggle-bones.glb');
    this.add(gltf.scene);

    const rootL = gltf.scene.getObjectByName("RootL");
    const mesh = gltf.scene.getObjectByName("Plane");

    this.control.attach(rootL);

    const helper = new WiggleRigHelper({
      skeleton: mesh.skeleton,
    });
    this.add(helper);
  }

  update = (dt) => {

  }
}