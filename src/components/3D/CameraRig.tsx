import { PerspectiveCamera } from "@react-three/drei";
import { animate, type AnimationOptions } from "motion/react";
import { useLayoutEffect, useRef } from "react";
import { Group } from "three";
import { useMouseControls } from "../../utils/3D";

interface CameraRigProps {
	positions: { x?: number[]; y?: number[]; z?: number[] };
	rotations: { x?: number[]; y?: number[]; z?: number[] };
	transition: AnimationOptions;
	onComplete: () => void;
}

const CameraRig = ({
	onComplete,
	positions,
	rotations,
	transition,
}: CameraRigProps) => {
	useMouseControls();
	const group = useRef<Group>(null);
	const onCompleteRef = useRef(onComplete);
	onCompleteRef.current = onComplete;

	useLayoutEffect(() => {
		const rig = group.current;
		if (!rig) return;

		const position = animate(
			rig.position,
			{
				...positions,
			},
			{
				...transition,
				onComplete: () => onCompleteRef.current(),
			},
		);
		const rotation = animate(rig.rotation, { ...rotations }, transition);

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
