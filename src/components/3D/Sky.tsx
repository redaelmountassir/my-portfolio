import { useFrame, useThree } from "@react-three/fiber";
import { useContext, useEffect, useRef, useState } from "react";
import { BackSide, Color, ShaderMaterial, Vector3 } from "three";
import fragmentShader from "../../assets/shaders/sky.frag";
import vertexShader from "../../assets/shaders/sky.vert";
import { Colors } from "../../utils";
import { MobileContext } from "../OS";

interface SkyProps {
	seed: number;
}

const SUN_COLOR = new Color(Colors.PinkAccent).multiplyScalar(2);
const SUN_COLOR_2 = new Color(Colors.YellowAccent).multiplyScalar(0.8);
const SKY_COLOR = new Color(Colors.BlueAccent).multiplyScalar(0.6);
const NEBULA_COLOR = new Color(Colors.BlueAccent);
const GROUND_COLOR = new Color(Colors.BlackPrimary);

const Sky = ({ seed }: SkyProps) => {
	const { camera } = useThree();
	const isMobile = useContext(MobileContext);

	const mat = useRef<ShaderMaterial>(null);
	useFrame(state => {
		if (!mat.current) return;
		const { clock } = state;
		mat.current.uniforms.time.value = clock.getElapsedTime();
	});
	useEffect(() => {
		if (!mat.current) return;
		mat.current.uniforms.sunSize.value = isMobile ? 300 : 600;
	}, [isMobile]);

	const [uniforms] = useState(() => ({
		sunColor: { value: SUN_COLOR },
		sunColor2: { value: SUN_COLOR_2 },
		sunPos: {
			value: new Vector3().setFromSphericalCoords(
				camera.far,
				Math.PI * 0.5 - 0.2,
				Math.PI,
			),
		},
		groundColor: { value: GROUND_COLOR },
		skyColor: { value: SKY_COLOR },
		nebulaColor: { value: NEBULA_COLOR },
		sunSize: { value: isMobile ? 300 : 600 },
		seed: { value: seed ?? 0 },
		time: { value: 0 },
	}));

	return (
		<group position={camera.position}>
			<mesh frustumCulled={false}>
				<sphereGeometry args={[camera.far, 10, 10]} />
				<shaderMaterial
					ref={mat}
					vertexShader={vertexShader}
					fragmentShader={fragmentShader}
					uniforms={uniforms}
					side={BackSide}
				/>
			</mesh>
		</group>
	);
};

export default Sky;
