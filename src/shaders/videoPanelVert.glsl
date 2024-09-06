attribute float displacement;

uniform vec3 startRectPos;
uniform vec2 startRectSize;
uniform float test;
uniform float size;

varying vec3 vNormal;
varying vec2 vUv;

void main() {
    vec2 positionNormalised = vec2(position.x + size * 0.5, position.y + size * 0.5);

    vec3 newPosition = position;
    newPosition.x = mix(startRectPos.x, startRectPos.x + startRectSize.x, positionNormalised.x);
    newPosition.y = mix(-startRectPos.y, -startRectPos.y + startRectSize.y, positionNormalised.y);

    newPosition.x *= sin(test);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}