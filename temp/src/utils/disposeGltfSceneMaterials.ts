import type { Object3D } from "three";
import { Mesh, type Material, type Texture } from "three";

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
	root.traverse((child) => {
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
