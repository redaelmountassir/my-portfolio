import { Canvas } from "@react-three/fiber";
import React from "react";
import { Colors } from "../utils";
import { BakeShadows } from "@react-three/drei";
import { Desk } from "./Desk";
import { PerspectiveCamera } from "@react-three/drei";
import { motion } from "framer-motion-3d";
import MouseControls from "./MouseControls";

const Intro: React.FC<{ onFinish: Function }> = ({ onFinish }) => {
  return (
    <Canvas
      dpr={window.devicePixelRatio}
      shadows
      gl={{
        alpha: false,
      }}
    >
      <React.Suspense fallback={null}>
        <Desk position={[0, -1.5, 0]} scale={8} rotation-y={Math.PI / 6} />
        <BakeShadows />
        <motion.group
          //@ts-ignore
          animate={{
            x: [0, 0.5, null, null, -0.35],
            y: [0, 0.5, null, null, 0.57],
            z: [0, -2, null, null, -5],
            rotateY: [0, 0.4, null, null, null],
          }}
          transition={{
            delay: 5,
            type: "tween",
            duration: 5,
            ease: "anticipate",
            times: [0, 0.2, 0.2, 0.7, 1],
            onComplete: onFinish,
          }}
        >
          <PerspectiveCamera
            fov={50}
            position={[0, 0, 6]}
            makeDefault
            near={0.1}
            far={20}
          />
          <MouseControls />
        </motion.group>
      </React.Suspense>
      <ambientLight intensity={0.75} color={Colors.whitePrimary} />
      <spotLight
        position={[0, 2, 0]}
        color={Colors.pinkAccent}
        intensity={1}
        angle={10}
        penumbra={0.5}
        castShadow
        shadow-mapSize-height={512}
        shadow-mapSize-width={512}
      />
      <fog attach="fog" color="black" near={5} far={15} />
    </Canvas>
  );
};

export default Intro;
