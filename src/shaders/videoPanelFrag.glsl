varying vec2 vUv;
varying float vMask;

uniform sampler2D map;

void main() {
    vec4 albedo = texture2D(map, vUv);
    vec4 mask = vec4(vMask);
    gl_FragColor = mask;
}