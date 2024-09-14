#include "./common.glsl"

uniform float aspect;

varying vec2 vUv;

float calculateRect(vec2 bl, vec2 tr, vec2 uv) {
    float rect = 1.0;
    rect -= step(uv.x, bl.x);
    rect -= step(tr.x, uv.x);
    rect -= step(uv.y, bl.y);
    rect -= step(tr.y, uv.y);

    return rect;
}

void main() {
    vec4 col = vec4(0., 0., 0., 1.0);

    vec2 ndcUv = getNdcUV(vUv);
    ndcUv.x *= aspect;
    // these uvs run from -1 to 1
    // how can we make these run from 

    // the start and end points of the rect that make up the vertical
    // Because UVs are defined from bottom left to bottom right, that how we'll define our rect corners
    vec2 lVerticalBl = vec2(0.4, 0.5);
    vec2 lVerticalTr = vec2(0.5, 0.7);
    vec2 lHorizontalBl = vec2(0.5, 0.4);
    vec2 lHorizontalTr = vec2(0.7, 0.5);

    // remove everything outside the defined rectangle
    float vertical = calculateRect(lVerticalBl, lVerticalTr, ndcUv);
    float horizontal = calculateRect(lHorizontalBl, lHorizontalTr, ndcUv);
    float combined = step(1., vertical) + step(1., horizontal);

    if(combined > 0.0) {
        discard;
    }

    gl_FragColor = vec4(vec3(combined), 1.);
}