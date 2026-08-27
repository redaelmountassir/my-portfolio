#define PI 3.1415926538
#define NEBULA_SPEED 20.0

uniform vec4 sunPos;
uniform vec3 sunColor;
uniform vec3 sunColor2;
uniform vec3 groundColor;
uniform vec3 skyColor;
uniform vec3 nebulaColor;
uniform float seed;
uniform float time;
uniform float sunSize;

varying vec3 vWorldPosition;

float rand1D(float n) {
    return fract(sin(n) * 43758.5453);
}

float rand3D(vec3 x) {
    return fract(sin(dot(x.xyz ,vec3(12.9898,78.233,144.7272))) * 43758.5453);
}

float randomPoint3D(vec3 pos, float pointChance) {
    vec3 cellIndex = floor(pos);
    vec3 cellPos = pos - cellIndex;
    
    //Random point position within the cell
    vec3 pointPos = vec3(
        rand3D(vec3(cellIndex.x + 1.0, cellIndex.y, cellIndex.z)),
        rand3D(vec3(cellIndex.x, cellIndex.y + 1.0, cellIndex.z)),
        rand3D(vec3(cellIndex.x, cellIndex.y, cellIndex.z + 1.0))
    );

    //Will fit the point as much as it can within the cell (closer to the cell's center = bigger radius)
    float pointRadius = min(min(min(pointPos.x, 1.0 - pointPos.x), min(pointPos.y, 1.0 - pointPos.y)), min(pointPos.z, 1.0 - pointPos.z));

    float dist = distance(pointPos, cellPos);

    //Reduces the chance of a point existing in a cell in the end (.25 or 25% means 25% of the cells have points)
    float addPoint = float(rand3D(cellIndex) <= pointChance);
    return addPoint * smoothstep(pointRadius, 0.0, dist);
}

float perlin3D(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);

    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0 + 113.0*p.z;

    return (mix(mix(mix( rand1D(n+0.0), rand1D(n+1.0),f.x),
        mix(rand1D(n+57.0), rand1D(n+58.0),f.x),f.y),
        mix(mix( rand1D(n+113.0), rand1D(n+114.0),f.x),
        mix( rand1D(n+170.0), rand1D(n+171.0),f.x),f.y),f.z) + 1.0) * 0.5;
}

void main() {
    //Height gradient based off of the sun position
    float h = smoothstep(sunPos.y - 800.0, sunPos.y + 500.0, vWorldPosition.y);

    //Sun mask
    float sunMask = 1.0 - step(sunSize, distance(vWorldPosition, sunPos.xyz));
    sunMask *= mix(max(sign(sin((vWorldPosition.y + time * 50.0) * mix(0.035, 0.065, rand3D(vec3(seed))))), 0.0), 1.0, round(h));

    //Star mask
    float starMask = min(1.0, 
        mix(randomPoint3D(vWorldPosition * 0.05 + seed, .05), 0.0, max(0.0, sin(time))) +
        mix(randomPoint3D(vWorldPosition * 0.05 + seed + 2000.6, .05), 0.0, max(0.0, cos(time))) +
        mix(randomPoint3D(vWorldPosition * 0.05 + seed - 1000.75, .05), 0.0, max(0.0, -sin(time)))
    );

    //Sky color
    vec3 nebulaSamplePos = vWorldPosition;
    nebulaSamplePos.z += seed + time * NEBULA_SPEED;
    float nebulaMask = pow(perlin3D(nebulaSamplePos * 0.002), 3.0);
    nebulaMask -= (1.0 - nebulaMask) * pow(perlin3D(nebulaSamplePos * 0.01), 3.0) * .75;
    nebulaMask -= (1.0 - nebulaMask) * pow(perlin3D(nebulaSamplePos * 0.02), 3.0) * .5;
    vec3 sky = mix(groundColor, mix(mix(skyColor, nebulaColor, 0.5 * (1.0 - nebulaMask)), vec3(1.0), starMask), h);

    gl_FragColor = vec4(mix(sky, mix(sunColor, sunColor2, h), sunMask), 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}