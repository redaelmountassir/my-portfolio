import { Canvas } from "@react-three/fiber";
import { Suspense, useContext } from "react";
import { Color, DoubleSide, LinearToneMapping } from "three";
import { useBoundStore, useMobileStore } from "../store";
import { Colors } from "../utils";
import FancyCamera from "./3D/FancyCamera";
import Plane from "./3D/Plane";
import Sky from "./3D/Sky";
import Symbols from "./3D/Symbols";
import Throbber from "./3D/Throbber";
import { MobileContext } from "./OS";

const SEED = Math.round((Math.random() * 2 - 1) * 1000);
const TRIANGLE_COLOR = new Color(Colors.BlueAccent).multiplyScalar(20);

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
			gl={{
				alpha: false,
				depth: false,
				stencil: false,
				antialias: true,
				premultipliedAlpha: true,
				preserveDrawingBuffer: false,
				powerPreference: "high-performance",
				failIfMajorPerformanceCaveat: false,
				toneMapping: LinearToneMapping,
				toneMappingExposure: 2,
			}}
		>
			<directionalLight
				position={[0, 50, 50]}
				color={Colors.WhitePrimary}
				intensity={2.5}
			/>
			<ambientLight color="grey" intensity={0.7} />
			<FancyCamera />
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
