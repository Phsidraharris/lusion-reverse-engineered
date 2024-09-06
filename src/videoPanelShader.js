import * as THREE from "three";
import { BoxGeometry } from "three";
import videoPanelVert from "./shaders/videoPanelVert.glsl?raw";
import { elementToLocalRectPoints, elementToWorldRect } from "./utils/utils";
import { debugGui } from "./debugGui";
import { Vector2 } from "three";

const PANEL_START_ID = "video-panel-start";
const PANEL_END_ID = "video-panel-end";
const SIZE = 1;
const SUBDIVISIONS = 16;

export default class VideoPanelShader extends THREE.Group {
    test = { value: 0 }

    constructor(camera) {
        super();

        const startWorldRect = elementToWorldRect(PANEL_START_ID, camera);
        this.position.copy(startWorldRect.position);

        const startLocalRect = elementToLocalRectPoints(PANEL_START_ID, this, camera);

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                startRectPos: { value: startLocalRect.tl },
                startRectSize: { value: new Vector2(startWorldRect.width, startWorldRect.height) },
                test: this.test,
                size: { value: SIZE }
            },
            vertexShader: videoPanelVert
        });
        this.mesh = new THREE.Mesh(new BoxGeometry(SIZE, SIZE, 1, SUBDIVISIONS, SUBDIVISIONS, SUBDIVISIONS), this.material);

        this.add(this.mesh);

        this.initDebug();
    }

    initDebug = () => {
        const folder = debugGui.addFolder("Video Panel Shader");
        folder.add(this.test, "value", -10, 10);
    }

    update() { }
}