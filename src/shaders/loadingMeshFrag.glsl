#include "./common.glsl"

#define LOADING_TRACK_COLOUR vec3(0.12, 0.12, 0.12)
#define LOADING_PROGRESS_COLOUR vec3(1.0, 1.0, 1.0)

uniform float aspect;
uniform float letterRotation;
uniform float letterScale;
uniform float backgroundAlpha;
uniform float loadingProgress;

varying vec2 vUv;

float calculateRect(vec2 bl, vec2 tr, vec2 uv) {
    float rect = 1.0;

    rect -= step(uv.x, bl.x);
    rect -= step(tr.x, uv.x);
    rect -= step(uv.y, bl.y);
    rect -= step(tr.y, uv.y);

    return clamp(rect, 0.0, 1.0);
}

float calculateRectPercent(vec2 bl, vec2 tr, vec2 uv, float percent) {
    float rect = 1.0;
    float width = tr.x - bl.x;

    rect -= step(uv.x, bl.x);
    rect -= step(bl.x + width * percent, uv.x);
    rect -= step(uv.y, bl.y);
    rect -= step(tr.y, uv.y);

    return clamp(rect, 0.0, 1.0);
}

void main() {
    vec4 col = vec4(0., 0., 0., 1.0);

    // Scale uv so they cater for different aspects
    vec2 ndcUv = getNdcUV(vUv);
    ndcUv.x *= aspect;
    ndcUv /= letterScale;

    float letterThickness = 0.1;
    float letterLength = 0.3;

    vec2 loadingBarBl = vec2(-letterLength, -letterThickness * 0.5);
    vec2 loadingBarTr = vec2(letterLength, letterThickness * 0.5);

    // the start and end points of the rect that make up the vertical
    // Because UVs are defined from bottom left to bottom right, that how we'll define our rect corners
    vec2 lVerticalBl = vec2(-letterLength, -letterThickness * 0.5);
    vec2 lVerticalTr = vec2(0.0, letterThickness * 0.5);

    vec2 lHorizontalBl = vec2(0.0, -letterThickness * 0.5);
    vec2 lHorizontalTr = vec2(letterLength, letterThickness * 0.5);

    vec2 rotateAnchor = vec2(0.0, letterThickness * 0.5);
    vec2 verticalUv = ndcUv;
    verticalUv = rotateAroundAnchor(verticalUv, rotateAnchor, letterRotation);

    // remove everything outside the defined rectangle
    float loadingBarTrack = calculateRect(loadingBarBl, loadingBarTr, ndcUv);
    float loadingBarProgress = calculateRectPercent(loadingBarBl, loadingBarTr, ndcUv, loadingProgress);

    float vertical = calculateRect(lVerticalBl, lVerticalTr, verticalUv);
    float horizontal = calculateRect(lHorizontalBl, lHorizontalTr, ndcUv);
    float combined = step(1., vertical) + step(1., horizontal);

    if(loadingProgress >= 1.0 && combined > 0.0) {
        discard;
    }

    vec3 trackColour = loadingBarTrack * LOADING_TRACK_COLOUR;
    vec3 progressColour = loadingBarProgress * LOADING_PROGRESS_COLOUR;

    gl_FragColor = vec4(trackColour + progressColour, backgroundAlpha);
}