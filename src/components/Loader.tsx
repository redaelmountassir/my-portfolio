import {
	animate,
	motion,
	steps,
	type HTMLMotionProps,
	type Variants,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import logo_animated_img from "../assets/images/logo/logo_lg_animated.png";
import { useSettingsStore } from "../store";
import { cn } from "../utils";
import GlitchWall from "./GlitchWall";
import SmartImage from "./SmartImage";

const FRAMES = 36;
const FRAME_WIDTH = 256;
const ANIMATION_TIME = 3;

const coverVariants: Variants = {
	idle: { opacity: 0, transition: { duration: 0 } },
	boot: { opacity: 1, transition: { duration: 0 } },
	exit: {
		opacity: 0,
		transitionEnd: { visibility: "hidden" },
		transition: { type: "tween", duration: 0.4, ease: steps(5) },
	},
};

const logoVariants: Variants = {
	idle: {
		x: 48,
		filter: "drop-shadow(0px 0px 0px #f6019d)",
	},
	boot: {
		x: 0,
		filter: "drop-shadow(0px 0px 16px #f6019d)",
		transition: {
			x: { type: "tween", delay: 1, duration: 1, ease: "easeOut" },
			filter: { type: "tween" },
		},
	},
	exit: {
		x: 0,
		filter: "drop-shadow(0px 0px 16px #f6019d)",
		transition: { duration: 0 },
	},
};

const spriteVariants: Variants = {
	idle: { x: 0 },
	boot: {
		x: -(FRAMES * FRAME_WIDTH),
		transition: {
			type: "tween",
			duration: ANIMATION_TIME,
			ease: steps(FRAMES),
		},
	},
	exit: {
		x: -(FRAMES * FRAME_WIDTH),
		transition: { duration: 0 },
	},
};

interface LoaderProps extends HTMLMotionProps<"main"> {
	children: React.ReactNode;
	enable: boolean;
}

const Loader = ({ children, enable, ref, ...props }: LoaderProps) => {
	const skipLoader = useSettingsStore(state => state.skipLoader);
	const [loaded, setLoaded] = useState(skipLoader && enable);
	// initial only applies on mount. A later visit already has enable=true,
	// so start at idle or the boot transition never runs.
	const playBoot = useRef(enable && !skipLoader).current;

	useEffect(() => {
		if (!enable) {
			setLoaded(false);
			return;
		}

		if (skipLoader) {
			document.title = "RedaOS";
			setLoaded(true);
			return;
		}

		let cancelled = false;

		(async () => {
			await animate(0, 3.99, {
				repeat: 5,
				duration: 1,
				type: "tween",
				ease: "linear",
				onUpdate: latest =>
					(document.title = `Booting${".".repeat(Math.floor(latest))}`),
			});
			document.title = "RedaOS";

			if (!cancelled) setLoaded(true);
		})();

		return () => {
			cancelled = true;
		};
	}, [enable, skipLoader]);

	return (
		<>
			<motion.main
				animate={loaded ? "loaded" : "unloaded"}
				initial="unloaded"
				{...props}
				className={cn(
					props.className,
					"transition delay-75",
					!loaded && "invisible",
				)}
				ref={ref}
			>
				{children}
			</motion.main>
			<motion.div
				className="fixed inset-0 z-10 flex items-center justify-center bg-black-primary"
				initial={playBoot ? "idle" : false}
				animate={loaded ? "exit" : enable ? "boot" : "idle"}
				variants={coverVariants}
			>
				<div className="flex size-128 flex-col items-center justify-center bg-radial from-black-primary from-[128px] to-transparent to-[256px]">
					<motion.div
						className="w-64 overflow-hidden"
						variants={logoVariants}
					>
						<motion.div variants={spriteVariants}>
							<SmartImage
								src={logo_animated_img}
								alt="Animated logo"
								className="h-32 max-w-none"
							/>
						</motion.div>
					</motion.div>
					<p className="text-light-primary">Definitely Loading...</p>
				</div>
				<GlitchWall enable={enable && !loaded} />
			</motion.div>
		</>
	);
};

export default Loader;
