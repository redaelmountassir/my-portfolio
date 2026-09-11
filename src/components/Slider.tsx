import React from "react";
import { cn, map } from "../utils";

interface SliderProps {
	state: number;
	setter:
		React.Dispatch<React.SetStateAction<number>> | ((value: number) => void);
	children: React.ReactNode;
	purpose: string;
	noMargin?: boolean;
	className?: string;
	inputClassName?: string;
}

const Slider = ({
	state,
	setter,
	children,
	purpose,
	noMargin = false,
	className = "",
	inputClassName = "",
}: SliderProps) => {
	return (
		<div className={cn("flex h-6", !noMargin && "my-4", className)}>
			{children}
			<input
				aria-label={purpose}
				type="range"
				value={state}
				onPointerDownCapture={e => e.stopPropagation()}
				onChange={e => setter(e.target.valueAsNumber)}
				className={"slider " + inputClassName}
				style={{
					backgroundPositionX: `${map(state, 100, 0, 3, 97)}%`,
				}}
			/>
		</div>
	);
};

export default Slider;
