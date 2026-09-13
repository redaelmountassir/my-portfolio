import { BakeShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { animate } from "motion/react";
import { Suspense, useEffect, useRef } from "react";
import { Colors } from "../utils";
import CameraRig from "./3D/CameraRig";
import Desk from "./3D/Desk";

const CAM_POSITIONS = {
	x: [0, 0.5, 0.5, -0.35],
	y: [0, 0.5, 0.5, 0.57],
	z: [0, -2, -2, -5],
};
const CAM_ROTATIONS = {
	y: [0, 0.4, 0.4, 0.4],
};
const CAM_TRANSITION = {
	delay: 5,
	duration: 5,
	ease: "anticipate" as const,
	times: [0, 0.2, 0.7, 1],
};
const BRIGHTENING_DELAY = 9.5;

const Intro = ({ onComplete }: { onComplete: () => void }) => {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const wrapper = wrapperRef.current;
		if (!canvas || !wrapper) return;

		const fadeOut =
			CAM_TRANSITION.delay + CAM_TRANSITION.duration - BRIGHTENING_DELAY;

		// Stay black while assets load; only go white for the exit washout
		const bg = animate(
			wrapper,
			{ backgroundColor: Colors.WhitePrimary },
			{
				delay: BRIGHTENING_DELAY,
				duration: fadeOut,
				ease: "linear",
			},
		);
		const fade = animate(
			canvas as HTMLElement,
			{ opacity: 0 },
			{
				delay: BRIGHTENING_DELAY,
				duration: fadeOut,
				ease: CAM_TRANSITION.ease,
			},
		);

		return () => {
			bg.stop();
			fade.stop();
		};
	}, []);

	return (
		<div ref={wrapperRef} className="fixed inset-0">
			<Canvas
				ref={canvasRef}
				dpr={window.devicePixelRatio}
				shadows
				gl={{
					alpha: false,
				}}
				onCreated={({ gl }) => {
					gl.setClearColor("#000000");
				}}
			>
				<Suspense fallback={null}>
					<Desk
						position={[0, -1.5, 0]}
						scale={8}
						rotation-y={Math.PI / 6}
						brighteningDelay={BRIGHTENING_DELAY}
						flickeringDelay={4.5}
					/>
					<BakeShadows />
					<CameraRig
						onComplete={onComplete}
						positions={CAM_POSITIONS}
						rotations={CAM_ROTATIONS}
						transition={CAM_TRANSITION}
					/>
				</Suspense>
				<ambientLight intensity={0.7 * Math.PI} color={Colors.WhitePrimary} />
				<spotLight
					position={[0, 2, 0]}
					color={Colors.PinkAccent}
					intensity={4 * Math.PI}
					angle={Math.PI / 2}
					penumbra={0.8}
					castShadow
					shadow-mapSize-height={512}
					shadow-mapSize-width={512}
				/>
				<fog
					attach="fog"
					color="black"
					near={5}
					far={15}
					args={["black", 5, 15] /* Freaks out if I don't god knows y */}
				/>
			</Canvas>
		</div>
	);
};

export default Intro;
