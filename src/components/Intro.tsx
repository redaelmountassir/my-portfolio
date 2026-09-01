import { Suspense, useLayoutEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { BakeShadows, PerspectiveCamera } from "@react-three/drei";
import { Group } from "three";
import { animate } from "motion";
import { Colors } from "../utils";
import MouseControls from "./MouseControls";
import Desk from "./Desk";

const CAMERA_TIMES = [0, 0.2, 0.7, 1];
const CAMERA_TRANSITION = {
	delay: 5,
	duration: 5,
	ease: "anticipate",
	times: CAMERA_TIMES,
} as const;

const CameraRig = ({ onFinish }: { onFinish: () => void }) => {
	const group = useRef<Group>(null);
	const onFinishRef = useRef(onFinish);
	onFinishRef.current = onFinish;

	useLayoutEffect(() => {
		const rig = group.current;
		if (!rig) return;

		const position = animate(
			rig.position,
			{
				x: [0, 0.5, 0.5, -0.35],
				y: [0, 0.5, 0.5, 0.57],
				z: [0, -2, -2, -5],
			},
			{
				...CAMERA_TRANSITION,
				onComplete: () => onFinishRef.current(),
			},
		);
		const rotation = animate(
			rig.rotation,
			{ y: [0, 0.4, 0.4, 0.4] },
			CAMERA_TRANSITION,
		);

		return () => {
			position.stop();
			rotation.stop();
		};
	}, []);

	return (
		<group ref={group}>
			<PerspectiveCamera
				fov={50}
				position={[0, 0, 6]}
				makeDefault
				near={0.1}
				far={20}
			/>
			<MouseControls />
		</group>
	);
};

const Intro = ({ onFinish }: { onFinish: () => void }) => {
	return (
		<Canvas
			dpr={window.devicePixelRatio}
			shadows
			gl={{
				alpha: false,
			}}
		>
			<Suspense fallback={null}>
				<Desk position={[0, -1.5, 0]} scale={8} rotation-y={Math.PI / 6} />
				<BakeShadows />
				<CameraRig onFinish={onFinish} />
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
	);
};

export default Intro;
