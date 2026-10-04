import {
	easeIn,
	motion,
	useAnimationFrame,
	useMotionValue,
	useReducedMotion,
} from "motion/react";
import { useContext, useRef } from "react";
import { lerp } from "three/src/math/MathUtils.js";
import gridImg from "../../../assets/images/floor_grid.png";
import logoXLAnimatedImg from "../../../assets/images/logo/logo_xl_animated.png";
import myPhotoImg from "../../../assets/images/my_photo.png";
import triangleImg from "../../../assets/images/triangle_outline_blue.png";
import { MobileContext } from "../../../store/MobileContext";
import Float from "../../Float";
import SmartImage from "../../SmartImage";

const FRAMES = 46;
const FRAME_WIDTH = 256;
const ANIMATION_TIME = 2;
const easeSteps = (count: number) => (progress: number) =>
	Math.floor(progress * count) / count;

const NameCard = () => {
	const isMobile = useContext(MobileContext);
	const reducedMotion = useReducedMotion();
	const pos = useRef(0);
	const lastRot = useRef(0);
	const rotateY = useMotionValue(0);
	const rotate = useMotionValue(0);
	const containerRef = useRef<HTMLDivElement>(null);

	useAnimationFrame((_, delta) => {
		if (isMobile || reducedMotion) return;
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
			className="relative h-200 w-full overflow-hidden"
			onPointerMove={e => {
				if (!containerRef.current || isMobile) return;
				const bounds = containerRef.current.getBoundingClientRect();
				pos.current = ((e.clientX - bounds.x) / bounds.width) * 2 - 1;
			}}
			onPointerLeave={() => (pos.current = 0)}
		>
			<SmartImage
				src={gridImg}
				alt=""
				className="absolute bottom-0 left-1/2 w-175 max-w-none -translate-x-1/2"
			/>
			<motion.div
				className="h-full preserve-3D perspective-near perspective-origin-bottom"
				style={{
					rotateY,
					rotate,
				}}
			>
				<motion.div
					initial={{ rotate: -90, y: -500, x: "-50%", opacity: 0 }}
					animate={{ rotate: 90, y: 0, opacity: 1 }}
					transition={{
						delay: 2,
						duration: 2,
						type: "tween",
						ease: "circOut",
					}}
					className="pointer-events-none absolute bottom-40 left-1/2 md:bottom-14"
				>
					<Float>
						<SmartImage
							src={triangleImg}
							alt=""
							className="h-125 max-w-none pb-14 md:h-155"
						/>
					</Float>
				</motion.div>
				<motion.div
					initial={{ rotate: -180, y: "500%", z: 30, opacity: 0 }}
					animate={{ rotate: 0, y: "0%", z: 30, opacity: 1 }}
					transition={{
						delay: 2.5,
						duration: 2,
						type: "tween",
						ease: "circOut",
					}}
					className="pointer-events-none absolute bottom-2/5 left-1/2 -translate-x-1/2 translate-y-1/2"
				>
					<Float>
						<SmartImage
							src={myPhotoImg}
							alt="Me on a horse"
							className="h-125 max-w-none"
							loading="eager"
						/>
					</Float>
				</motion.div>
				<Float className="absolute size-full">
					{Array.from({ length: 4 }, (_, i) => (
						<motion.div
							key={i}
							className="absolute bottom-10 left-1/2 w-64 origin-bottom overflow-hidden"
							initial={{
								y: "50%",
								x: "-50%",
								scale: 0,
								opacity: 0,
								z: 80,
							}}
							animate={{
								y: 0,
								scale: 1,
								opacity: 1 - i * 0.3,
								z: 80,
							}}
							transition={{
								type: "tween",
								ease: progress =>
									easeSteps(10)(easeIn(progress)),
								duration: 1,
								delay: 0.5 + i * 0.1,
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
								<SmartImage
									src={logoXLAnimatedImg}
									alt=""
									className="h-32 max-w-none"
									loading="eager"
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
