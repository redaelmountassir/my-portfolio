import { MeshLambertMaterial } from 'three';
import { Colors } from '../utils';

export const createGlitchMat = () => {
	const mat = new MeshLambertMaterial({
		color: Colors.whitePrimary,
		reflectivity: 0,
	});

	mat.onBeforeCompile = shader => {
		shader.uniforms.time = { value: 0 };
		shader.uniforms.glitching = { value: 0 };

		shader.vertexShader = `
			uniform float time;
			uniform float glitching;

			vec2 rotate(vec2 v, float a) {
				float s = sin(a);
				float c = cos(a);
				mat2 m = mat2(c, s, -s, c);
				return m * v;
			}
			vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
			float snoise(vec2 v){
				const vec4 C = vec4(0.211324865405187, 0.366025403784439,
						-0.577350269189626, 0.024390243902439);
				vec2 i  = floor(v + dot(v, C.yy) );
				vec2 x0 = v -   i + dot(i, C.xx);
				vec2 i1;
				i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
				vec4 x12 = x0.xyxy + C.xxzz;
				x12.xy -= i1;
				i = mod(i, 289.0);
				vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
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
				return 130.0 * dot(m, g);
			}
			float select(float a, float b, float c, float i) {
				return mix(a, mix(b, c, floor(i / 2.0)), step(1.0, i));
			}
			vec3 select(vec3 a, vec3 b, vec3 c, float i) {
				return mix(a, mix(b, c, step(2.0, i)), step(1.0, i));
			}
			${shader.vertexShader}
		`;
		shader.vertexShader = shader.vertexShader.replace(
			'#include <begin_vertex>',
			`vec4 clipPosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			float glitchMode = round(rand(vec2(floor(time * 5.0))) * 2.0); //0, 1, or 2
			float glitch = select(
				(snoise(clipPosition.xy * 0.15 + vec2(time * 0.85)) * 0.25 + 0.5),
				1.0,
				(snoise(clipPosition.y + vec2(0.0, time * 0.85)) * 0.25 + 0.5),
				glitchMode
			) * glitching;
			float randVal = rand(position.xz + time) * 0.35;
			vec3 transformed = position + smoothstep(
				0.6,
				0.61,
				glitch
			) * select(
				vec3(-randVal, randVal, -randVal),
				vec3(0.0, -randVal, 0.0) * step(0.0, dot(vNormal, vec3(0.0, -1.0, 0.0))) * step(position.y, 1.0),
				vec3(randVal * 2.0 - 0.25, 0.0, 0.0),
				glitchMode
			);`
		);

		mat.userData.shader = shader;
	};

	return mat;
};
