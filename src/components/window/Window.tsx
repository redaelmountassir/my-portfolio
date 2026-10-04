import {
	motion,
	steps,
	useDragControls,
	useMotionValue,
	type Point,
} from "motion/react";
import React, {
	createContext,
	Suspense,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { flushSync } from "react-dom";
import { useShallow } from "zustand/react/shallow";
import { useMobileStore, useSystemKeys } from "../../store";
import { MobileContext } from "../../store/MobileContext";
import type { WindowData } from "../../store/types";
import { cn } from "../../utils";
import { calcOrigin, type Dimensions } from "../../utils/window";
import Throbber from "../Throbber";
import Outline from "./Outline";
import Resizers from "./Resizers";
import WindowBody from "./WindowBody";
import WindowHeader from "./WindowHeader";

interface WindowProps {
	windowData: WindowData;
	z?: React.RefObject<number>;
	area?: React.RefObject<Element | null>;
	initialLocation?: Point;
	initialDimensions?: Dimensions;
	minDimensions?: Dimensions;
	disableInteraction?: boolean;
	disableNavCompensation?: boolean;
}

export interface InternalWindowData extends WindowData {
	setTitle: React.Dispatch<React.SetStateAction<string>>;
	getWidth: () => number;
}

export const InternalWindowDataContext = createContext<
	InternalWindowData | undefined
>(undefined);

const Window = ({
	windowData,
	area,
	z,
	initialLocation = { x: 0, y: 0 },
	initialDimensions = { w: 500, h: 300 },
	minDimensions = { w: 200, h: 100 },
	disableInteraction = false,
	disableNavCompensation = false,
}: WindowProps) => {
	const { sysObj, id } = windowData;
	const [isMoving, setIsMoving] = useState(false);
	const [maximized, setMaximized] = useState(false);
	const width = useMotionValue(initialDimensions.w);
	const height = useMotionValue(initialDimensions.h);
	const x = useMotionValue(initialLocation.x);
	const y = useMotionValue(initialLocation.y);
	const controls = useDragControls();
	const windowRef = useRef<HTMLDivElement>(null);
	// Drag constraints rebase x/y when the element resizes. That fires on
	// maximize and collapses the restored position to the top-left, so keep
	// them off until the size change has been observed.
	const rememberedPosition = useRef(initialLocation);
	const [dragConstraintsOn, setDragConstraintsOn] = useState(true);
	const constraintsFrame = useRef(0);
	const pendingGrab = useRef<PointerEvent | null>(null);
	const releaseGrab = useRef<(() => void) | null>(null);

	useEffect(
		() => () => {
			cancelAnimationFrame(constraintsFrame.current);
			releaseGrab.current?.();
		},
		[],
	);

	const { deleteWindow: deleteReq, setWindowMaximized } = useSystemKeys(
		"deleteWindow",
		"setWindowMaximized",
	);
	const [windowTitle, setTitle] = useState(sysObj.name);

	const isMobile = useContext(MobileContext);
	const [menuOpen, toggleMenu, showWindow] = useMobileStore(
		useShallow(state => [
			state.menuOpen,
			state.toggleMenu,
			state.showWindow,
		]),
	);

	const updateZ = () => {
		if (!z || isMobile) return;
		if (!windowRef.current || !z.current) return;
		if (
			windowRef.current.style.zIndex &&
			parseInt(windowRef.current.style.zIndex) === z.current
		)
			return;
		windowRef.current.style.zIndex = (++z.current).toString();
	};
	useEffect(updateZ, [windowRef.current]);

	// Prevent accidental clicks
	const [clickProtection, setClickProtection] = useState(true);
	useEffect(() => {
		const timeout = setTimeout(() => {
			setClickProtection(false);
		}, 500);
		return () => clearTimeout(timeout);
	}, []);
	disableInteraction = disableInteraction || clickProtection;
	const isFullscreen = isMobile || maximized;

	const enterMaximized = () => {
		cancelAnimationFrame(constraintsFrame.current);
		releaseGrab.current?.();
		rememberedPosition.current = { x: x.get(), y: y.get() };
		setDragConstraintsOn(false);
		setMaximized(true);
		setWindowMaximized(true);
	};

	const leaveMaximized = (next: Point, grab?: PointerEvent) => {
		x.set(next.x);
		y.set(next.y);
		rememberedPosition.current = next;
		setMaximized(false);
		setWindowMaximized(false);
		releaseGrab.current?.();
		pendingGrab.current = grab ?? null;

		if (grab) {
			const cancelGrab = () => {
				pendingGrab.current = null;
				window.removeEventListener("pointerup", cancelGrab);
				window.removeEventListener("pointercancel", cancelGrab);
				if (releaseGrab.current === cancelGrab)
					releaseGrab.current = null;
			};
			releaseGrab.current = cancelGrab;
			window.addEventListener("pointerup", cancelGrab);
			window.addEventListener("pointercancel", cancelGrab);
		}

		cancelAnimationFrame(constraintsFrame.current);
		constraintsFrame.current = requestAnimationFrame(() => {
			const event = pendingGrab.current;
			releaseGrab.current?.();
			// Re-apply after the resize observer from leaving fullscreen.
			x.set(next.x);
			y.set(next.y);
			flushSync(() => setDragConstraintsOn(true));
			if (event) controls.start(event);
		});
	};

	return (
		<InternalWindowDataContext.Provider
			value={{
				...windowData,
				setTitle,
				getWidth: () => (maximized ? window.innerWidth : width.get()),
			}}
		>
			<motion.section
				drag={!isMobile}
				dragListener={false}
				dragControls={controls}
				dragConstraints={dragConstraintsOn ? area : undefined}
				dragElastic={0.2}
				dragTransition={{ power: 0.2, timeConstant: 200 }}
				onDragStart={() => {
					setIsMoving(true);
					document.documentElement.classList.add("cursor-grab");
					document.body.classList.add("pointer-events-none");
				}}
				onDragEnd={() => {
					setIsMoving(false);
					document.documentElement.classList.remove("cursor-grab");
					document.body.classList.remove("pointer-events-none");
				}}
				initial={isMobile ? { opacity: 0 } : { scale: 0 }}
				animate={isMobile ? { opacity: 1 } : { scale: 1 }}
				exit={
					isMobile
						? { opacity: 0, pointerEvents: "none" }
						: { scale: 0 }
				}
				transition={{
					duration: 0.3,
					type: "tween",
					ease: steps(7),
				}}
				onClick={
					disableInteraction
						? e => {
								e.preventDefault();
								e.stopPropagation();
							}
						: undefined
				}
				onPointerDown={updateZ}
				onPointerUp={
					isMobile
						? () => {
								if (menuOpen) toggleMenu();
								showWindow(windowData);
							}
						: undefined
				}
				ref={windowRef}
				className={cn(
					"pointer-events-auto absolute top-0 flex max-h-full max-w-full flex-col bg-black-primary from-black-primary/75 from-25% to-dark-primary/75 to-70% shadow-[10px_10px_0_0] shadow-black-primary/25 md:bg-transparent md:bg-linear-to-r",
					isFullscreen ? "size-full! transform-none!" : "touch-none",
					isFullscreen &&
						!disableNavCompensation &&
						"border-t-40 border-t-black-primary short:border-t-56 short:md:border-0",
					isMoving ? "invisible" : "md:backdrop-blur-sm",
					disableInteraction && "disable-child-interaction",
				)}
				style={{
					minWidth: minDimensions.w,
					minHeight: minDimensions.h,
					x,
					y,
					width,
					height,
					transformOrigin:
						sysObj.htmlElement && windowRef.current
							? calcOrigin(windowRef.current, sysObj.htmlElement)
							: "",
				}}
			>
				{!isMobile && (
					<WindowHeader
						onGrab={e => {
							// Default behavior
							if (!maximized) return controls.start(e);

							// Leaves maximized in a position relative to where the cursor was holding
							const headerRect =
								e.currentTarget.getBoundingClientRect();
							const areaRect =
								area?.current?.getBoundingClientRect();
							const ratio =
								(e.clientX - headerRect.left) /
								headerRect.width;
							leaveMaximized(
								{
									x:
										e.clientX -
										(areaRect?.left ?? 0) -
										ratio * width.get(),
									y: headerRect.top - (areaRect?.top ?? 0),
								},
								e.nativeEvent,
							);
						}}
						onClose={() => {
							// Fullscreen is pinned at the origin. Keep the
							// close animation there instead of the restored spot.
							if (maximized) {
								x.set(0);
								y.set(0);
							}
							setMaximized(false);
							setWindowMaximized(false);
							deleteReq(id);
						}}
						onMaximize={() =>
							maximized
								? leaveMaximized(rememberedPosition.current)
								: enterMaximized()
						}
						maximized={maximized}
						title={windowTitle}
					/>
				)}
				<Suspense
					fallback={
						<div className="relative flex-1">
							<Throbber />
						</div>
					}
				>
					<WindowBody />
				</Suspense>
				{!isMobile && (
					<>
						<Resizers
							onResizeStart={() => {
								// Same rebase issue as maximize: size changes
								// under dragConstraints fight west/north x/y.
								cancelAnimationFrame(constraintsFrame.current);
								setDragConstraintsOn(false);
								setIsMoving(true);
							}}
							onResizeEnd={() => {
								const next = { x: x.get(), y: y.get() };
								rememberedPosition.current = next;
								setIsMoving(false);
								cancelAnimationFrame(constraintsFrame.current);
								constraintsFrame.current = requestAnimationFrame(
									() => {
										x.set(next.x);
										y.set(next.y);
										flushSync(() =>
											setDragConstraintsOn(true),
										);
									},
								);
							}}
							onResize={({ delta }, cardinal) => {
								const westResize = () => {
									//Prevents negative dragging
									const w = width.get();
									let newWidth = w - delta.x;
									let newX = delta.x;
									if (newWidth < minDimensions.w) {
										newWidth = minDimensions.w;
										newX = w - newWidth;
									}

									x.set(x.get() + newX);
									width.set(newWidth);
								};

								const northResize = () => {
									//Prevents negative dragging
									const h = height.get();
									let newHeight = h - delta.y;
									let newY = delta.y;
									if (newHeight < minDimensions.h) {
										newHeight = minDimensions.h;
										newY = h - newHeight;
									}

									y.set(y.get() + newY);
									height.set(newHeight);
								};

								switch (cardinal) {
									case "nw":
										westResize();
										northResize();
										break;
									case "n":
										northResize();
										break;
									case "ne":
										y.set(y.get() + delta.y);
										height.set(height.get() - delta.y);
										width.set(width.get() + delta.x);
										break;
									case "e":
										width.set(width.get() + delta.x);
										break;
									case "se":
										width.set(width.get() + delta.x);
										height.set(height.get() + delta.y);
										break;
									case "s":
										height.set(height.get() + delta.y);
										break;
									case "sw":
										height.set(height.get() + delta.y);
										westResize();
										break;
									case "w":
										westResize();
										break;
								}
							}}
						/>
						<Outline ghost={isMoving} />
					</>
				)}
			</motion.section>
		</InternalWindowDataContext.Provider>
	);
};

export default Window;
