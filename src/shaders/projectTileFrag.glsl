uniform sampler2D map;

varying vec2 vUv;

void main() {
    vec4 albedo = texture2D(map, vUv);

    gl_FragColor = albedo;
}
