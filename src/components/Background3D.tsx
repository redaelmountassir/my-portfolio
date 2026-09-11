import { Canvas, type RootState } from "@react-three/fiber";
import { Suspense, useContext } from "react";
import {
	Color,
	DoubleSide,
	LinearToneMapping,
	WebGLRenderer,
	type WebGLRendererParameters,
} from "three";
import { useBoundStore, useMobileStore } from "../store";
import { Colors } from "../utils";
import CameraEffects from "./3D/CameraEffects";
import Plane from "./3D/Plane";
import Sky from "./3D/Sky";
import Symbols from "./3D/Symbols";
import Throbber from "./3D/Throbber";
import { MobileContext } from "./OS";

const SEED = Math.round((Math.random() * 2 - 1) * 1000);
const TRIANGLE_COLOR = new Color(Colors.BlueAccent).multiplyScalar(20);

const GL_CONTEXT_ATTRIBUTES = {
	alpha: false,
	depth: false,
	stencil: false,
	antialias: true,
	premultipliedAlpha: true,
	preserveDrawingBuffer: false,
	powerPreference: "high-performance",
	failIfMajorPerformanceCaveat: false,
} as const satisfies WebGLContextAttributes &
	Pick<
		WebGLRendererParameters,
		| "alpha"
		| "depth"
		| "stencil"
		| "antialias"
		| "premultipliedAlpha"
		| "preserveDrawingBuffer"
		| "powerPreference"
		| "failIfMajorPerformanceCaveat"
	>;

const applyRendererProps = (gl: WebGLRenderer) => {
	gl.toneMapping = LinearToneMapping;
	gl.toneMappingExposure = 2;
};

const createRenderer = ({
	canvas,
	context,
	...defaultProps
}: WebGLRendererParameters) => {
	if (!canvas) {
		throw new Error("R3F did not provide a canvas for the WebGL renderer.");
	}

	const glContext =
		context ??
		(canvas as HTMLCanvasElement).getContext("webgl2", GL_CONTEXT_ATTRIBUTES);

	if (!(glContext instanceof WebGL2RenderingContext)) {
		throw new Error("WebGL2 is not available.");
	}

	const renderer = new WebGLRenderer({
		...defaultProps,
		...GL_CONTEXT_ATTRIBUTES,
		canvas,
		context: glContext,
	});
	applyRendererProps(renderer);
	return renderer;
};

const onCreated = ({ gl }: RootState) => {
	applyRendererProps(gl);
};

const Background3D = () => {
	const isMobile = useContext(MobileContext);
	const windowCovering =
		useMobileStore(state => state.windowOpen !== undefined || state.menuOpen) &&
		isMobile;
	const windowMaximized =
		useBoundStore(state => state.windowMaximized) && !isMobile;

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
			gl={createRenderer}
			onCreated={onCreated}
			camera={{ fov: 50, position: [0, 0, 6], near: 1, far: 2000 }}
		>
			<directionalLight
				position={[0, 50, 50]}
				color={Colors.WhitePrimary}
				intensity={2.5}
			/>
			<ambientLight color="grey" intensity={0.7} />
			<CameraEffects />
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
