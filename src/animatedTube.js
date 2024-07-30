import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { debugGui } from "./debugGui";
import nurbsJson from "../assets/nurbs-points.json";
import { NURBSCurve } from "three/examples/jsm/Addons.js";

// Adapted from https://codepen.io/prisoner849/pen/bGQNEwm
export class AnimatedTube extends THREE.Group {
    uniforms = {
        curveTexture: { value: null },
        stretchRatio: { value: 0 }
    }

    drawStartPercent = 0;
    radius = 0.1;

    mesh = null;

    constructor() {
        super();

        this.mesh = this.createTubeMesh();
        this.add(this.mesh);

        const folder = debugGui.addFolder("AnimatedTube");
        folder.add(this, 'drawStartPercent', 0, 1).onChange(value => {
            this.uniforms.stretchRatio.value = value;
        });
        folder.add(this, 'radius', 0, 1).onChange(value => {
            this.remove(this.mesh);
            this.mesh = this.createTubeMesh();
            this.add(this.mesh);
        });
    }

    createTubeMesh() {
        const curve = this.createNurbsCurve(4);

        let lineCurve = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(curve.getSpacedPoints(50)),
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

        let cylinderSegments = 1000;
        let radialSegments = 100;
        let tubeGeometry = mergeGeometries([
            new THREE.SphereGeometry(this.radius, radialSegments, radialSegments * 0.5, 0, Math.PI * 2, 0, Math.PI * 0.5).translate(0, 0.5, 0),
            new THREE.CylinderGeometry(this.radius, this.radius, 1, radialSegments, cylinderSegments, true),
            new THREE.SphereGeometry(this.radius, radialSegments, radialSegments * 0.5, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5).translate(0, -0.5, 0)
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

        const mesh = new THREE.Mesh(tubeGeometry.clone(), tubeMaterial);
        mesh.frustumCulled = false;

        return mesh;
    }

    createNurbsCurve(nurbsDegree = 3) {
        const nurbsPoints = nurbsJson[0].points.reverse().map((p) => new THREE.Vector4(p.x, p.y, p.z, p.weight));
        const nurbsKnots = [];

        for (let i = 0; i <= nurbsDegree; i++) {
            nurbsKnots.push(0);
        }

        for (let i = 0, j = nurbsPoints.length; i < j; i++) {
            const knot = (i + 1) / (j - nurbsDegree);
            nurbsKnots.push(THREE.MathUtils.clamp(knot, 0, 1));
        }

        const nurbsCurve = new NURBSCurve(nurbsDegree, nurbsKnots, nurbsPoints);
        return nurbsCurve;
    }
}