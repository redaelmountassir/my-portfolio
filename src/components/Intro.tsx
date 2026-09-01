import { BakeShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Colors } from "../utils";
import CameraRig from "./3D/CameraRig";
import Desk from "./3D/Desk";

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
