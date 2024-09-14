#include "./common.glsl"

uniform float aspect;
uniform float letterRotation;
uniform float letterScale;
uniform float backgroundAlpha;

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

    // Scale uv so they cater for different aspects
    vec2 ndcUv = getNdcUV(vUv);
    ndcUv.x *= aspect;
    ndcUv /= letterScale;

    float letterThickness = 0.12;
    float letterLength = 0.3;

    // the start and end points of the rect that make up the vertical
    // Because UVs are defined from bottom left to bottom right, that how we'll define our rect corners
    vec2 lVerticalBl = vec2(-0.3, 0.);
    vec2 lVerticalTr = vec2(lVerticalBl.x + letterThickness, lVerticalBl.y + letterLength);
    vec2 lHorizontalBl = vec2(lVerticalBl.x + letterThickness, lVerticalBl.y - letterThickness);
    vec2 lHorizontalTr = vec2(lHorizontalBl.x + letterLength, lVerticalBl.y);

    vec2 rotateAnchor = vec2(lVerticalBl.x + letterThickness, lVerticalBl.y);
    vec2 verticalUv = ndcUv;
    verticalUv = rotateAroundAnchor(verticalUv, rotateAnchor, letterRotation);

    // remove everything outside the defined rectangle
    float vertical = calculateRect(lVerticalBl, lVerticalTr, verticalUv);
    float horizontal = calculateRect(lHorizontalBl, lHorizontalTr, ndcUv);
    float combined = step(1., vertical) + step(1., horizontal);

    if(combined > 0.0) {
        discard;
    }

    gl_FragColor = vec4(vec3(combined), backgroundAlpha);
}