import { Float, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, {
	startTransition,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { Mesh } from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { createGlitchMat } from "../../assets/shaders/glitchMat";
import { useBoundStore } from "../../store";
import type { Window } from "../../store/types";
import { randRange } from "../../utils";
import { disposeLoadedGltfTextures } from "../../utils/3D";

type GLTFResult = GLTF & {
	nodes: {
		bust: Mesh;
		phone: Mesh;
		computer: Mesh;
		logo: Mesh;
		pen: Mesh;
	};
};

function checkVisibility(window: Window | undefined): string {
	if (!window) return "logo";
	switch (window.type) {
		case "Contact":
			return "phone";
		case "PDFReader":
		case "TextEditor":
			return "pen";
		case "MediaViewer":
			return "bust";
		case "Console":
		case "FileExplorer":
		case "Virus":
			return "computer";
		default:
			return "logo";
	}
}

const symbolMat = createGlitchMat();
useGLTF.preload("/models/symbols.glb");

const Symbols = (props: React.JSX.IntrinsicElements["group"]) => {
	const gltf = useGLTF("/models/symbols.glb") as unknown as GLTFResult;
	const { nodes } = gltf;
	useLayoutEffect(() => {
		disposeLoadedGltfTextures("/models/symbols.glb", gltf.scene);
	}, [gltf.scene]);

	const data = useRef<{ timeout: number; glitching: boolean }>({
		timeout: -1,
		glitching: false,
	});

	// Create glitchy material
	useFrame(state => {
		if (!symbolMat.userData.shader || !symbolMat.userData.shader.uniforms)
			return;

		if (!data.current.glitching) {
			if (symbolMat.userData.shader.uniforms.glitching.value)
				symbolMat.userData.shader.uniforms.glitching.value = 0;
			return;
		}

		symbolMat.userData.shader.uniforms.time.value =
			state.clock.getElapsedTime();
		if (!symbolMat.userData.shader.uniforms.glitching.value)
			symbolMat.userData.shader.uniforms.glitching.value = 1;
	});

	// Tie symbols to current window
	const [currentNode, setCurrentNode] = useState<string>(
		checkVisibility(undefined),
	);
	const currentWindow = useBoundStore(
		({ windows }) => windows[windows.length - 1],
	);
	useEffect(() => {
		const shouldBeVisible = checkVisibility(currentWindow);
		// If symbol is returned to the current one
		if (currentNode === shouldBeVisible) {
			if (data.current.timeout !== -1) {
				clearTimeout(data.current.timeout);
				data.current.timeout = setTimeout(
					() => {
						data.current.glitching = false;
						data.current.timeout = -1;
					},
					randRange(500, 1000),
				);
			}
			return;
		}

		// New symbol! Start animating.
		data.current.glitching = true;
		// If existing switch exists, extend animation and change the change
		if (data.current.timeout !== -1) clearTimeout(data.current.timeout);
		data.current.timeout = setTimeout(
			() => {
				data.current.glitching = false;
				data.current.timeout = -1;
				startTransition(() => setCurrentNode(shouldBeVisible));
			},
			randRange(500, 1250),
		);
	}, [currentWindow]);

	return (
		<Float rotationIntensity={2}>
			<group {...props} dispose={null}>
				{Object.keys(nodes).map(node =>
					//@ts-ignore
					nodes[node].geometry == undefined ? null : (
						<mesh
							//@ts-ignore
							geometry={nodes[node].geometry}
							key={node}
							visible={currentNode === node}
							material={symbolMat}
						/>
					),
				)}
			</group>
		</Float>
	);
};

export default Symbols;
