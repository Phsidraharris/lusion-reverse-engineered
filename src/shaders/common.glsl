float roundedCornerMask(vec2 uv, float borderRadius, float aspect) {
    // Convert to normalised device coordinates (i.e center = 0, 0),
    // then treat corners as distances from the center with abs
    vec2 uv_ndc = uv * 2.0 - 1.0;
    uv_ndc = abs(uv_ndc);

    // distance to corner
    float inverseAspect = 1. / aspect;
    vec2 corner = uv_ndc - vec2(1.0 - borderRadius * inverseAspect, 1.0 - borderRadius);

    // max 0.0, ignores negative values (i.e all fragments inside the rounded box)
    corner = max(corner, vec2(0.0, 0.0));
    corner.x *= aspect;

    float dist = length(corner);

    return step(dist, borderRadius);

    // // Define alpha based on distance and borderRadius
    // float alpha = step(0., borderRadius - dist);
    // return alpha;
}
