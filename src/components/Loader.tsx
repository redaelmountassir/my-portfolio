import { motion, useAnimate } from "motion/react";
import { useEffect, useRef, useState } from "react";
import logo_animated_img from "../assets/images/logo/logo_lg_animated.png";
import GlitchWall from "./GlitchWall";
import SmartImage from "./SmartImage";

const FRAMES = 36;
const FRAME_WIDTH = 256;
const ANIMATION_TIME = 3;

const Loader = () => {
	const [loaded, setLoaded] = useState(false);
	const logo = useRef<HTMLDivElement>(null);
	const [scope, animate] = useAnimate();

	useEffect(() => {
		const playAnim = async () => {
			if (!logo.current) return;

			// TODO: Maybe add an actual load sequence sometime in the future
			logo.current.classList.remove("translate-x-12");
			const logoImg = logo.current.firstElementChild as HTMLElement;
			logoImg.style.transform = `translateX(-${FRAMES * FRAME_WIDTH}px)`;

			await animate(0, 3.99, {
				repeat: 5,
				duration: 1,
				type: "tween",
				ease: "linear",
				onUpdate: latest =>
					(document.title = `Booting${".".repeat(Math.floor(latest))}`),
			});
			document.title = "RedaOS";

			animate(scope.current, {
				opacity: 0,
				transitionEnd: { visibility: "hidden" },
			});

			setLoaded(true);
		};

		playAnim();
	}, []);

	return (
		<motion.div
			animate={loaded ? "loaded" : "unloaded"}
			ref={scope}
			className="fixed z-50 flex size-full items-center justify-center bg-black-primary"
		>
			<div
				className="flex size-128 flex-col items-center justify-center bg-radial-[circle] from-black-primary from-[128px] to-transparent to-[256px]"
			>
				<motion.div
					className="w-64 translate-x-12 overflow-hidden transition-transform delay-1000 duration-1000 ease-out"
					ref={logo}
					initial={{ filter: "drop-shadow(0px 0px 0px #f6019d)" }}
					animate={{ filter: "drop-shadow(0px 0px 16px #f6019d)" }}
				>
					<SmartImage
						src={logo_animated_img}
						alt="Animated logo"
						className="h-32 max-w-none transition-transform delay-1000"
						style={{
							transitionTimingFunction: `steps(${FRAMES})`,
							transitionDuration: `${ANIMATION_TIME}s`,
						}}
					/>
				</motion.div>
				<p className="text-light-primary">Definitely Loading...</p>
			</div>
			<GlitchWall />
		</motion.div>
	);
};

export default Loader;
