import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import type { Mesh } from "three";

export type ObjectFit = "contain" | "cover";

interface MediaMeshProps {
	contentAspectRatio: number;
	objectFit?: ObjectFit;
	children?: ReactNode;
}

const fittedPlaneSize = (
	viewportWidth: number,
	viewportHeight: number,
	contentAspectRatio: number,
	objectFit: ObjectFit,
): [number, number] => {
	const viewportAspect = viewportWidth / Math.max(viewportHeight, 1e-6);
	const safeAspect =
		contentAspectRatio > 0 ? contentAspectRatio : viewportAspect;
	const contentIsWider = safeAspect > viewportAspect;

	if (objectFit === "cover") {
		// Fill the view and crop the overflowing axis.
		if (contentIsWider) {
			const height = viewportHeight;
			return [height * safeAspect, height];
		}
		const width = viewportWidth;
		return [width, width / safeAspect];
	}

	// Fit the whole media inside the view.
	if (contentIsWider) {
		const width = viewportWidth;
		return [width, width / safeAspect];
	}
	const height = viewportHeight;
	return [height * safeAspect, height];
};

const MediaMesh = ({
	contentAspectRatio,
	objectFit = "cover",
	children,
}: MediaMeshProps) => {
	const meshRef = useRef<Mesh>(null);
	const size = useThree(state => state.size);

	const fit = (width: number, height: number) => {
		const mesh = meshRef.current;
		if (!mesh || width <= 0 || height <= 0) return;
		const [planeWidth, planeHeight] = fittedPlaneSize(
			width,
			height,
			contentAspectRatio,
			objectFit,
		);
		mesh.scale.set(planeWidth, planeHeight, 1);
	};

	// Fit before paint, and again on the resize frame. Demand mode can draw
	// with a new camera before React applies a new scale.
	useLayoutEffect(() => {
		fit(size.width, size.height);
	}, [size.width, size.height, contentAspectRatio, objectFit]);

	useFrame(state => {
		fit(state.size.width, state.size.height);
	});

	return (
		<mesh ref={meshRef}>
			<planeGeometry args={[1, 1]} />
			{children}
		</mesh>
	);
};

export default MediaMesh;
