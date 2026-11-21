import { animate, motion, MotionValue, useTransform } from "motion/react";
import { useState, useEffect } from "react";
import { clamp } from "three/src/math/MathUtils.js";
import { cn } from "../utils";
import Battery from "./Battery";
import SmartImage from "./SmartImage";
import mobileIcons from "../assets/images/mobile_icon.png";

interface MobilePanelPreviewProps {
    now: Date | undefined;
    volume: number;
    settingsReveal: MotionValue<number>;
    setPanelOpen: (open: boolean) => void;
}

const MobilePanelPreview = ({ now, volume, settingsReveal, setPanelOpen }: MobilePanelPreviewProps) => {
    const [battery, setBattery] = useState(1);
    useEffect(() => {
		if (!("getBattery" in navigator))
			return setBattery(Math.max(Math.random(), 0.001));
		let batteryRef: any, updateBattery: () => void;
		//@ts-ignore
		navigator.getBattery().then(batt => {
			batteryRef = batt;
			updateBattery = () => setBattery(batt.level);
			batt.addEventListener("levelchange", updateBattery);
			updateBattery();
		});
		return () =>
			batteryRef?.removeEventListener("levelchange", updateBattery);
    }, []);

    return 			<motion.div
				style={{
					pointerEvents: useTransform(settingsReveal, val =>
						val == 1 ? "none" : "auto",
					),
				}}
				className="fixed top-0 flex w-full cursor-grab touch-none items-center gap-2 p-2 px-4 text-white-primary short:p-4"
				drag
				dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
				dragElastic={0}
				dragMomentum={false}
				onDragStart={() => {
					document.documentElement.classList.add("cursor-grabbing");
					document.body.classList.add("pointer-events-none");
				}}
				onDrag={(_e, info) =>
					settingsReveal.set(
						clamp(info.offset.y / window.innerHeight, 0, 1),
					)
				}
				onDragEnd={() => {
					document.documentElement.classList.remove("cursor-grabbing");
					document.body.classList.remove("pointer-events-none");
					const open = settingsReveal.get() > 0.35;
					setPanelOpen(open);
					animate(settingsReveal, open ? 1 : 0);
				}}
			>
				<p>
					{now?.toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					}) ?? "Loading..."}
				</p>
				<SmartImage src={mobileIcons} alt="" className="ml-auto h-4" />
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 -0.5 16 16"
					shapeRendering="crispEdges"
					aria-hidden
					className="h-5"
				>
					<path
						className="stroke-white-primary"
						d="M6 1h2M5 2h1M7 2h1M4 3h1M7 3h1M3 4h1M7 4h1M0 5h3M7 5h1M0 6h1M7 6h1M0 7h1M7 7h1M0 8h1M7 8h1M0 9h1M7 9h1M0 10h3M7 10h1M3 11h1M7 11h1M4 12h1M7 12h1M5 13h1M7 13h1M6 14h2"
					/>
					<path
						className={cn(
							"-translate-x-1 stroke-transparent transition",
							volume > 0 && "translate-x-0 stroke-white-primary",
						)}
						d="M9 6h1M10 7h1M10 8h1M9 9h1"
					/>
					<path
						className={cn(
							"-translate-x-1 stroke-transparent transition",
							volume > 33.3 &&
								"translate-x-0 stroke-white-primary",
						)}
						d="M10 4h1M11 5h1M12 6h1M12 7h1M12 8h1M12 9h1M11 10h1M10 11h1"
					/>
					<path
						className={cn(
							"-translate-x-1 stroke-transparent transition",
							volume > 66.6 &&
								"translate-x-0 stroke-white-primary",
						)}
						d="M11 2h1M12 3h1M13 4h1M14 5h1M14 6h1M14 7h1M14 8h1M14 9h1M14 10h1M13 11h1M12 12h1M11 13h1"
					/>
					<path
						className={cn(
							"stroke-transparent transition",
							volume == 0 && "stroke-white-primary",
						)}
						d="M11 6h1M15 6h1M12 7h1M14 7h1M13 8h1M12 9h1M14 9h1M11 10h1M15 10h1"
					/>
				</svg>
				<p>{Math.floor(battery * 100)}%</p>
				<Battery level={battery} className="h-6" />
			</motion.div>
}

export default MobilePanelPreview;