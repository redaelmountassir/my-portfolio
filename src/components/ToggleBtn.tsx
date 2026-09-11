import React from "react";
import { cn } from "../utils";

interface ToggleProps {
	state: boolean;
	setter:
		React.Dispatch<React.SetStateAction<boolean>> | ((value: boolean) => void);
	children: string;
}

const ToggleBtn = ({ state, setter, children }: ToggleProps) => {
	return (
		<button
			className={cn(
				"size-full border-2 border-white-primary bg-black-primary transition-colors ease-steps2",
				state && "bg-white-primary text-black-primary",
			)}
			onClick={() => setter(!state)}
			type="button"
		>
			{children}
		</button>
	);
};

export default ToggleBtn;
