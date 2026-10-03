import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import type { TextureContent } from "./DissolveMaterial";

const targetDpr = () => Math.min(window.devicePixelRatio || 1, 2);

const bufferMatchesLayout = (gl: THREE.WebGLRenderer) => {
	const canvas = gl.domElement;
	const rect = canvas.getBoundingClientRect();
	if (rect.width < 2 || rect.height < 2) return false;
	if (gl.getPixelRatio() + 0.01 < targetDpr()) return false;
	const expectedW = Math.floor(rect.width * gl.getPixelRatio());
	const expectedH = Math.floor(rect.height * gl.getPixelRatio());
	return canvas.width >= expectedW - 2 && canvas.height >= expectedH - 2;
};

const mediaFrameReady = (texture: TextureContent, isVideo: boolean) => {
	if (!isVideo || !(texture instanceof THREE.VideoTexture)) return true;
	return texture.image.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA;
};

const FixCanvas = ({
	texture,
	isVideo,
	onReady,
}: {
	texture: TextureContent;
	isVideo: boolean;
	onReady: () => void;
}) => {
	const gl = useThree(state => state.gl);

	// The renderer writes a pixel size onto the canvas. Keep it stretched to the
	// container so an early measurement cannot leave the image sitting in a corner.
	useLayoutEffect(() => {
		const canvas = gl.domElement;
		canvas.style.width = "100%";
		canvas.style.height = "100%";
	}, [gl]);

	// Demand mode can paint a stretched low-res buffer, then a cleared transparent
	// frame, before the drawing buffer matches the layout. Stay covered until two
	// consecutive frames are at the final size and the media has a real frame.
	const invalidate = useThree(state => state.invalidate);
	const stableFrames = useRef(0);
	const reported = useRef(false);
	const revealFrame = useRef(0);
	const onReadyRef = useRef(onReady);
	onReadyRef.current = onReady;

	useEffect(() => {
		reported.current = false;
		stableFrames.current = 0;
		cancelAnimationFrame(revealFrame.current);
		return () => cancelAnimationFrame(revealFrame.current);
	}, [texture]);

	useFrame(() => {
		if (reported.current) return;
		const ready =
			bufferMatchesLayout(gl) && mediaFrameReady(texture, isVideo);
		stableFrames.current = ready ? stableFrames.current + 1 : 0;
		if (stableFrames.current < 2) {
			invalidate();
			return;
		}
		reported.current = true;
		revealFrame.current = requestAnimationFrame(() => onReadyRef.current());
	});

	return null;
};

export default FixCanvas;
