import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef } from "react";
import glassImg from "../assets/images/glass.png";
import SmartImage from "./SmartImage";

const Follow = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const opacity = useSpring(0);

	return (
		<div
			className="absolute top-0 left-0 z-1 size-full"
			ref={containerRef}
			onPointerMove={e => {
				if (!containerRef.current) return;
				opacity.set(1);
				const bounds = containerRef.current.getBoundingClientRect();
				x.set(e.clientX - bounds.left);
				y.set(e.clientY - bounds.top);
			}}
			onPointerLeave={() => opacity.set(0)}
		>
			<motion.div
				style={{ x, y, opacity }}
				className="pointer-events-none select-none"
			>
				<SmartImage
					alt=""
					src={glassImg}
					className="pointer-events-none z-1 size-20 -translate-x-1/2 -translate-y-1/2"
				/>
			</motion.div>
		</div>
	);
};

export default Follow;
