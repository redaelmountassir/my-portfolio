import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from "motion/react";
import React from "react";
import { SimplexNoise } from "three/addons/math/SimplexNoise.js";

interface FloatProps {
	strength?: number;
	speed?: number;
	children: React.ReactNode;
	className?: string;
}

const Float = ({
	strength = 7,
	speed = 0.0002,
	children,
	className,
}: FloatProps) => {
	const noiseX = new SimplexNoise();
	const noiseY = new SimplexNoise();
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const reducedMotion = useReducedMotion();

	useAnimationFrame(time => {
		if (reducedMotion) return;
		time *= speed;
		let xNoise =
			(noiseX.noise(time, 0) + noiseX.noise(time, 100) * 0.5) / 1.5;
		let yNoise =
			(noiseY.noise(time, 0) + noiseY.noise(time, 100) * 0.5) / 1.5;
		x.set(xNoise * strength);
		y.set(yNoise * strength);
	});

	return (
		<motion.div className={className} style={{ x, y }}>
			{children}
		</motion.div>
	);
};

export default Float;
