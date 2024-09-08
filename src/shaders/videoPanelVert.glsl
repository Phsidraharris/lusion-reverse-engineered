#define PI 3.14159

uniform vec4 startRect;
uniform vec4 endRect;
uniform float size;

uniform float positionProgress;
uniform float maskProgress;
uniform float deformWeightX;
uniform float deformWeightY;

varying vec2 vUv;
varying float vMask;

vec2 rotate(vec2 pos, float angle) {
    float cosTheta = cos(angle);
    float sinTheta = sin(angle);
    mat2 rotMat = mat2(cosTheta, -sinTheta, sinTheta, cosTheta);

    pos.xy = rotMat * pos.xy;
    return pos;
}

void main() {
    vec3 pos = position;

    float stepEdge = 1.0 - maskProgress;

    vUv = uv;
    vMask = smoothstep(stepEdge, 1.0, uv.x);
    vMask *= smoothstep(stepEdge, 1.0, uv.y);

    // pos.xy += vec2(1., 0.) * vMask;
    pos.xy = rotate(pos.xy, PI * 0.125 * vMask);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}