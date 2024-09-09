uniform sampler2D map;
uniform float borderRadius;
uniform vec4 startRect;
uniform vec4 endRect;
uniform float maskProgress;

varying vec2 vUv;

float getAspect() {
    float width = mix(startRect.w, endRect.w, maskProgress);
    float height = mix(startRect.z, endRect.z, maskProgress);
    return width / height;
}

float roundedCornerMask() {
    // Convert to normalised device coordinates (i.e center = 0, 0),
    // then treat corners as distances from the center with abs
    vec2 uv = vUv * 2.0 - 1.0;
    uv = abs(uv);

    // distance to corner
    vec2 corner = uv - vec2(1.0 - borderRadius, 1.0 - borderRadius);

    // max 0.0, prevents negative values
    corner = max(corner, vec2(0.0, 0.0));

    corner.x *= getAspect();

    float dist = length(corner);

    // Define alpha based on distance and borderRadius
    float alpha = step(0., borderRadius - dist);

    return alpha;
}

void main() {
    vec4 albedo = texture2D(map, vUv);
    albedo.a = roundedCornerMask();
    gl_FragColor = albedo;
}
