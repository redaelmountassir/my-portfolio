import React, { useContext, useRef } from "react";
import {
	easeIn,
	motion,
	useAnimationFrame,
	useMotionValue,
} from "framer-motion";
import Float from "./Float";
import { StaticImage } from "gatsby-plugin-image";
import { easeSteps } from "../utils";
import { lerp } from "three/src/math/MathUtils";
import triangleImg from "../images/triangle_outline_blue.png";
import gridImg from "../images/floor_grid.png";
import { MobileContext } from "./OS";

const FRAMES = 46;
const FRAME_WIDTH = 256;
const ANIMATION_TIME = 2;
const NameCard = () => {
	const isMobile = useContext(MobileContext);
	const pos = useRef(0);
	const lastRot = useRef(0);
	const rotateY = useMotionValue(0);
	const rotate = useMotionValue(0);
	const containerRef = useRef<HTMLDivElement>(null);

	useAnimationFrame((_, delta) => {
		if (isMobile) return;
		lastRot.current = rotateY.get();
		let newY = lerp(lastRot.current, pos.current * 45, delta * 0.01);
		if (Math.abs(newY) < 0.001) newY = 0;
		if (lastRot.current !== newY) rotateY.set(newY);

		const oldRot = rotate.get();
		const deltaX = rotateY.get() - lastRot.current;
		let newRot = lerp(oldRot, deltaX * 1, delta * 0.005);
		if (Math.abs(newRot) < 0.001) newRot = 0;
		if (oldRot !== newRot) rotate.set(newRot);
	});

	return (
		<div
			ref={containerRef}
			className="relative h-full w-full overflow-hidden"
			onPointerMove={(e) => {
				if (!containerRef.current || isMobile) return;
				const bounds = containerRef.current.getBoundingClientRect();
				pos.current = ((e.clientX - bounds.x) / bounds.width) * 2 - 1;
			}}
			onPointerLeave={() => (pos.current = 0)}
		>
			<img
				src={gridImg}
				alt="Background graphic"
				className="absolute bottom-0 left-1/2 w-[700px] max-w-none -translate-x-1/2"
			/>
			<motion.div
				className="preserve-3D h-full"
				style={{
					perspectiveOrigin: "bottom",
					perspective: "300px",
					WebkitPerspectiveOrigin: "bottom",
					WebkitPerspective: "300px",
					MozPerspectiveOrigin: "bottom",
					MozPerspective: "300px",
					rotateY,
					rotate,
				}}
			>
				<motion.div
					initial={{ rotate: -90, y: -500, x: "-50%", opacity: 0 }}
					animate={{ rotate: 90, y: 0, opacity: 1 }}
					transition={{ delay: 2, duration: 2, type: "tween", ease: "circOut" }}
					className="pointer-events-none absolute bottom-40 left-1/2 md:bottom-14"
				>
					<Float>
						<motion.img
							src={triangleImg}
							alt="Background graphic"
							className="h-[500px] max-w-none pb-14 md:h-[620px]"
						/>
					</Float>
				</motion.div>
				<motion.div
					initial={{ rotate: -180, y: "500%", z: 30, opacity: 0 }}
					animate={{ rotate: 0, y: "50%", z: 30, opacity: 1 }}
					transition={{
						delay: 2.5,
						duration: 2,
						type: "tween",
						ease: "circOut",
					}}
					className="pointer-events-none absolute bottom-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
				>
					<Float>
						<StaticImage
							src="../images/my_photo.png"
							alt="Me on a horse"
							height={400}
							placeholder="none"
							loading="eager"
						/>
					</Float>
				</motion.div>
				<Float className="absolute h-full w-full">
					{[0, 1, 2, 3].map((val) => (
						<motion.div
							key={val}
							className="absolute bottom-10 left-1/2 w-64 origin-bottom overflow-hidden"
							initial={{ y: "50%", x: "-50%", scale: 0, opacity: 0, z: 80 }}
							animate={{ y: 0, scale: 1, opacity: 1 - val * 0.3, z: 80 }}
							transition={{
								type: "tween",
								ease: (val) => easeSteps(10)(easeIn(val)),
								duration: 1,
								delay: 0.5 + val * 0.1,
							}}
						>
							<motion.div
								animate={{ x: -FRAMES * FRAME_WIDTH }}
								transition={{
									duration: ANIMATION_TIME,
									ease: easeSteps(FRAMES),
									delay: 2,
								}}
							>
								<StaticImage
									src="../images/logo/logo_xl_animated.png"
									alt="Animated logo"
									layout="fixed"
									height={128}
									placeholder="none"
									className="transition-transform delay-1000"
									loading="eager"
									imgClassName="!transition-none" //Loads in slowly and looks out of place
									style={{
										transitionTimingFunction: `steps(${FRAMES})`,
										transitionDuration: `${ANIMATION_TIME}s`,
									}}
								/>
							</motion.div>
						</motion.div>
					))}
				</Float>
			</motion.div>
		</div>
	);
};

export default NameCard;
