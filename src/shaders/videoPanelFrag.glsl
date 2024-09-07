varying vec2 vUv;
varying float vMask;

uniform sampler2D map;

void main() {
    vec4 albedo = texture2D(map, vUv);
    // vec4 mask = vec4(vMask);
    vec4 red = vec4(1.0, 0.0, 0.0, 1.0);
    gl_FragColor = albedo;
}