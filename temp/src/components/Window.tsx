import { Point, motion, useDragControls, useMotionValue } from "framer-motion";
import React, { useCallback } from "react";
import Resizers from "./Resizers";
import { useRef, useState, useEffect, useContext, createContext } from "react";
import WindowHeader from "./WindowHeader";
import { MobileContext } from "./OS";
import Outline from "./Outline";
import { easeSteps } from "../utils";
import WindowBody from "./WindowBody";
import { SystemObject, Window as WindowDataTypeDef } from "../store/types";
import { useBoundStore } from "../store";
import { useMobileStore } from "../store";

export interface Dimensions {
	w: number;
	h: number;
}

interface WindowProps {
	windowData: WindowDataTypeDef; // I tried my best this shits confusing
	z?: React.MutableRefObject<number>;
	area?: React.RefObject<Element>;
	initialLocation?: Point;
	initialDimensions?: Dimensions;
	minDimensions?: Dimensions;
	disableInteraction?: boolean;
	disableNavCompensation?: boolean;
}

const calcOrigin = (window: HTMLElement, windowOrigin: HTMLElement) => {
	const windowBounds = window.getBoundingClientRect();
	const windowOriginsBounds = windowOrigin.getBoundingClientRect();
	return `${
		windowOriginsBounds.x + windowOriginsBounds.width * 0.5 - windowBounds.x
	}px ${
		windowOriginsBounds.y + windowOriginsBounds.height * 0.5 - windowBounds.y
	}px`;
};

export interface WindowDataType {
	sysObj: SystemObject;
	id: number;
	setTitle: React.Dispatch<React.SetStateAction<string>>;
	getWidth: () => number;
}

export const WindowDataContext = createContext<WindowDataType | undefined>(
	undefined,
);

export const Window: React.FC<WindowProps> = ({
	windowData,
	area,
	z,
	initialLocation = { x: 0, y: 0 },
	initialDimensions = { w: 500, h: 300 },
	minDimensions = { w: 200, h: 100 },
	disableInteraction = false,
	disableNavCompensation = false,
}) => {
	const { id, sysObj, type } = windowData;
	const [isMoving, setIsMoving] = useState(false);
	const [maximized, setMaximized] = useState(false);
	const width = useMotionValue(initialDimensions.w);
	const height = useMotionValue(initialDimensions.h);
	const x = useMotionValue(initialLocation.x);
	const y = useMotionValue(initialLocation.y);
	const controls = useDragControls();
	const windowRef = useRef<HTMLDivElement>(null);

	const [deleteReq, setWindowMaximized] = useBoundStore((state) => [
		state.deleteWindow,
		state.setWindowMaximized,
	]);
	const [windowTitle, setTitle] = useState(sysObj.name);

	const isMobile = useContext(MobileContext);
	const [menuOpen, toggleMenu, showWindow] = useMobileStore((state) => [
		state.menuOpen,
		state.toggleMenu,
		state.showWindow,
	]);

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

	return (
		<WindowDataContext.Provider
			value={{
				sysObj,
				id,
				setTitle,
				getWidth: useCallback(
					() => (maximized ? window.innerWidth : width.get()),
					[maximized],
				),
			}}
		>
			<motion.section
				drag={!isMobile}
				dragListener={false}
				dragControls={controls}
				dragConstraints={area}
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
				exit={isMobile ? { opacity: 0, pointerEvents: "none" } : { scale: 0 }}
				transition={{
					duration: 0.3,
					type: "tween",
					ease: easeSteps(7),
				}}
				onClick={
					disableInteraction
						? (e) => {
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
				className={`pointer-events-auto absolute top-0 flex max-h-full max-w-full flex-col bg-black-primary from-black-primary/75 from-25% to-dark-primary/75 to-70% shadow-[10px_10px_0_0] shadow-black-primary/25 md:bg-transparent md:bg-linear-to-r ${
					isMobile || maximized
						? `h-full! w-full! transform-none! ${!disableNavCompensation && "border-t-40 border-t-black-primary short:border-t-56 short:md:border-0"}`
						: "touch-none"
				} ${isMoving && "invisible"} ${!isMoving && "md:backdrop-blur-sm"} ${
					disableInteraction && "disable-child-interaction"
				}`}
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
						onGrab={(e) => controls.start(e)}
						onClose={() => {
							setMaximized(false);
							setWindowMaximized(false);
							deleteReq(id);
						}}
						onMaximize={() => {
							setMaximized((maximized) => !maximized);
							setWindowMaximized(!maximized);
						}}
						maximized={maximized}
						title={windowTitle}
					/>
				)}
				<WindowBody type={type} />
				{!isMobile && (
					<>
						<Resizers
							onResizeStart={() => setIsMoving(true)}
							onResizeEnd={() => setIsMoving(false)}
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
									case "n":
										northResize();
										break;
									case "ne":
										y.set(y.get() + delta.y);
										height.set(height.get() - delta.y);
									case "e":
										width.set(width.get() + delta.x);
										break;
									case "se":
										width.set(width.get() + delta.x);
									case "s":
										height.set(height.get() + delta.y);
										break;
									case "sw":
										height.set(height.get() + delta.y);
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
		</WindowDataContext.Provider>
	);
};

export default Window;
