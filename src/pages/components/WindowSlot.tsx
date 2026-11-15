import { useState } from "react";
import Window from "../../components/window/Window";
import type { WindowData } from "../../store/types";
import { cn } from "../../utils";

const WindowSlot = ({
	id,
	windowData,
	className,
	inert,
	"aria-hidden": ariaHidden,
	backfaceHidden = false,
	closed: externallyClosed = false,
	onClose,
}: {
	id?: string;
	windowData: WindowData;
	className?: string;
	inert?: boolean;
	"aria-hidden"?: boolean;
	backfaceHidden?: boolean;
	closed?: boolean;
	onClose?: () => void;
}) => {
	const [closed, setClosed] = useState(false);

	if (closed || externallyClosed) return null;

	return (
		<div
			id={id}
			inert={inert || undefined}
			aria-hidden={ariaHidden || undefined}
			className={cn(
				"relative h-[85vh] min-h-112 shadow-[10px_10px_0_0] shadow-black-primary/25",
				!backfaceHidden && "transform-[translateZ(0)]",
				className,
			)}
			style={backfaceHidden ? { backfaceVisibility: "hidden" } : undefined}
		>
			<Window
				embedded
				windowData={windowData}
				onClose={() => {
					setClosed(true);
					onClose?.();
				}}
			/>
		</div>
	);
};

export default WindowSlot;
