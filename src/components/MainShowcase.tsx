import {
	animate,
	motion,
	type AnimationOptions,
	type AnimationScope,
} from "motion/react";
import React, { useContext, useEffect, useRef } from "react";
import shapeGif from "../assets/images/icohedron.gif";
import infoImg from "../assets/images/info.png";
import scrollDownImg from "../assets/images/scroll_down.png";
import throbberGif from "../assets/images/throbber.gif";
import { MobileContext } from "../store/MobileContext";
import type { File } from "../store/types";
import { cn, ease25Steps, ease5Steps } from "../utils";
import Follow from "./Follow";
import Showcase from "./Showcase";
import SmartImage from "./SmartImage";

interface MainShowcaseProps {
	file: File;
	scrollContainer: AnimationScope<HTMLDivElement>;
	inTop: boolean;
	skipSection?: React.MouseEventHandler<HTMLDivElement>;
}

const TOTAL_DURATION = 0.75;
const HALF_DURATION = TOTAL_DURATION / 2;

const desktopHalf: AnimationOptions = {
	duration: HALF_DURATION,
	ease: ease25Steps,
	type: "tween" as const,
};

const mobileHalf: AnimationOptions = {
	duration: HALF_DURATION,
	ease: ease5Steps,
	type: "tween" as const,
};

const maskUnsupported = !(
	"mask" in document.documentElement.style ||
	"webkitMask" in document.documentElement.style
);

