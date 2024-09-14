#define PI 3.14159265358979

#include "./common.glsl"

uniform float animateProgress;
uniform vec4 startRect;
uniform vec4 endRect;

varying vec2 vUv;

// Takes VideoPanelShader rect (see VideoPanelShader.rectToVec4) and creates a position based on percentage a
vec2 getRectPos(vec4 rect, vec2 uv) {
    vec2 pos;
    pos.x = mix(rect.x, rect.x + rect.w, uv.x);
    pos.y = mix(rect.y - rect.z, rect.y, uv.y);
    return pos;
}

void main() {
    vec3 pos = position;

    float stepEdgeCurve = 1.0 - sin(animateProgress * PI) * 2.0;    // multiply by 3 so that when animateProgress = 1, step edge contains more of the uv
    float startEndCurve = smoothstep(0.2, 1.0, animateProgress);
    float rotateCurve = PI * 0.125 * sin(animateProgress * PI);     // rotate by 1/8th of PI (i.e 16th turn of a circle), that peaks at animateProgress = 0.5

    vec2 videoPanelStartPos = getRectPos(startRect, uv);
    vec2 videoPanelEndPos = getRectPos(endRect, uv);

    float mask = smoothstep(stepEdgeCurve, 1.0, uv.x);
    mask *= smoothstep(stepEdgeCurve, 1.0, uv.y);

    pos.xy = mix(videoPanelStartPos, videoPanelEndPos, startEndCurve);
    pos.xy = rotate(pos.xy, rotateCurve * mask);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    vUv = uv;
}