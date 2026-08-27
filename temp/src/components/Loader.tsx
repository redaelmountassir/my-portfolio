import { motion, useAnimate } from "framer-motion";
import { StaticImage } from "gatsby-plugin-image";
import React, { useEffect, useRef, useState } from "react";
import GlitchWall from "./GlitchWall";

const FRAMES = 36;
const FRAME_WIDTH = 256;
const ANIMATION_TIME = 3;
const Loader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
				onUpdate: (latest) =>
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
		<>
			<motion.div
				animate={loaded ? "loaded" : "unloaded"}
				ref={scope}
				className="fixed z-50 flex h-full w-full flex-col items-center justify-center bg-black-primary"
			>
				<motion.div
					className="w-64 translate-x-12 overflow-hidden transition-transform delay-1000 duration-1000 ease-out"
					ref={logo}
					initial={{ filter: "drop-shadow(0px 0px 0px #f6019d)" }}
					animate={{ filter: "drop-shadow(0px 0px 16px #f6019d)" }}
					transition={{
						delay: 4,
						repeat: 10,
						repeatType: "mirror",
						ease: "linear",
						duration: 2,
					}}
				>
					<StaticImage
						src="../images/logo/logo_lg_animated.png"
						alt="Animated logo"
						layout="fixed"
						height={128}
						placeholder="none"
						className="transition-transform delay-1000"
						style={{
							transitionTimingFunction: `steps(${FRAMES})`,
							transitionDuration: `${ANIMATION_TIME}s`,
						}}
					/>
				</motion.div>
				<p className="text-light-primary">Definitely Loading...</p>
				<GlitchWall />
			</motion.div>
			{children}
		</>
	);
};

export default Loader;
