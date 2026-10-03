import React from "react";
import { cn } from "../utils";

interface ToggleProps {
	state: boolean;
	setter:
		| React.Dispatch<React.SetStateAction<boolean>>
		| ((value: boolean) => void);
	children: string;
}

const ToggleBtn = ({ state, setter, children }: ToggleProps) => (
	<button
		className={cn(
			"ease-steps-2 size-full border-2 border-white-primary bg-black-primary transition-colors",
			state && "bg-white-primary text-black-primary",
		)}
		onClick={() => setter(!state)}
		type="button"
	>
		{children}
	</button>
);

export default ToggleBtn;
