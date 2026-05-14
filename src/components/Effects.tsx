import React from "react";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
} from "@react-three/postprocessing";
import { AdditiveBlending } from "three";

const Effects: React.FC = () => {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={.85}
        luminanceThreshold={0.2}
        resolutionX={512}
        resolutionY={512}
        mipmapBlur
        radius={0.5}
        blendFunction={AdditiveBlending}
      />
      <ChromaticAberration radialModulation={false} modulationOffset={0} />
    </EffectComposer>
  );
};

export default Effects;
