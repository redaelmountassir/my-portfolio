import * as React from 'react';
import {
	Bloom,
	ChromaticAberration,
	EffectComposer,
	Noise,
} from '@react-three/postprocessing';

const Effects: React.FC = () => {
	return (
		<EffectComposer multisampling={0}>
			<Bloom
				intensity={0.2}
				luminanceThreshold={0.2}
				width={512}
				height={512}
			/>
			<Noise opacity={0.02} />
			<ChromaticAberration
				radialModulation={false}
				modulationOffset={0}
			/>
		</EffectComposer>
	);
};

export default Effects;