import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { WindowDataContext } from "../Window";
import {
	motion,
	useAnimate,
	useMotionValueEvent,
	useScroll,
	useTransform,
} from "framer-motion";
import { MobileContext } from "../OS";
import { ease25Steps, ease5Steps, map } from "../../utils";
import { useBoundStore } from "../../store";
import ScrollMarquee from "../ScrollMarquee";
import GlitchText from "../GlitchText";
import Tag from "../Tag";
import Marquee from "../Marquee";
import mapImg from "../../images/map_watermark.png";
import handsGif from "../../images/hands.gif";
import Showcase from "../Showcase";
import MainShowcase from "../MainShowcase";
import Follow from "../Follow";
import throbberGif from "../../images/throbber.gif";

export const MediaViewer = () => {
	const isMobile = useContext(MobileContext);
	const windowData = useContext(WindowDataContext);
	if (!windowData) return;
	const { setTitle, sysObj, id } = windowData;
	if (!("ext" in sysObj) || !sysObj.value || typeof sysObj.value === "string")
		return null;
	useEffect(
		() => setTitle(`${sysObj.name}.${sysObj.ext} - Media Viewer`),
		[sysObj],
	);

	const projectData = sysObj.value;
	const title = sysObj.name.replaceAll("_", " ");

	// Scroll-based animation
	const [scrollContainer, animate] = useAnimate<HTMLDivElement>();
	const scrollTarget = useRef(null);
	const { scrollYProgress, scrollY } = useScroll({
		target: scrollTarget,
		container: scrollContainer,
	});
	const [inTop, setInTop] = useState(true);
	useMotionValueEvent(scrollYProgress, "change", (latest) => {
		if (!scrollContainer.current) return;
		if (!inTop && latest < 0.25) setInTop(true);
		else if (inTop && latest > 0.45) setInTop(false);
	});
	const scrollToTitle = useRef<HTMLHeadingElement>(null);
	const onViewportEnter = (e: IntersectionObserverEntry | null) => {
		if (e) (e.target as HTMLDivElement).style.clipPath = "inset(0 0 0% 0)";
	};

	const scrollTarget2 = useRef(null);
	const { scrollYProgress: scrollYProgress2 } = useScroll({
		target: scrollTarget2,
		container: scrollContainer,
	});
	const clipPath = useTransform(scrollYProgress2, (latest) => {
		const t = ease25Steps(latest);
		const insetV = map(t, 0, 1, 5, 0);
		const insetH = map(t, 0, 1, isMobile ? 5 : 12, 0);
		return `inset(${insetV}rem ${insetH}rem)`;
	});

	// Seperates showcases into the two sections (or less depending on quantity)
	const [intialShowcases, restShowcases] = useMemo(
		() => [
			projectData.showcases.length < 3 ? [] : projectData.showcases.slice(1, 3),
			projectData.showcases.slice(projectData.showcases.length < 3 ? 1 : 3),
		],
		[projectData],
	);

	//Next project
	const [traverse, replaceWindow] = useBoundStore((state) => [
		state.traverse,
		state.replaceWindow,
	]);
	const nextProject = useMemo(() => {
		const parentFolders = traverse(sysObj);
		if (!parentFolders || parentFolders.length == 0) return;
		const projects = parentFolders[parentFolders.length - 1].children;
		const i = projects.findIndex((obj) => obj.name === sysObj.name) + 1;
		return projects[i % projects.length];
	}, [sysObj]);
	if (
		!nextProject ||
		!("ext" in nextProject) ||
		!nextProject.value ||
		typeof nextProject.value === "string" ||
		!id
	)
		return;
	const loadingRef = useRef<HTMLImageElement>(null);
	const gotoNext = () => {
		if (!loadingRef.current || !scrollContainer.current) return;
		animate(
			loadingRef.current,
			{ opacity: [0, 1, 1, 0] },
			{
				type: "tween",
				duration: 3,
				times: [0, 0.2, 0.8, 1],
				ease: ease5Steps,
			},
		);
		setInTop(true);
		setTimeout(() => {
			replaceWindow(id, nextProject);
			scrollContainer.current?.scrollTo(0, 0);
		}, 2000);
	};
	useEffect(
		() => scrollYProgress2.on("change", (val) => val > 0.999 && gotoNext()),
		[sysObj],
	);

	return (
		<>
			<div
				ref={loadingRef}
				className="pointer-events-none absolute z-10 h-full w-full bg-black-primary opacity-0"
			>
				<img
					src={throbberGif}
					alt="Throbber"
					className="absolute left-1/2 top-1/2 w-16 -translate-x-1/2 -translate-y-1/2"
				/>
			</div>
			<div
				ref={scrollContainer}
				className="relative flex-1 overflow-y-auto overflow-x-hidden"
			>
				<div
					className="mx-4 h-[150%] min-h-[1000px] text-white-primary md:mt-12"
					ref={scrollTarget}
				>
					<MainShowcase
						file={sysObj}
						scrollContainer={scrollContainer}
						inTop={inTop}
						skipSection={() => {
							if (isMobile) {
								scrollToTitle.current?.scrollIntoView({
									block: "end",
									behavior: "smooth",
								});
								return;
							}
							scrollContainer.current?.scrollTo({
								top: 450,
								behavior: "smooth",
							});
						}}
					/>
				</div>
				<h3
					ref={scrollToTitle}
					className="dlig ss02 mb-10 bg-white-primary p-4 pb-1 text-center font-display text-6xl uppercase leading-[0.95] text-white-primary md:hidden xs:pb-0 xs:text-7xl"
				>
					<GlitchText
						onScroll
						scrollRoot={scrollContainer}
						decayRate={0.5}
						className="absolute left-0 w-full px-4 pb-1 text-black-primary xs:pb-0"
					>
						{title}
					</GlitchText>
					{title}
				</h3>
				<div className="mx-4 mb-4 flex gap-4">
					<ScrollMarquee
						vertical
						scroll={scrollY}
						panSpeed={2}
						flexMode
						scrollStrength={0.0025}
						innerClass="w-full content-center mb-8 font-bold uppercase tracking-[1em]"
						className="relative h-auto! w-10 shrink-0 border-2 border-white-primary bg-white-primary text-black-primary"
					>
						{title} ♦♣♠♥
					</ScrollMarquee>
					<div className="relative flex grow flex-wrap gap-4 overflow-hidden border-2 border-white-primary bg-black-primary p-24 px-6 text-white-primary md:p-32 md:px-6">
						<GlitchText
							onScroll
							scrollRoot={scrollContainer}
							decayRate={0.5}
							className="ss02 dlig pointer-events-none absolute -bottom-9 -right-12 select-none font-display text-[8rem] uppercase text-purple-watermark md:text-[12.5rem]"
						>
							ABOUT
						</GlitchText>
						<p className="relative mb-2 w-full">{projectData.description}</p>
						{projectData.tags.map((tag) => (
							<Tag bg="random" key={tag} className="relative">
								{tag}
							</Tag>
						))}
					</div>
				</div>
				{intialShowcases.length && (
					<div className="mx-4 mb-4 grid h-[900px] grid-cols-1 grid-rows-[1fr_0_auto_2fr] gap-4 overflow-hidden md:grid-cols-2 md:grid-rows-[50%_1fr_auto]! average:h-[150%] average:grid-rows-[1fr_150px_auto_2fr]">
						<div className="relative min-h-0 border-2 border-white-primary bg-black-primary">
							<img
								src={throbberGif}
								alt="Throbber"
								className="absolute left-1/2 top-1/2 w-16 -translate-x-1/2 -translate-y-1/2"
							/>
							<motion.div
								onViewportEnter={onViewportEnter}
								viewport={{
									root: scrollContainer,
								}}
								style={{ clipPath: "inset(0 100% 0 0)" }}
								className="relative h-full cursor-none transition-all duration-1000 ease-steps10"
							>
								<Showcase src={intialShowcases[1]} />
								{!isMobile && <Follow />}
							</motion.div>
						</div>
						<div className="relative overflow-hidden border-2 border-white-primary bg-black-primary">
							<img
								src={mapImg}
								alt="map watermark"
								className="absolute h-full w-full object-contain"
							/>
							<img
								src={handsGif}
								alt="spinning shape"
								className="absolute h-full w-full scale-75 object-contain"
							/>
						</div>
						<Marquee
							className="relative shrink-0 border-x-2 border-white-primary bg-white-primary text-4xl font-bold text-black-primary"
							panTime={1000}
							steps={10000}
							pauseOnHover={false}
						>
							▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
						</Marquee>
						<div className="relative min-h-0 border-2 border-white-primary bg-black-primary md:col-start-2 md:row-span-3 md:row-start-1">
							<img
								src={throbberGif}
								alt="Throbber"
								className="absolute left-1/2 top-1/2 w-16 -translate-x-1/2 -translate-y-1/2"
							/>
							<motion.div
								onViewportEnter={onViewportEnter}
								viewport={{
									root: scrollContainer,
								}}
								style={{ clipPath: "inset(0 100% 0 0)" }}
								className="relative h-full cursor-none transition-all duration-1000 ease-steps10"
							>
								<Showcase src={intialShowcases[0]} />
								{!isMobile && <Follow />}
							</motion.div>
						</div>
					</div>
				)}
				{restShowcases.map((showcase, i) => (
					<div
						key={i}
						className="relative m-4 mt-0 border-2 border-white-primary bg-black-primary"
					>
						<img
							src={throbberGif}
							alt="Throbber"
							className="absolute left-1/2 top-1/2 w-16 -translate-x-1/2 -translate-y-1/2"
						/>
						<motion.div
							onViewportEnter={onViewportEnter}
							viewport={{
								root: scrollContainer,
							}}
							style={{ clipPath: "inset(0 100% 0 0)" }}
							className="relative h-full w-full cursor-none transition-all duration-1000 ease-steps10"
						>
							<Showcase src={showcase} autoHeight />
							{!isMobile && <Follow />}
						</motion.div>
					</div>
				))}
				<div className="mt-12 h-[300%]" ref={scrollTarget2}>
					<div
						className="sticky top-0 h-1/3 cursor-pointer bg-black-primary text-white-primary outline-2 outline-white-primary"
						onClick={gotoNext}
					>
						<motion.div className="h-full w-full" style={{ clipPath }}>
							<Showcase src={nextProject.value.showcases[0]} />
						</motion.div>
						<div className="absolute top-0 flex h-full w-full flex-col justify-center gap-4 bg-black-primary/45 px-8 pb-12">
							<GlitchText
								onScroll
								scrollRoot={scrollContainer}
								decayRate={0.5}
								className="text-lg font-bold xs:mb-12"
							>
								next →
							</GlitchText>
							<h3 className="dlig ss02 whitespace-pre font-display text-5xl uppercase leading-[0.95] xs:text-7xl">
								{nextProject.name
									.split("_")
									.map((str, i) => ((i + 1) % 2 == 0 ? `\n• ${str}` : str))}
							</h3>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default MediaViewer;
