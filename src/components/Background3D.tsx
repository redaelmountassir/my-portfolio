import { Canvas } from "@react-three/fiber";
import React, { Suspense, useContext } from "react";
import { Colors } from "../utils";
import { PerspectiveCamera } from "@react-three/drei";
import { Symbols } from "./Symbols";
import Plane from "./Plane";
import Sky from "./Sky";
import Effects from "./Effects";
import MouseControls from "./MouseControls";
import {
	Color,
	DoubleSide,
	LinearToneMapping,
	WebGLRenderer,
} from "three";
import { useBoundStore, useMobileStore } from "../store";
import { MobileContext } from "./OS";
import { Throbber } from "./Throbber";

const SEED = Math.round((Math.random() * 2 - 1) * 1000);
const TRIANGLE_COLOR = new Color(Colors.blueAccent).multiplyScalar(20);

function createBackgroundGl(
	canvas: HTMLCanvasElement | OffscreenCanvas,
): WebGLRenderer {
	if (!("getContext" in canvas) || typeof canvas.getContext !== "function") {
		const renderer = new WebGLRenderer({ canvas: canvas as never });
		renderer.toneMapping = LinearToneMapping;
		renderer.toneMappingExposure = 2.0;
		return renderer;
	}
	const ctx = canvas.getContext("webgl2", {
		alpha: false,
		depth: false,
		stencil: false,
		antialias: true,
		premultipliedAlpha: true,
		preserveDrawingBuffer: false,
		powerPreference: "high-performance",
		failIfMajorPerformanceCaveat: false,
	});
	if (!ctx) {
		const renderer = new WebGLRenderer({ canvas: canvas as HTMLCanvasElement });
		renderer.toneMapping = LinearToneMapping;
		renderer.toneMappingExposure = 2.0;
		return renderer;
	}
	const renderer = new WebGLRenderer({
		canvas: canvas as HTMLCanvasElement,
		context: ctx,
		alpha: false,
		depth: false,
		stencil: false,
		antialias: false,
		premultipliedAlpha: true,
		preserveDrawingBuffer: false,
		powerPreference: "high-performance",
		failIfMajorPerformanceCaveat: false,
	});
	renderer.toneMapping = LinearToneMapping;
	renderer.toneMappingExposure = 2.0;
	return renderer;
}
const Background3D: React.FC = () => {
	const isMobile = useContext(MobileContext);
	const windowCovering =
		useMobileStore(
			(state) => state.windowOpen !== undefined || state.menuOpen,
		) && isMobile;
	const windowMaximized =
		useBoundStore((state) => state.windowMaximized) && !isMobile;

	return (
		<Canvas
			dpr={0.3}
			fallback={
				<p className="absolute top-1/2 w-full -translate-y-1/2 px-10 text-center text-white-primary">
					3D is not supported on this browser. Check the visuals panel to
					disable it.
				</p>
			}
			frameloop={windowCovering || windowMaximized ? "demand" : "always"}
			gl={createBackgroundGl}
		>
			<directionalLight
				position={[0, 50, 50]}
				color={Colors.whitePrimary}
				intensity={2.5}
			/>
			<ambientLight color="grey" intensity={0.7} />
			<PerspectiveCamera fov={50} position={[0, 0, 6]} near={1} makeDefault />
			<MouseControls />
			<Effects />
			<Sky seed={SEED} />
			<Plane seed={SEED} />
			<Suspense fallback={<Throbber />}>
				<Symbols />
			</Suspense>
			<mesh position={[0, -0.2, 0.2]} rotation={[0.2, 0.2, 0]}>
				<ringGeometry args={[3, 3.25, 3]} />
				<meshBasicMaterial color={TRIANGLE_COLOR} side={DoubleSide} />
			</mesh>
		</Canvas>
	);
};

export default Background3D;
