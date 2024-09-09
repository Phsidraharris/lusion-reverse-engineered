#define PI 3.14159265358979

uniform vec4 startRect;
uniform vec4 endRect;
uniform float maskProgress;

varying vec2 vUv;
varying float vMask;

vec2 rotate(vec2 pos, float angle) {
    float cosTheta = cos(angle);
    float sinTheta = sin(angle);
    mat2 rotMat = mat2(cosTheta, -sinTheta, sinTheta, cosTheta);

    pos.xy = rotMat * pos.xy;
    return pos;
}

// Takes VideoPanelShader rect (see VideoPanelShader.rectToVec4) and creates a position based on percentage a
vec2 getRectPos(vec4 rect, vec2 uv) {
    vec2 pos;
    pos.x = mix(rect.x, rect.x + rect.w, uv.x);
    pos.y = mix(rect.y, rect.y + rect.z, uv.y);
    return pos;
}

void main() {
    vec3 pos = position;

    float stepEdgeCurve = 1.0 - sin(maskProgress * PI) * 3.;    // multiply by 3 so that when maskProgress = 1, step edge contains more of the uv
    float startEndCurve = smoothstep(0.2, 1.0, maskProgress);
    float rotateCurve = PI * 0.125 * sin(maskProgress * PI);    // rotate by 1/8th of PI (i.e 16th turn of a circle), that peaks at maskProgress = 0.5

    vec2 videoPanelStartPos = getRectPos(startRect, uv);
    vec2 videoPanelEndPos = getRectPos(endRect, uv);

    vUv = uv;
    vMask = smoothstep(stepEdgeCurve, 1.0, uv.x);
    vMask *= smoothstep(stepEdgeCurve, 1.0, uv.y);

    pos.xy = mix(videoPanelStartPos, videoPanelEndPos, startEndCurve);

    pos.xy += vec2(0.1, 0.1) * vMask;
    pos.xy = rotate(pos.xy, rotateCurve * vMask);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}