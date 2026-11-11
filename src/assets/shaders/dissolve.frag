uniform sampler2D uTexture;
uniform float uProgress;
uniform float uSeed;
uniform vec2 uPlaneSize;
uniform float uPixelSize;

varying vec2 vUv;
const vec4 BLACK_COL = vec4(0.1216, 0.0275, 0.1569, 1.0);

// Improved random/noise function with seed
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * (43758.5453 + uSeed * 1000.0));
}

float easeOut(float t) {
    return 1.0 - (1.0 - t) * (1.0 - t);
}

void main() {
    vec4 texColor = texture2D(uTexture, vUv);

    // Counts follow the plane so each block stays the same size on screen.
    vec2 counts = max(uPlaneSize / max(uPixelSize, 1.0), vec2(1.0));
    vec2 cell = floor(vUv * counts);
    float noise = random(cell);

    // Discard pixels based on noise and progress
    if (noise < uProgress) {
        discard;
    }

    gl_FragColor = mix(BLACK_COL, texColor, easeOut(vUv.y + 0.1));
}