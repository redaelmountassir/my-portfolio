import { motion } from "motion/react";
import React, { useMemo } from "react";
import bg1Img from "../assets/images/background_1.jpg";
import bg2Img from "../assets/images/background_2.jpg";
import palmImg from "../assets/images/palm.png";
import pixelatedHeadGif from "../assets/images/pixelated_head.gif";
import triangleImg from "../assets/images/triangle_outline_blue.png";
import { useSettingsStore } from "../store";
import SmartImage from "./SmartImage";

const Background3D = React.lazy(() => import("./Background3D"));

const PALM_PATH =
	"polygon(42% 100%, 38% 70%, 48% 37%, 63% 54%, 72% 46%, 80% 43%, 66% 30%, 95% 30%, 96% 25%, 87% 23%, 73% 16%, 94% 18%, 84% 4%, 60% 5%, 42% 0%, 34% 1%, 36% 9%, 21% 7%, 5% 13%, 14% 19%, 2% 25%, 4% 31%, 17% 31%, 23% 34%, 24% 44%, 31% 46%, 35% 52%, 27% 69%, 22% 100%)";
const Background = () => {
	const use3D = useSettingsStore(state => state.use3D);
	const odds = useMemo(Math.random, []);

	return (
		<>
			{odds < 0.001 ? (
				<SmartImage
					src={bg1Img}
					alt="background image of sky"
					className="pointer-events-none object-cover absolute h-full w-full"
					draggable={false}
				/>
			) : (
				<SmartImage
					src={bg2Img}
					alt="background image of sky"
					className="pointer-events-none object-cover absolute h-full w-full"
					draggable={false}
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
						animate={{ x: -95 }}
						transition={{
							repeat: Infinity,
							duration: 2,
							ease: "linear",
						}}
						className="absolute bottom-0 left-0 box-content h-36 w-full bg-[url('/bg_imgs/tile.png')] bg-contain pl-24"
					/>
					<img
						src={triangleImg.src}
						alt=""
						draggable={false}
						className="absolute left-1/2 top-1/2 w-96 -translate-x-1/2 translate-y-[-62%] drop-shadow-[0_0_35px_#b1d7ef] filter"
					/>
					<SmartImage
						src={palmImg}
						alt=""
						width={384}
						draggable={false}
						style={{ clipPath: PALM_PATH }}
						className="absolute -bottom-10 -left-32 origin-[35%_bottom] rotate-6 transition-transform duration-1000 ease-in-out hover:rotate-12 md:-left-5"
					/>
					<img
						src={pixelatedHeadGif}
						alt=""
						draggable={false}
						className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 "
					/>
					<SmartImage
						src={palmImg}
						alt=""
						width={384}
						draggable={false}
						style={{ clipPath: PALM_PATH }}
						className="invisible absolute -bottom-24 -right-10 origin-[35%_bottom] -rotate-12 scale-75 -scale-x-100 transition-transform duration-1000 ease-in-out hover:-rotate-6 md:visible"
					/>
					<SmartImage
						src={palmImg}
						alt=""
						width={384}
						draggable={false}
						style={{ clipPath: PALM_PATH }}
						className="absolute -bottom-10 -right-36 origin-[35%_bottom] rotate-12 -scale-x-100 transition-transform duration-1000 ease-in-out hover:rotate-6"
					/>
				</>
			)}
		</>
	);
};

export default Background;
