import * as THREE from "three";
import { Vector4 } from "three";
import { debugGui } from "./debugGui";
import videoPanelVFrag from "./shaders/videoPanelFrag.glsl?raw";
import videoPanelVert from "./shaders/videoPanelVert.glsl?raw";
import { createVideoTexture, elementToLocalRect, elementToWorldRect } from "./utils/utils";

const PANEL_START_ID = "video-panel-start";
const PANEL_END_ID = "video-panel-end";
const SIZE = 1;
const SUBDIVISIONS = 32;

export default class VideoPanelShader extends THREE.Group {
    maskProgress = { value: 0 };
    borderRadius = { value: 0.085 };

    constructor(camera) {
        super();

        const startWorldRect = elementToWorldRect(PANEL_START_ID, camera);
        this.position.copy(startWorldRect.position);

        const videoTexture = createVideoTexture("assets/pexels-2519660-uhd_3840_2160_24fps.mp4");
        const startRectLocal = elementToLocalRect(PANEL_START_ID, this, camera);
        const endRectLocal = elementToLocalRect(PANEL_END_ID, this, camera);

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                startRect: { value: VideoPanelShader.rectToVec4(startRectLocal) },
                endRect: { value: VideoPanelShader.rectToVec4(endRectLocal) },
                maskProgress: this.maskProgress,
                borderRadius: this.borderRadius,
                map: { value: videoTexture }
            },
            vertexShader: videoPanelVert,
            fragmentShader: videoPanelVFrag,
            transparent: true,
        });
        this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(SIZE, SIZE, SUBDIVISIONS, SUBDIVISIONS), this.material);
        this.mesh.frustumCulled = false;
        this.add(this.mesh);

        this.initDebug();
    }

    initDebug = () => {
        const folder = debugGui.addFolder("Video Panel Shader");
        folder.add(this.maskProgress, "value", 0, 1).name("Mask progress");
        folder.add(this.borderRadius, "value", 0, 1).name("Borderadius");
    }

    /**
     * Converts a  height rect to a vec4 (for shader uniforms),
     * where x = x pos, y = y pos, w = width, z = height 
     * @param {{position: Vector3, width: number, height: number}} rect 
     */
    static rectToVec4(rect) {
        return new Vector4(
            rect.position.x,
            rect.position.y,
            rect.height,
            rect.width,
        );
    }

    update() { }
}