uniform vec4 startRect;
uniform vec4 endRect;
uniform float size;

uniform float positionProgress;
uniform float maskProgress;
uniform float deformWeightX;
uniform float deformWeightY;

varying vec2 vUv;
varying float vMask;

void main() {
    vec2 positionNormalised = vec2(position.x + size * 0.5, position.y - size * 0.5);

    // Experiment with modifying 
    positionNormalised.y += cos(positionNormalised.x * 6.) * deformWeightX;
    positionNormalised.x += sin(positionNormalised.y * 6.) * deformWeightY;

    vec3 startPosition;
    startPosition.x = mix(startRect.x, startRect.x + startRect.w, positionNormalised.x);
    startPosition.y = mix(startRect.y, startRect.y + startRect.z, positionNormalised.y);

    vec3 endPosition;
    endPosition.x = mix(endRect.x, endRect.x + endRect.w, positionNormalised.x);
    endPosition.y = mix(endRect.y, endRect.y + endRect.z, positionNormalised.y);

    vec3 newPosition = mix(startPosition, endPosition, positionProgress);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    vMask = smoothstep(0.9 - maskProgress, 1., positionNormalised.x);
    vUv = uv;
}