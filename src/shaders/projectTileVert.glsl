uniform float stretchAmount;

varying vec2 vUv;

void main() {
    vec3 newPosition = position;

    // convert uv to NDC
    vec2 ndcUv = uv * 2.0 - 1.0;
    float direction = sign(stretchAmount);

    newPosition.x *= 1. + (direction * sin(ndcUv.y * abs(stretchAmount)));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    vUv = uv;
}