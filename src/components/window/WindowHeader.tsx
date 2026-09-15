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
}

const WindowHeader = ({
	onGrab,
	onClose,
	onMaximize,
	maximized,
	title,
}: WindowHeaderProps) => (
	<div className="overflow-hidden">
		<motion.div
			initial={{ y: "-105%" }}
			animate={{ y: 0 }}
			transition={{ delay: 1.25, ease: "easeOut", type: "tween" }}
			onPointerDown={maximized ? undefined : onGrab}
			className={cn(
				"flex h-10 w-full touch-none items-center border-b-2 border-white-primary text-white",
				!maximized && "cursor-grab",
			)}
		>
			<h3 className="grow overflow-hidden px-1 text-center text-lg text-ellipsis whitespace-nowrap select-none">
				{title}
			</h3>
			<button
				type="button"
				className="group h-full w-10 shrink-0 border-l-2 border-white-primary p-1 hover:bg-white"
				onClick={onMaximize}
			>
				{maximized ? (
					<SmartImage
						src={restoreDownImg}
						title="restore down"
						alt="restore down"
						draggable={false}
						className="w-9 group-hover:invert"
						loading="eager"
					/>
				) : (
					<SmartImage
						src={maximizeImg}
						title="maximize"
						alt="maximize"
						draggable="false"
						className="w-9 group-hover:invert"
						loading="eager"
					/>
				)}
			</button>
			<button
				type="button"
				className="group h-full w-10 shrink-0 border-l-2 p-0.5 hover:bg-white"
				onPointerUp={onClose}
			>
				<SmartImage
					src={closeImg}
					title="close"
					alt="close"
					draggable="false"
					className="w-9 group-hover:invert"
					loading="eager"
				/>
			</button>
		</motion.div>
	</div>
);

export default WindowHeader;
