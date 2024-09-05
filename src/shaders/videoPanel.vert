attribute float displacement;

uniform vec3 startRect;
uniform float test;

varying vec3 vNormal;
varying vec2 vUv;

void main() {
    vec3 newPosition = mix(startRect, position, test);
    // newPosition.x *= 1.6;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}