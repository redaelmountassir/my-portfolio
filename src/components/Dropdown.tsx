import { type MotionStyle, type Variants, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { cn, ease5Steps } from "../utils";

interface DropdownProps extends React.DetailedHTMLProps<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
> {
	pClassName?: string;
	dClassName?: string;
	children: React.ReactElement;
	dContent: React.ReactElement;
	forcedAlignment?: Alignment;
	noPadding?: boolean;
}

const dropdownVariants: Variants = {
	open: {
		clipPath: "inset(0 0 0% 0)",
		transition: {
			ease: ease5Steps,
			type: "tween",
		},
	},
	closed: {
		clipPath: "inset(0 0 100% 0)",
		transition: {
			ease: ease5Steps,
			type: "tween",
		},
	},
};

type Alignment = "left" | "center" | "right";

const Dropdown = (props: DropdownProps) => {
	const {
		children,
		dContent,
		forcedAlignment,
		noPadding,
		pClassName,
		dClassName,
		...rest
	} = props;

	const [open, setOpen] = useState(false);
	const button = useRef<HTMLButtonElement>(null);
	const dropdown = useRef<HTMLDivElement>(null);
	const [align, setAlign] = useState<Alignment>(forcedAlignment ?? "left");
	useEffect(() => {
		if (!button.current) return;

		if (forcedAlignment) {
			setAlign(forcedAlignment);
		} else {
			const buttonRect = button.current.getBoundingClientRect();
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
		return () => document.removeEventListener("pointerdown", clickOut);
	}, [forcedAlignment]);

	const alignmentStyle: MotionStyle = { top: "100%" };
	if (align === "left") alignmentStyle.left = "0";
	else if (align === "right") alignmentStyle.right = "0";
	else {
		alignmentStyle.left = "50%";
		alignmentStyle.x = "-50%";
	}

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
					"absolute -z-10 border-2 border-t-0 border-white-primary bg-linear-to-r from-black-primary/75 to-dark-primary/75 bg-fixed backdrop-blur-sm",
					!open && "pointer-events-none",
					!noPadding && "p-4",
					dClassName,
				)}
				style={alignmentStyle}
				initial="closed"
				animate={open ? "open" : "closed"}
				variants={dropdownVariants}
			>
				{dContent}
			</motion.div>
		</div>
	);
};

export default Dropdown;
