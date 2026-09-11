import { Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Color, type MeshBasicMaterial } from "three";
import { circOut, Colors } from "../../utils";

const DOTS = 10;
const RADIUS = 0.75;
const CYCLE = 1.5;
const DURATION = ((DOTS - 1) / DOTS) * CYCLE;
const FROM = new Color(Colors.WhitePrimary);
const TO = new Color(Colors.BlackPrimary);

const Throbber = () => {
	const materials = useRef<(MeshBasicMaterial | null)[]>([]);

	useFrame(({ clock }) => {
		const time = clock.elapsedTime;
		for (let i = 0; i < DOTS; i++) {
			const mat = materials.current[i];
			if (!mat) continue;
			const t = ((time + (i / DOTS) * CYCLE) / DURATION) % 1;
			mat.color.lerpColors(FROM, TO, circOut(t));
		}
	});

	return (
		<group>
			{Array.from({ length: DOTS }, (_, i) => {
				const phase = i / DOTS;
				return (
					<Sphere
						key={i}
						args={[0.15]}
						position={[
							Math.sin(phase * 2 * Math.PI) * RADIUS,
							Math.cos(phase * 2 * Math.PI) * RADIUS,
							0,
						]}
					>
						<meshBasicMaterial
							color={Colors.WhitePrimary}
							ref={el => {
								materials.current[i] = el;
							}}
						/>
					</Sphere>
				);
			})}
		</group>
	);
};

export default Throbber;
