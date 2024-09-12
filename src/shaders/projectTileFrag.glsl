#include "./common.glsl"

uniform float aspect;
uniform float taperAmount;
uniform sampler2D map;

varying vec2 vUv;

void main() {
    vec4 albedo = texture2D(map, vUv);
    
    float taperScaled = taperAmount * vUv.y;
    albedo.a = roundedCornerMask(vUv, 0.1, aspect, taperScaled);

    gl_FragColor = albedo;
}
