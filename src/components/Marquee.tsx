import React from "react";
import { cn } from "../utils";

interface MarqueeProps extends React.ComponentPropsWithoutRef<"div"> {
	innerClass?: string;
	panTime?: number;
	pauseOnHover?: boolean;
	vertical?: boolean;
	steps?: number;
}

const Marquee = (props: MarqueeProps) => {
	const {
		children,
		className = "",
		innerClass = "",
		panTime = 10,
		pauseOnHover = true,
		vertical = false,
		steps,
		style,
		...rest
	} = props;
	const durationStr = `${panTime}s`;
	const delayStr = `-${panTime * 0.5}s`;
	const fullInnerClass = cn(
		"inline-block",
		vertical ? "animate-pan-vertical min-h-full" : "animate-pan min-w-full",
		pauseOnHover && "group-hover:animate-pause",
		innerClass,
	);
	const timingFunc = steps ? `steps(${steps})` : undefined;

	return (
		<div
			{...rest}
			className={cn(
				"group relative overflow-hidden whitespace-nowrap",
				vertical
					? "h-full [text-orientation:upright] [writing-mode:vertical-lr]"
					: "w-full",
				className,
			)}
			style={style}
		>
			<span
				className={fullInnerClass}
				style={{
					animationDuration: durationStr,
					MozAnimationDuration: durationStr,
					WebkitAnimationDuration: durationStr,
					animationTimingFunction: timingFunc,
					MozAnimationTimingFunction: timingFunc,
					WebkitAnimationTimingFunction: timingFunc,
				}}
			>
				{children}
			</span>
			<span
				className={cn(
					"absolute",
					vertical ? "top-0" : "left-0",
					fullInnerClass,
				)}
				style={{
					animationDuration: durationStr,
					MozAnimationDuration: durationStr,
					WebkitAnimationDuration: durationStr,
					animationTimingFunction: timingFunc,
					MozAnimationTimingFunction: timingFunc,
					WebkitAnimationTimingFunction: timingFunc,
					animationDelay: delayStr,
					MozAnimationDelay: delayStr,
					WebkitAnimationDelay: delayStr,
				}}
			>
				{children}
			</span>
		</div>
	);
};

export default Marquee;
