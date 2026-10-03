import { type Variants, motion, steps } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "../utils";

type Alignment = "left" | "center" | "right";
type Direction = "up" | "down";

interface DropdownProps extends React.ComponentPropsWithoutRef<"button"> {
	pClassName?: string;
	dClassName?: string;
	children: React.ReactElement;
	dContent: React.ReactElement;
	forcedAlignment?: Alignment;
	forcedDirection?: Direction;
	noPadding?: boolean;
}

const dropdownVariants = (direction: Direction): Variants => ({
	open: {
		clipPath: "inset(0 0 0% 0)",
		transition: {
			ease: steps(5),
			type: "tween",
		},
	},
	closed: {
		clipPath:
			direction === "down" ? "inset(0 0 100% 0)" : "inset(100% 0 0 0)",
		transition: {
			ease: steps(5),
			type: "tween",
		},
	},
});

const Dropdown = (props: DropdownProps) => {
	const {
		children,
		dContent,
		forcedAlignment,
		forcedDirection,
		noPadding,
		pClassName,
		dClassName,
		...rest
	} = props;

	const [open, setOpen] = useState(false);
	const button = useRef<HTMLButtonElement>(null);
	const dropdown = useRef<HTMLDivElement>(null);
	const [align, setAlign] = useState<Alignment>(forcedAlignment ?? "left");
	const [direction, setDirection] = useState<Direction>(
		forcedDirection ?? "down",
	);
	useEffect(() => {
		const place = () => {
			if (!button.current) return;

			const buttonRect = button.current.getBoundingClientRect();

			if (forcedAlignment) {
				setAlign(forcedAlignment);
			} else {
				const centerX = buttonRect.left + buttonRect.width * 0.5;
				const windowThird = window.innerWidth / 3;
				// Sets the alignment of a dropdown based on if it falls in the 1st, 2nd, or 3rd area of the screen
				setAlign(
					centerX < windowThird
						? "left"
						: centerX < windowThird * 2
							? "center"
							: "right",
				);
			}

			if (forcedDirection) {
				setDirection(forcedDirection);
			} else {
				const spaceBelow = window.innerHeight - buttonRect.bottom;
				const spaceAbove = buttonRect.top;
				setDirection(spaceBelow >= spaceAbove ? "down" : "up");
			}
		};

		place();
		window.addEventListener("resize", place);

		const clickOut = (e: PointerEvent) => {
			if (
				!dropdown.current ||
				!e.target ||
				!(e.target instanceof Element) ||
				dropdown.current.contains(e.target)
			)
				return;
			setOpen(false);
		};

		document.addEventListener("pointerdown", clickOut);
		return () => {
			window.removeEventListener("resize", place);
			document.removeEventListener("pointerdown", clickOut);
		};
	}, [forcedAlignment, forcedDirection]);

	return (
		<div className={cn("relative select-none", pClassName)} ref={dropdown}>
			<button
				{...rest}
				ref={button}
				type="button"
				onClick={e => {
					e.preventDefault();
					setOpen(open => !open);
				}}
			>
				{children}
			</button>
			<motion.div
				className={cn(
					"absolute -z-1 border-2 border-white-primary bg-linear-to-r from-black-primary/75 to-dark-primary/75 bg-fixed backdrop-blur-sm",
					direction === "down" && "top-full border-t-0",
					direction === "up" && "bottom-full border-b-0",
					align === "left" && "left-0",
					align === "right" && "right-0",
					align === "center" && "left-1/2 -translate-x-1/2",
					!open && "pointer-events-none",
					!noPadding && "p-4",
					dClassName,
				)}
				initial="closed"
				animate={open ? "open" : "closed"}
				variants={dropdownVariants(direction)}
			>
				{dContent}
			</motion.div>
		</div>
	);
};

export default Dropdown;
