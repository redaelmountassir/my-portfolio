import { useState } from "react";
import { cn, pickRand } from "../utils";

interface TagProps {
	children: string;
	className?: string;
	bg?: "random" | "solid";
}

const Tag = ({ children, bg, className }: TagProps) => {
	const [randBg] = useState(
		pickRand([
			"bg-blue-accent",
			"bg-pink-accent",
			"bg-purple-accent",
			"bg-burgundy-accent",
		]),
	);
	return (
		<span
			className={cn(
				"p-2 py-1 whitespace-nowrap outline-2 outline-white-primary transition ease-steps2 hover:scale-125 hover:bg-white-primary! hover:text-black-primary",
				bg &&
					(bg == "random"
						? randBg
						: "bg-white-primary text-black-primary"),
				className,
			)}
		>
			{children}
		</span>
	);
};

export default Tag;
