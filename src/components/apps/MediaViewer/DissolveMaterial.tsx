import { useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uProgress;
  uniform float uSeed;
  uniform float uPixelGranularity;
  uniform float uAspect;
  
  varying vec2 vUv;
  
  // Improved random/noise function with seed
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * (43758.5453 + uSeed * 1000.0));
  }
  
  void main() {
    vec4 texColor = texture2D(uTexture, vUv);

    // Columns across the image; rows follow aspect so each block is square.
    float columns = max(uPixelGranularity, 1.0);
    float rows = max(columns / max(uAspect, 0.001), 1.0);
    vec2 cell = floor(vUv * vec2(columns, rows));
    float noise = random(cell);
    
    // Discard pixels based on noise and progress
    if (noise < uProgress) {
      discard;
    }
    
    gl_FragColor = texColor;
  }
`;

const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export type TextureContent = THREE.Texture | THREE.VideoTexture;

const DissolveMaterial = ({
	texture,
	progress,
	seed,
	pixelGranularity,
	aspect,
	isVideo,
}: {
	texture: TextureContent;
	progress: MotionValue<number>;
	seed: number;
	pixelGranularity: number;
	aspect: number;
	isVideo: boolean;
}) => {
	const materialRef = useRef<THREE.ShaderMaterial>(null);
	const invalidate = useThree(state => state.invalidate);

	// Motion updates the value outside React, so each change has to request a frame.
	useEffect(() => {
		invalidate();
		return progress.on("change", () => invalidate());
	}, [progress, invalidate, texture, seed, pixelGranularity, aspect]);

	useFrame(() => {
		const material = materialRef.current;
		if (!material) return;

		material.uniforms.uTexture.value = texture;
		material.uniforms.uProgress.value = progress.get();
		material.uniforms.uSeed.value = seed;
		material.uniforms.uPixelGranularity.value = pixelGranularity;
		material.uniforms.uAspect.value = aspect;

		if (isVideo && texture instanceof THREE.VideoTexture) {
			const video = texture.image;
			if (video.readyState >= video.HAVE_CURRENT_DATA)
				texture.needsUpdate = true;
			if (!video.paused && !video.ended) invalidate();
		}
	});

	return (
		<shaderMaterial
			ref={materialRef}
			vertexShader={vertexShader}
			fragmentShader={fragmentShader}
			uniforms={{
				uTexture: { value: texture },
				uProgress: { value: progress.get() },
				uSeed: { value: seed },
				uPixelGranularity: { value: pixelGranularity },
				uAspect: { value: aspect },
			}}
			transparent
			depthWrite={false}
			depthTest={false}
			toneMapped={false}
		/>
	);
};

export default DissolveMaterial;
