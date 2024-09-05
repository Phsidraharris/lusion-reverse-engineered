import * as THREE from "three";
import { BoxGeometry } from "three";
import videoPanelVert from "./shaders/videoPanel.vert?raw";
import { elementToWorldRect } from "./utils/utils";
import { debugGui } from "./debugGui";

const PANEL_START_ID = "video-panel-start";
const PANEL_END_ID = "video-panel-end";

export default class VideoPanelShader extends THREE.Group {
    test = { value: 0 }

    constructor(camera) {
        super();

        const startRect = elementToWorldRect(PANEL_START_ID, camera, { x: 0, y: 0 });
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                startRect: { value: startRect.position },
                test: this.test,
            },
            vertexShader: videoPanelVert
        });
        this.mesh = new THREE.Mesh(new BoxGeometry(1, 1, 1, 16, 16, 16), this.material);

        this.add(this.mesh);

        this.initDebug();
    }

    initDebug = () => {
        const folder = debugGui.addFolder("Video Panel Shader");
        folder.add(this.test, "value", 0, 1);
    }

    update() { }
}