import { motion } from "motion/react";
import React from "react";
import closeImg from "../../assets/images/close.png";
import maximizeImg from "../../assets/images/maximize.png";
import restoreDownImg from "../../assets/images/restore_down.png";
import { cn } from "../../utils";
import SmartImage from "../SmartImage";

interface WindowHeaderProps {
	onGrab: React.PointerEventHandler<Element>;
	onClose: React.MouseEventHandler;
	onMaximize: React.MouseEventHandler;
	maximized: boolean;
	title: string;
	showControls?: boolean;
	draggable?: boolean;
	immediate?: boolean;
}

const WindowHeader = ({
	onGrab,
	onClose,
	onMaximize,
	maximized,
	title,
	showControls = true,
	draggable = true,
	immediate = false,
}: WindowHeaderProps) => (
	<div className="overflow-hidden">
		<motion.div
			initial={immediate ? false : { y: "-105%" }}
			animate={immediate ? undefined : { y: 0 }}
			transition={
				immediate
					? undefined
					: { delay: 1.25, ease: "easeOut", type: "tween" }
			}
			onPointerDown={
				draggable
					? e => {
							if (
								e.target instanceof Element &&
								e.target.closest("button")
							)
								return;
							onGrab(e);
						}
					: undefined
			}
			className={cn(
				"flex h-10 w-full items-center border-b-2 text-white",
				draggable && "cursor-grab touch-none",
			)}
		>
			<h1 className="grow overflow-hidden px-1 text-center text-lg text-ellipsis whitespace-nowrap select-none">
				{title}
			</h1>
			{showControls && (
				<>
					<button
						type="button"
						className="group h-full w-10 shrink-0 cursor-pointer border-l-2 p-1 hover:bg-white focus-visible:bg-white"
						onClick={onMaximize}
						aria-label={maximized ? "Restore down" : "Maximize"}
					>
						{maximized ? (
							<SmartImage
								src={restoreDownImg}
								alt=""
								draggable={false}
								className="w-9 group-hover:invert group-focus-visible:invert"
								loading="eager"
							/>
						) : (
							<SmartImage
								src={maximizeImg}
								alt=""
								draggable="false"
								className="w-9 group-hover:invert group-focus-visible:invert"
								loading="eager"
							/>
						)}
					</button>
					<button
						type="button"
						className="group h-full w-10 shrink-0 cursor-pointer border-l-2 p-0.5 hover:bg-white focus-visible:bg-white"
						onClick={onClose}
						aria-label="Close"
					>
						<SmartImage
							src={closeImg}
							alt=""
							draggable="false"
							className="w-9 group-hover:invert group-focus-visible:invert"
							loading="eager"
						/>
					</button>
				</>
			)}
		</motion.div>
	</div>
);

export default WindowHeader;
