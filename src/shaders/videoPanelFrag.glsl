uniform sampler2D map;
uniform float borderRadius;

varying vec2 vUv;

float roundedCornerMask() {
    // Convert to normalised device coordinates (i.e center = 0, 0)
    vec2 uv = vUv * 2.0 - 1.0;

    // Define the position in normalized space
    vec2 cornerDistance = max(abs(uv) - (vec2(1.0) - borderRadius), 0.0);
    float dist = length(cornerDistance);

    // Define alpha based on distance and borderRadius
    float alpha = step(0., borderRadius - dist);

    return alpha;
}

void main() {
    vec4 albedo = texture2D(map, vUv);
    gl_FragColor = albedo * roundedCornerMask();
}
