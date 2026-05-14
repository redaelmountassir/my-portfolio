import { useFrame, useThree } from "@react-three/fiber";
import React from "react";
import fragmentShader from "../shaders/grid.frag";
import vertexShader from "../shaders/grid.vert";
import { Colors } from "../utils";
import { Color, ShaderMaterial } from "three";
import { useContext, useMemo, useRef } from "react";
import { MobileContext } from "./OS";

interface PlaneProps {
  seed: number;
}

const DIVISIONS = 25;
const COLOR = new Color(Colors.blackPrimary);
const LINE_COLOR = new Color(Colors.blueAccent).multiplyScalar(25);
const LIGHT_COLOR = new Color(Colors.pinkAccent).multiplyScalar(10);
const Plane: React.FC<PlaneProps> = ({ seed }) => {
  const { camera } = useThree();
  const isMobile = useContext(MobileContext);

  const mat = useRef<ShaderMaterial>(null);
  useFrame((state) => {
    if (!mat.current) return;
    const { clock } = state;
    mat.current.uniforms.time.value = clock.getElapsedTime();
  });

  const uniforms = useMemo(
    () => ({
      gridDepth: { value: camera.far },
      gridSquare: { value: camera.far / DIVISIONS },
      color: { value: COLOR },
      lineColor: { value: LINE_COLOR },
      lightColor: { value: LIGHT_COLOR },
      seed: { value: seed },
      time: { value: 0 },
    }),
    [camera],
  );

  return (
    <mesh
      rotation-x={Math.PI * -0.5}
      position={[0, -100, camera.far / -2 + 200]}
      scale={isMobile ? [0.3, 1, 0.3] : 1}
    >
      <planeGeometry
        args={[camera.far * 2, camera.far, DIVISIONS * 2, DIVISIONS]}
      />
      <shaderMaterial
        ref={mat}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
};

export default Plane;
