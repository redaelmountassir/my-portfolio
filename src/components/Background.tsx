import { motion, useReducedMotion } from "motion/react";
import React, { useState } from "react";
import bg1Img from "../assets/images/background_1.jpg";
import bg2Img from "../assets/images/background_2.jpg";
import palmImg from "../assets/images/palm.png";
import pixelatedHeadGif from "../assets/images/pixelated_head.gif";
import triangleImg from "../assets/images/triangle_outline_blue.png";
import { useSettingsStore } from "../store";
import { cn } from "../utils";
import SmartImage from "./SmartImage";

const Background3D = React.lazy(() => import("./Background3D"));

const PALM_CLIP =
	"[clip-path:polygon(42%_100%,38%_70%,48%_37%,63%_54%,72%_46%,80%_43%,66%_30%,95%_30%,96%_25%,87%_23%,73%_16%,94%_18%,84%_4%,60%_5%,42%_0%,34%_1%,36%_9%,21%_7%,5%_13%,14%_19%,2%_25%,4%_31%,17%_31%,23%_34%,24%_44%,31%_46%,35%_52%,27%_69%,22%_100%)]";
const Background = () => {
	const use3D = useSettingsStore(state => state.use3D);
	const [odds] = useState(Math.random);
	const reducedMotion = useReducedMotion();

	return (
		<div aria-hidden="true" className="absolute inset-0">
			{odds < 0.001 ? (
				<SmartImage
					src={bg1Img}
					alt=""
					className="pointer-events-none absolute size-full object-cover"
					draggable="false"
				/>
			) : (
				<SmartImage
					src={bg2Img}
					alt=""
					className="pointer-events-none absolute size-full object-cover"
					draggable="false"
				/>
			)}

			{use3D ? (
				<React.Suspense
					fallback={
						<p className="absolute top-1/2 w-full -translate-y-1/2 text-center text-white-primary">
							Loading...
						</p>
					}
				>
					<Background3D />
				</React.Suspense>
			) : (
				<>
					<motion.div
						initial={{ x: 0 }}
						animate={reducedMotion ? { x: 0 } : { x: -95 }}
						transition={
							reducedMotion
								? { duration: 0 }
								: {
										repeat: Infinity,
										duration: 2,
										ease: "linear",
									}
						}
						className="absolute bottom-0 left-0 box-content h-36 w-full bg-[url('/bg_imgs/tile.png')] bg-contain pl-24"
					/>
					<SmartImage
						src={triangleImg}
						alt=""
						draggable="false"
						className="absolute top-1/2 left-1/2 w-96 -translate-x-1/2 translate-y-[-62%] drop-shadow-[0_0_35px_#b1d7ef] filter"
					/>
					<SmartImage
						src={palmImg}
						alt=""
						draggable="false"
						className={cn(
							"absolute -bottom-10 -left-32 w-96 origin-[35%_bottom] rotate-6 transition-transform duration-1000 ease-in-out hover:rotate-12 motion-reduce:transition-none motion-reduce:hover:rotate-6 md:-left-5",
							PALM_CLIP,
						)}
					/>
					<img
						src={pixelatedHeadGif}
						alt=""
						draggable="false"
						className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
					/>
					<SmartImage
						src={palmImg}
						alt=""
						draggable="false"
						className={cn(
							"invisible absolute -right-10 -bottom-24 w-96 origin-[35%_bottom] scale-75 -scale-x-100 -rotate-12 transition-transform duration-1000 ease-in-out hover:-rotate-6 motion-reduce:transition-none motion-reduce:hover:-rotate-12 md:visible",
							PALM_CLIP,
						)}
					/>
					<SmartImage
						src={palmImg}
						alt=""
						draggable="false"
						className={cn(
							"absolute -right-36 -bottom-10 w-96 origin-[35%_bottom] -scale-x-100 rotate-12 transition-transform duration-1000 ease-in-out hover:rotate-6 motion-reduce:transition-none motion-reduce:hover:rotate-12",
							PALM_CLIP,
						)}
					/>
				</>
			)}
		</div>
	);
};

export default Background;
