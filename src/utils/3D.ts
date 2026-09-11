import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import {
	MathUtils,
	Mesh,
	Object3D,
	Vector2,
	type Material,
	type Texture,
} from "three";

const strippedGltfUrls = new Set<string>();

function disposeMaterialTextures(material: Material) {
	for (const key of Object.keys(material)) {
		const value = (material as unknown as Record<string, unknown>)[key];
		if (
			value &&
			typeof value === "object" &&
			(value as Texture).isTexture === true
		) {
			(value as Texture).dispose();
		}
	}
	material.dispose();
}

function disposeGltfSceneMaterials(root: Object3D) {
	root.traverse(child => {
		if (!(child instanceof Mesh) || !child.material) return;
		const materials = Array.isArray(child.material)
			? child.material
			: [child.material];
		for (const mat of materials) {
			disposeMaterialTextures(mat);
		}
	});
}

export function disposeLoadedGltfTextures(url: string, root: Object3D) {
	if (strippedGltfUrls.has(url)) return;
	strippedGltfUrls.add(url);
	disposeGltfSceneMaterials(root);
}

const MIN = new Vector2(-1, -1);
const MAX = new Vector2(1, 1);

export const useMouseControls = (degX = 0.075, degY = 0.05) => {
	const targetPos = useRef(new Vector2(0, 0));

	useEffect(() => {
		const updateTarget = (e: PointerEvent) => {
			let x = (e.clientX / window.innerWidth) * -2 + 1;
			let y = (e.clientY / window.innerHeight) * -2 + 1;

			if (window.innerWidth < window.innerHeight)
				x *= window.innerWidth / window.innerHeight;
			else y *= window.innerHeight / window.innerWidth;
			targetPos.current.set(x, y);
			targetPos.current.clamp(MIN, MAX);
		};

		window.addEventListener("pointermove", updateTarget);

		return () => window.removeEventListener("pointermove", updateTarget);
	}, [targetPos]);

	useFrame(({ camera }, delta) => {
		camera.rotation.x = MathUtils.damp(
			camera.rotation.x,
			targetPos.current.y * Math.PI * degY,
			6,
			delta,
		);
		camera.rotation.y = MathUtils.damp(
			camera.rotation.y,
			targetPos.current.x * Math.PI * degX,
			2,
			delta,
		);
	});
};