const MainShowcase = ({
	file,
	scrollContainer,
	inTop,
	skipSection,
}: MainShowcaseProps) => {
	const isMobile = useContext(MobileContext);

	const mainShowcaseRef = useRef<HTMLDivElement>(null);
	const playbackRef = useRef<ReturnType<typeof animate> | null>(null);
	const prevInTopRef = useRef(inTop);

	useEffect(() => {
		const el = mainShowcaseRef.current;
		if (!el) return;

		const prevInTop = prevInTopRef.current;
		prevInTopRef.current = inTop;
		if (prevInTop === inTop) return;

		let cancelled = false;
		const useClip = isMobile || maskUnsupported;

		const clearInlineMask = () => {
			el.style.maskImage = "";
			el.style.webkitMaskImage = "";
		};

		const applyMidLayout = () => {
			el.style.position = inTop ? "absolute" : "relative";
			if (!useClip) {
				const size = inTop ? "100% 2600%" : "200% 2600%";
				el.style.maskSize = size;
				el.style.webkitMaskSize = size;
			}
		};

		const finishDesktopMask = () => {
			if (useClip) return;
			el.style.maskImage = "none";
			el.style.webkitMaskImage = "none";
		};

		const run = async () => {
			clearInlineMask();

			const out = useClip
				? animate(
						el,
						{ clipPath: ["inset(0 0% 0 0)", "inset(0 100% 0 0)"] },
						mobileHalf,
					)
				: animate(
						el,
						{
							maskPosition: ["0 0%", "0 100%"],
							webkitMaskPosition: ["0 0%", "0 100%"],
						},
						desktopHalf,
					);
			playbackRef.current = out;
			await out;

			if (cancelled) return;
			applyMidLayout();

			const inn = useClip
				? animate(
						el,
						{ clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"] },
						mobileHalf,
					)
				: animate(
						el,
						{
							maskPosition: ["0 100%", "0 0%"],
							webkitMaskPosition: ["0 100%", "0 0%"],
						},
						desktopHalf,
					);
			playbackRef.current = inn;
			await inn;

			if (cancelled || useClip) return;
			finishDesktopMask();
		};

		run();

		return () => {
			cancelled = true;
			playbackRef.current?.stop();
			playbackRef.current = null;
		};
	}, [inTop, isMobile]);

	if (typeof file.value === "string" || !file.value) return;
	const projectData = file.value;

	const titleAnimated = file.name.split("_").map((str, i) => (
		<span key={i} className="-mt-4 block overflow-hidden">
			<motion.span
				initial={{ y: "100%" }}
				whileInView={{ y: 0 }}
				transition={{
					delay: i * 0.25,
					type: "tween",
					ease: "circOut",
					duration: 1,
				}}
				viewport={{
					once: true,
					root: scrollContainer,
				}}
				className="block pt-2"
			>
				{(i + 1) % 2 == 0 ? `• ${str}` : str}
			</motion.span>
		</span>
	));

	return (
		<div className="sticky top-0 mb-14 flex gap-4 md:top-12">
			<div className="z-1 min-w-0 basis-0 md:flex-1">
				<motion.div
					ref={mainShowcaseRef}
					className="darken-bottom absolute size-full cursor-none border-2 border-white-primary pixel-mask"
				>
					<img
						src={throbberGif}
						alt="Throbber"
						className="absolute top-1/2 left-1/2 z-1 w-16 -translate-x-1/2 -translate-y-1/2"
					/>
					<div className="absolute top-0 size-full bg-black-primary" />
					<Showcase src={projectData.showcases[0]} />
					{!isMobile && <Follow />}
					<div
						className={cn(
							"absolute top-6 right-6 z-2 animate-bounce cursor-pointer transition delay-1000 md:top-auto md:right-3 md:bottom-3",
							!inTop && "pointer-events-none opacity-0 delay-0!",
						)}
						onClick={skipSection}
					>
						<SmartImage
							src={scrollDownImg}
							alt="scroll down"
							className="w-4 origin-top-right scale-[3] drop-shadow-md md:origin-bottom-right md:scale-[4]"
						/>
					</div>
				</motion.div>
				<h3 className="dlig ss02 pointer-events-none absolute -bottom-12 left-7 z-1 hidden overflow-visible font-display text-7xl leading-[0.95] whitespace-nowrap uppercase shadow-black-primary/25 [text-shadow:-5px_5px_5px_var(--tw-shadow-color)] md:inline">
					{titleAnimated}
				</h3>
			</div>
			<div className="w-full min-w-0 flex-1">
				<div className="mb-4 min-h-[55vh] w-full border-2 border-white-primary bg-black-primary p-4 py-6">
					<h3 className="mb-2 text-center font-display text-6xl">
						<SmartImage
							src={infoImg}
							className="mr-4 inline-block h-12 align-top"
							alt=""
						/>
						Info
					</h3>
					<ul className="mb-8 min-w-0 divide-y-2">
						<li className="flex flex-col justify-between gap-2 py-4 md:flex-row">
							<h4>Categories</h4>
							<div className="text-light-primary md:text-right">
								{projectData.categories.map(cat => (
									<p key={cat}>{cat}</p>
								))}
							</div>
						</li>
						<li className="flex flex-col justify-between gap-2 py-4 md:flex-row">
							<h4>Roles</h4>
							<div className="text-light-primary md:text-right">
								{projectData.roles.map(role => (
									<p key={role}>{role}</p>
								))}
							</div>
						</li>
						<li className="flex flex-col justify-between gap-2 py-4 md:flex-row">
							<h4>Date</h4>
							<div className="text-light-primary md:text-right">
								{projectData.date.toLocaleDateString()}
							</div>
						</li>
						{projectData.org && (
							<li className="flex flex-col justify-between gap-2 py-4 md:flex-row">
								<h4>Organization</h4>
								<div className="text-light-primary md:text-right">
									{projectData.org}
								</div>
							</li>
						)}
						{projectData.loc && (
							<li className="flex flex-col justify-between gap-2 py-4 md:flex-row">
								<h4>Location</h4>
								{projectData.loc.link === "#" ? (
									<span className="flex-1 overflow-hidden text-ellipsis text-light-primary md:text-right">
										{projectData.loc.text}
									</span>
								) : (
									<a
										className="flex-1 cursor-pointer overflow-hidden text-ellipsis text-pink-accent underline md:text-right"
										href={projectData.loc.link}
										target="_blank"
									>
										{projectData.loc.text} &#16;
									</a>
								)}
							</li>
						)}
					</ul>
				</div>
				<img
					src={shapeGif}
					alt="spinning shape"
					className="h-28 w-full border-2 border-white-primary bg-black-primary object-contain p-4 py-1"
				/>
			</div>
		</div>
	);
};
export default MainShowcase;
