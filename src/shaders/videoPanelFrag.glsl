varying vec2 vUv;

uniform sampler2D map;

void main() {
    vec4 albedo = texture2D(map, vUv);
    gl_FragColor = albedo;
}