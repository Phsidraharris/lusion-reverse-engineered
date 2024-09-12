#include "./common.glsl"

uniform float aspect;
uniform sampler2D map;

varying vec2 vUv;

void main() {
    vec4 albedo = texture2D(map, vUv);
    
    albedo.a = roundedCornerMask(vUv, 0.2, aspect);

    gl_FragColor = albedo;
}
