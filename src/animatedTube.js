import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { debugGui } from "./debugGui";
import nurbsJson from "../assets/nurbs-points.json";

// Adapted from https://codepen.io/prisoner849/pen/bGQNEwm
export class AnimatedTube extends THREE.Group {
    uniforms = {
        curveTexture: { value: null },
        stretchRatio: { value: 0 }
    }

    drawStartPercent = 0;
    drawEndPercent = 0;

    constructor() {
        super();

        const folder = debugGui.addFolder("AnimatedTube");
        folder.add(this, 'drawStartPercent', 0, 1).onChange(value => {
            this.uniforms.stretchRatio.value = value;
        });
        folder.add(this, 'drawEndPercent', 0, 1).onChange(value => {

        });

        let curvePts = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -10),
            new THREE.Vector3(-2, 0, -20),
            new THREE.Vector3(30, 0, -30),
            new THREE.Vector3(0, 0, -40),
            new THREE.Vector3(5, 0, -50),
            new THREE.Vector3(7, 0, -60),
            new THREE.Vector3(5, 0, -70),
            new THREE.Vector3(0, 0, -80),
            new THREE.Vector3(0, 0, -90),
            new THREE.Vector3(0, 0, -100)
        ];

        curvePts = nurbsJson[0].points.map(p => new THREE.Vector3(p.x, p.y, p.z));
        curvePts.forEach(p => {
            // p.z += 50;
            // p.divideScalar(4);
        });

        let curve = new THREE.CatmullRomCurve3(
            curvePts
        );
        let lineCurve = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(curve.getSpacedPoints(500)),
            new THREE.LineBasicMaterial({ color: "red" })
        )
        this.add(lineCurve);

        // datatexture
        let data = [];
        let wtt = (vArr) => {
            vArr.forEach(v => { data.push(v.x, v.y, v.z, 0) });
        }
        let texSize = 1024;
        let pData = curve.getSpacedPoints(texSize - 1);
        let ffData = curve.computeFrenetFrames(texSize - 1);
        wtt(pData);
        wtt(ffData.tangents);
        let dataTexture = new THREE.DataTexture(new Float32Array(data), texSize, 2, THREE.RGBAFormat, THREE.FloatType);
        dataTexture.needsUpdate = true;
        this.uniforms.curveTexture.value = dataTexture;
        //////////////

        let csegs = 500;
        let rsegs = 12;
        let r = 1;
        let tubeGeometry = mergeGeometries([
            new THREE.SphereGeometry(r, rsegs, rsegs * 0.5, 0, Math.PI * 2, 0, Math.PI * 0.5).translate(0, 0.5, 0),
            new THREE.CylinderGeometry(r, r, 1, rsegs, csegs, true),
            new THREE.SphereGeometry(r, rsegs, rsegs * 0.5, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5).translate(0, -0.5, 0)
        ]).rotateZ(-Math.PI * 0.5).rotateY(Math.PI * 0.5);

        let tubeMaterial = new THREE.MeshLambertMaterial({
            color: "blue",
            onBeforeCompile: shader => {
                shader.uniforms.curveTexture = this.uniforms.curveTexture;
                shader.uniforms.stretchRatio = this.uniforms.stretchRatio;
                shader.vertexShader = `
      uniform sampler2D curveTexture;
      uniform float stretchRatio;
      
      // https://github.com/glslify/glsl-look-at
      mat3 calcLookAtMatrix(vec3 origin, vec3 target, float roll) {
        vec3 rr = vec3(sin(roll), cos(roll), 0.0);
        vec3 ww = normalize(target - origin);
        vec3 uu = normalize(cross(ww, rr));
        vec3 vv = normalize(cross(uu, ww));

        return -mat3(uu, vv, ww);
      }
      ${shader.vertexShader}
    `.replace(
                    `#include <beginnormal_vertex>`,
                    `#include <beginnormal_vertex>
      
        vec3 pos = position;
        
        vec3 cpos = vec3(0.);
        vec3 ctan = vec3(0.);
        
        float a = clamp(pos.z + 0.5, 0., 1.) * stretchRatio;
        if(pos.z < -0.5){
          cpos = vec3(texture(curveTexture, vec2(0., 0.25)));
          ctan = vec3(texture(curveTexture, vec2(0., 0.75)));
          pos.z += 0.5;
        } else if(pos.z >= -0.5){
          cpos = vec3(texture(curveTexture, vec2(a, 0.25)));
          ctan = vec3(texture(curveTexture, vec2(a, 0.75)));
          pos.z = (pos.z > 0.5) ? (pos.z - 0.5) : 0.;
        }
        
        mat3 rot = calcLookAtMatrix(vec3(0), -ctan, 0.);
        
        objectNormal = normalize(rot * objectNormal);
      `).replace(
                        `#include <begin_vertex>`,
                        `#include <begin_vertex>    
        
        transformed = rot * pos;
        transformed += cpos;
      `
                    );
                console.log(shader.vertexShader);
            }
        });
        let mesh = new THREE.Mesh(tubeGeometry.clone(), tubeMaterial);
        mesh.frustumCulled = false;
        this.add(mesh);

    }
}