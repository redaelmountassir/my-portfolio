import { motion } from "motion/react";
import React from "react";
import { cn } from "../utils";

interface ToggleProps {
	state: boolean;
	setter:
		| React.Dispatch<React.SetStateAction<boolean>>
		| ((value: boolean) => void);
	children: string;
	title?: string;
}

const Toggle = ({ state, setter, children, title }: ToggleProps) => (
	<button
		type="button"
		role="switch"
		aria-checked={state}
		onClick={() => setter(!state)}
		title={title}
		className="my-2 flex w-full cursor-pointer items-center justify-between whitespace-nowrap"
	>
		{children}
		<div
			aria-hidden="true"
			className={cn(
				"ml-4 h-6 w-14 p-1 outline-2 outline-white-primary transition-colors ease-steps-2 motion-reduce:transition-none",
				state && "bg-linear-to-r from-pink-accent to-blue-accent",
			)}
		>
			<motion.div
				className="h-full w-1/2 bg-white-primary shadow-[-2px_-2px_inset] shadow-light-primary"
				animate={{
					x: state ? "100%" : 0,
				}}
				transition={{
					type: "spring",
					stiffness: 800,
					damping: 30,
				}}
			/>
		</div>
	</button>
);

export default Toggle;
