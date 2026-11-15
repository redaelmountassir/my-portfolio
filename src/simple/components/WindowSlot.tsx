import { motion, resize, steps } from "motion/react";
import { Suspense, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { WindowData } from "../../store/types";
import { cn } from "../../utils";
import Throbber from "../../components/Throbber";
import WindowBody from "../../components/window/WindowBody";
import WindowHeader from "../../components/window/WindowHeader";
import { InternalWindowDataContext } from "../../components/window/windowContext";

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
	const [closing, setClosing] = useState(false);
	const [maximized, setMaximized] = useState(false);
	const [width, setWidth] = useState(() =>
		typeof window === "undefined" ? 0 : window.innerWidth,
	);
	const frameRef = useRef<HTMLElement>(null);

	useLayoutEffect(() => {
		const frame = frameRef.current;
		if (!frame) return;

		const applyWidth = (measured: number) => {
			const next = Math.round(measured);
			setWidth(current => (current === next ? current : next));
		};
		applyWidth(frame.clientWidth);

		return resize(frame, element => {
			const measured = element.clientWidth;
			if (measured != null) applyWidth(measured);
		});
	}, [closed, externallyClosed, maximized]);

	useLayoutEffect(() => {
		if (!maximized) return;

		const root = document.documentElement;
		const previousOverflow = root.style.overflow;
		root.style.overflow = "hidden";

		return () => {
			root.style.overflow = previousOverflow;
		};
	}, [maximized]);

	if (closed || externallyClosed) return null;

	const frame = (
		<motion.section
			ref={frameRef}
			initial={false}
			animate={closing ? { scale: 0 } : { scale: 1 }}
			transition={{
				duration: 0.3,
				type: "tween",
				ease: steps(7),
			}}
			onAnimationComplete={() => {
				if (!closing) return;
				setClosed(true);
				onClose?.();
			}}
			inert={maximized ? inert || undefined : undefined}
			aria-hidden={maximized ? ariaHidden || undefined : undefined}
			className={cn(
				"pointer-events-auto relative bg-black-primary flex size-full min-h-0 flex-col overflow-hidden border-2 border-white-primary  from-black-primary/80 from-25% to-dark-primary/80 to-70%",
				maximized ?
					"fixed inset-0 z-50" : "bg-linear-to-r",
			)}
			style={{ transformOrigin: "center" }}
		>
			<WindowHeader
				onClose={() => {
					if (!closing) setClosing(true);
				}}
				onMaximize={() => {
					if (!closing) setMaximized(current => !current);
				}}
				maximized={maximized}
				title=""
				draggable={false}
				immediate
			/>
			<div className="relative flex min-h-0 flex-1 flex-col">
				<Suspense
					fallback={
						<div className="relative flex-1">
							<Throbber />
						</div>
					}
				>
					<WindowBody />
				</Suspense>
			</div>
		</motion.section>
	);

	const content = (
		<InternalWindowDataContext.Provider
			value={{
				...windowData,
				setTitle: () => {},
				getWidth: () => width,
				hasTaskbar: false,
			}}
		>
			{frame}
		</InternalWindowDataContext.Provider>
	);

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
			{maximized && typeof document !== "undefined"
				? createPortal(content, document.body)
				: content}
		</div>
	);
};

export default WindowSlot;
