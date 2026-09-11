import { PerspectiveCamera } from "@react-three/drei";
import { animate } from "motion/react";
import { useLayoutEffect, useRef } from "react";
import { Group } from "three";
import { useMouseControls } from "../../utils/3D";

const CAMERA_TIMES = [0, 0.2, 0.7, 1];
const CAMERA_TRANSITION = {
	delay: 5,
	duration: 5,
	ease: "anticipate",
	times: CAMERA_TIMES,
} as const;

const CameraRig = ({ onFinish }: { onFinish: () => void }) => {
	useMouseControls();
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
		</group>
	);
};

export default CameraRig;
