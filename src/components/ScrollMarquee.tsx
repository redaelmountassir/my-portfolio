import {
	motion,
	MotionValue,
	useAnimationFrame,
	useMotionValue,
	useScroll,
	useSpring,
	useVelocity,
} from "motion/react";
import React, { useRef } from "react";
import { cn, mod } from "../utils";

interface MarqueeProps extends React.ComponentPropsWithoutRef<"div"> {
	frameTime?: number;
	flexMode?: boolean;
	scroll?: MotionValue<number>;
	innerClass?: string;
	panSpeed?: number;
	scrollStrength?: number;
	vertical?: boolean;
}

const ScrollMarquee = ({
	children,
	className = "",
	innerClass = "",
	flexMode = false,
	panSpeed = 10,
	scrollStrength = 0.002,
	vertical = false,
	scroll = useScroll().scrollY,
	frameTime = 150,
	style,
	...rest
}: MarqueeProps) => {
	const fullInnerClass = cn(
		"inline-block",
		vertical ? "min-h-full" : "min-w-full",
		innerClass,
	);
	const smoothScroll = useSpring(useVelocity(scroll), {
		damping: 50,
		stiffness: 400,
	});
	const x = useMotionValue("0%");
	const secondX = useMotionValue("100%");
	const data = useRef({ timeSince: 0, val: 0 });
	useAnimationFrame((_, delta) => {
		data.current.val =
			mod(
				data.current.val +
					delta * 0.001 * panSpeed +
					smoothScroll.get() * scrollStrength +
					100,
				200,
			) - 100;

		data.current.timeSince += delta;
		if (data.current.timeSince > frameTime) {
			data.current.timeSince = 0;
			x.set(`${data.current.val}%`);
			secondX.set(
				`${(data.current.val > 0 ? -100 : 100) + data.current.val}%`,
			);
		}
	});

	return (
		<div
			{...rest}
			className={cn(
				"group relative overflow-hidden whitespace-nowrap",
				vertical &&
					"[text-orientation:upright] [writing-mode:vertical-lr]",
				vertical && (!flexMode ? "h-full" : "w-full"),
				className,
			)}
			style={style}
		>
			<motion.span
				className={cn(flexMode && "absolute", fullInnerClass)}
				style={vertical ? { y: x } : { x }}
			>
				{children}
			</motion.span>
			<motion.span
				className={cn(
					"absolute",
					vertical ? "top-0" : "left-0",
					fullInnerClass,
				)}
				style={vertical ? { y: secondX } : { x: secondX }}
			>
				{children}
			</motion.span>
		</div>
	);
};

export default ScrollMarquee;
