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
    // Convert to normalised device coordinates (i.e center = 0, 0)
    vec2 uv = vUv * 2.0 - 1.0;
    uv = abs(uv);

    // Define the position in normalized space
    vec2 cornerDistance = max(uv - (vec2(1.0) - borderRadius), 0.0);
    // cornerDistance.x *= getAspect();
    
    float dist = length(cornerDistance);

    return step(borderRadius, dist);
    // Define alpha based on distance and borderRadius
    float alpha = step(0., borderRadius - dist);

    return alpha;
}

void main() {
    vec4 albedo = texture2D(map, vUv);
    gl_FragColor = albedo + roundedCornerMask();
}
