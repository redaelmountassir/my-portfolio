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

const ToggleBtn = ({ state, setter, children, title }: ToggleProps) => (
	<button
		className={cn(
			"size-full border-2 border-white-primary bg-black-primary transition-colors ease-steps-2",
			state && "bg-white-primary text-black-primary",
		)}
		onClick={() => setter(!state)}
		type="button"
		role="switch"
		aria-checked={state}
		title={title}
	>
		{children}
	</button>
);

export default ToggleBtn;
