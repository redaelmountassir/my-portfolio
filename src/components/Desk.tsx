import React, { useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { Colors } from "../utils";
import { useFrame } from "@react-three/fiber";
import { motion } from "framer-motion-3d";
import introImg from "../images/intro.jpg";
import { Mesh, MeshPhongMaterial, MeshStandardMaterial, NearestFilter, RectAreaLight, SRGBColorSpace, Texture } from "three";

type GLTFResult = GLTF & {
  nodes: {
    plant: Mesh;
    vase: Mesh;
    headphones: Mesh;
    macintosh: Mesh;
    screen: Mesh;
  };
};

const mat = new MeshStandardMaterial({
  color: Colors.blackPrimary,
});
export function Desk(props: JSX.IntrinsicElements["group"]) {
  const { nodes } = useGLTF("/models/desk.glb") as unknown as GLTFResult;
  const light = useRef<RectAreaLight>(null);
  const screen = useRef<MeshPhongMaterial>(null);
  const screenTex = useTexture(introImg) as Texture;
  screenTex.minFilter = NearestFilter;
  screenTex.colorSpace = SRGBColorSpace;

  useFrame((state) => {
    if (!light.current || !screen.current) return;
    light.current.color = screen.current.color;
    screen.current.emissive = screen.current.color;
    const emission = Math.random();
    const addedBrightness = Math.max(0, state.clock.elapsedTime - 9.75) * 2;
    screen.current.emissiveIntensity = emission * 0.05 + 0.1 + addedBrightness;
    light.current.intensity = emission * 100 + 100;
  });

  return (
    <group {...props} dispose={null}>
      <rectAreaLight
        position={[0.18, 0.26, 0.155]}
        width={1.9}
        height={1.25}
        rotation={[-0.1, -0.16 + Math.PI, 0]}
        ref={light}
      />
      <mesh receiveShadow position={[0, 0.02, 0]} rotation-x={Math.PI * -0.5}>
        <meshLambertMaterial color={Colors.blackPrimary} />
        <planeGeometry args={[100, 100, 1, 1]} />
      </mesh>
      <group position={[-0.179, 0.02, 0.01]}>
        <mesh geometry={nodes.plant.geometry} castShadow>
          <meshPhongMaterial color={Colors.blackPrimary} />
        </mesh>
        <mesh geometry={nodes.vase.geometry} material={mat} castShadow />
      </group>
      <mesh
        geometry={nodes.headphones.geometry}
        material={mat}
        position={[0.01, 0.121, 0.196]}
        rotation={[-0.528, -0.515, -0.496]}
        castShadow
      />
      <mesh
        geometry={nodes.macintosh.geometry}
        material={mat}
        position={[0.209, 0.019, 0.046]}
        rotation={[0, -0.15, 0]}
        scale={0.097}
        castShadow
      >
        <mesh
          geometry={nodes.screen.geometry}
          position={[-0.034, 2.471, 1.097]}
        >
          <motion.meshPhongMaterial
            shininess={100}
            color="black"
            map={screenTex}
            ref={screen}
            animate={{ color: "#a590ad" }}
            transition={{
              delay: 4.5,
              type: "spring",
              bounce: 1,
              duration: 3,
            }}
          />
        </mesh>
      </mesh>
    </group>
  );
}
