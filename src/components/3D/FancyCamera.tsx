import { PerspectiveCamera } from "@react-three/drei";
import {
	Bloom,
	ChromaticAberration,
	EffectComposer,
} from "@react-three/postprocessing";
import { AdditiveBlending } from "three";
import { useMouseControls } from "../../utils/3D";

const FancyCamera = () => {
	useMouseControls(); // Has to be here inside camera

	return (
		<>
			<PerspectiveCamera fov={50} position={[0, 0, 6]} near={1} makeDefault />
			<EffectComposer multisampling={0}>
				<Bloom
					intensity={0.85}
					luminanceThreshold={0.2}
					resolutionX={512}
					resolutionY={512}
					radius={0.5}
					blendFunction={AdditiveBlending}
				/>
				<ChromaticAberration radialModulation={false} modulationOffset={0} />
			</EffectComposer>
		</>
	);
};

export default FancyCamera;
