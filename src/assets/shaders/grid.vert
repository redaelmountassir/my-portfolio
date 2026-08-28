#define MOVE_SPEED 0.5
#define NOISE_SCALE 600.0
#define NOISE_MAGNITUDE 1000.0

uniform float gridDepth;
uniform float gridSquare;
uniform float seed;
uniform float time;

varying vec3 vWorldPos;
varying vec2 vUv;
varying vec3 vNormal;

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
        dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return (130.0 * dot(m, g) + 1.0) * 0.5;
}

float calcNoise(vec2 samplePos, vec3 pos) {
    float octave1 = snoise(samplePos.xy / NOISE_SCALE);
    float octave2 = snoise(samplePos.xy / (NOISE_SCALE * .25));
    float noise = (octave1 + octave2 * .25) * 0.8;
    float heightGrad = smoothstep(gridDepth, 0.0, abs(pos.x));
    heightGrad *= heightGrad;
    return noise * NOISE_MAGNITUDE * (1.0 -heightGrad);
}

vec3 calcNormal(vec2 samplePos, vec3 pos) {
    float right = calcNoise(samplePos - vec2(gridSquare, 0.0), pos - vec3(gridSquare, 0.0, 0.0));
    float left = calcNoise(samplePos + vec2(gridSquare, 0.0), pos + vec3(gridSquare, 0.0, 0.0));
    float forward = calcNoise(samplePos - vec2(0.0, gridSquare), pos);
    float backward = calcNoise(samplePos + vec2(0.0, gridSquare), pos);

    vec3 tangent = vec3(2.0 * gridSquare, right - left, 0.0);
    vec3 bitangent = vec3(0.0, backward - forward, 2.0 * gridSquare);
    vec3 normal = normalize(cross(tangent, bitangent));

    return normal;
}

void main() {
    float offset = time * MOVE_SPEED * gridSquare;

    vec3 pos = position;
    pos.y -= mod(offset, gridSquare);

    vec2 samplePos = pos.xy + vec2(seed, offset);
    pos.z = calcNoise(samplePos, pos);
    
    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldPos = worldPos.xyz;

    vUv = uv;
    vNormal = calcNormal(samplePos, pos);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}