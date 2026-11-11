import { useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { useEffect, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import fragmentShader from "../assets/shaders/dissolve.frag";
import { fittedPlaneSize, type ObjectFit } from "./MediaMesh";

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
	blockSize,
	aspect,
	objectFit,
	isVideo,
}: {
	texture: TextureContent;
	progress: MotionValue<number>;
	seed: number;
	blockSize: number;
	aspect: number;
	objectFit: ObjectFit;
	isVideo: boolean;
}) => {
	const materialRef = useRef<THREE.ShaderMaterial>(null);
	const invalidate = useThree(state => state.invalidate);
	const width = useThree(state => state.size.width);
	const height = useThree(state => state.size.height);

	const syncPixels = (viewWidth: number, viewHeight: number) => {
		const material = materialRef.current;
		if (!material || viewWidth <= 0 || viewHeight <= 0) return;
		const [planeWidth, planeHeight] = fittedPlaneSize(
			viewWidth,
			viewHeight,
			aspect,
			objectFit,
		);
		(material.uniforms.uPlaneSize.value as THREE.Vector2).set(
			planeWidth,
			planeHeight,
		);
		material.uniforms.uPixelSize.value = Math.max(blockSize, 1);
	};

	// Motion updates the value outside React, so each change has to request a frame.
	useEffect(() => {
		invalidate();
		return progress.on("change", () => invalidate());
	}, [progress, invalidate, texture, seed, blockSize, aspect, objectFit]);

	useLayoutEffect(() => {
		syncPixels(width, height);
		invalidate();
	}, [width, height, aspect, objectFit, blockSize, invalidate]);

	useFrame(state => {
		const material = materialRef.current;
		if (!material) return;

		syncPixels(state.size.width, state.size.height);
		material.uniforms.uTexture.value = texture;
		material.uniforms.uProgress.value = progress.get();
		material.uniforms.uSeed.value = seed;

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
				uPlaneSize: { value: new THREE.Vector2(1, 1) },
				uPixelSize: { value: 1 },
			}}
			transparent
			depthWrite={false}
			depthTest={false}
			toneMapped={false}
		/>
	);
};

export default DissolveMaterial;
