#define PI 3.1415926538
#define LINE_SIZE .75
#define OFFSET vec2(0.0, 200.0)
#define LIGHT_DIR vec3(0.0, -0.5, -1.0)

uniform float gridDepth;
uniform float gridSquare;
uniform vec3 color;
uniform vec3 lineColor;
uniform vec3 lightColor;
uniform float time;

varying vec3 vWorldPos;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
    float falloff = smoothstep(gridDepth, gridDepth * .75, length(vec2(vWorldPos.x, vWorldPos.z) - OFFSET));

    vec2 gridUv = vUv;
    gridUv.x *= 2.0;
    gridUv *= gridDepth;
    gridUv /= gridSquare;

    vec2 gridLines = 1.0 - abs(fract(gridUv - 0.5) - 0.5) / (LINE_SIZE * fwidth(gridUv));
    float grid = clamp(max(gridLines.x, gridLines.y), 0.0, 1.0);

    float light = pow(dot(vNormal, normalize(LIGHT_DIR)), 3.0);
    light += smoothstep(gridDepth * 0.75, gridDepth * 0.25, distance(vWorldPos.xz, vec2(0.0, -gridDepth)));
    light = min(light, 1.0);

    gl_FragColor = vec4(mix(color, mix(lineColor, lightColor, light), grid), falloff);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}