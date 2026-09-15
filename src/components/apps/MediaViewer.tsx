import {
	motion,
	useAnimate,
	useMotionValueEvent,
	useScroll,
	useTransform,
} from "motion/react";
import { useContext, useEffect, useRef, useState } from "react";
import handsGif from "../../assets/images/hands.gif";
import mapImg from "../../assets/images/map_watermark.png";
import throbberGif from "../../assets/images/throbber.gif";
import { useSystemKeys } from "../../store";
import { MobileContext } from "../../store/MobileContext";
import { ease25Steps, ease5Steps, map } from "../../utils";
import Follow from "../Follow";
import GlitchText from "../GlitchText";
import MainShowcase from "../MainShowcase";
import Marquee from "../Marquee";
import ScrollMarquee from "../ScrollMarquee";
import Showcase from "../Showcase";
import SmartImage from "../SmartImage";
import Tag from "../Tag";
import { InternalWindowDataContext } from "../window/Window";

const MediaViewer = () => {
	const isMobile = useContext(MobileContext);
	const windowData = useContext(InternalWindowDataContext);
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
	useMotionValueEvent(scrollYProgress, "change", latest => {
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
	const clipPath = useTransform(scrollYProgress2, latest => {
		const t = ease25Steps(latest);
		const insetV = map(t, 0, 1, 5, 0);
		const insetH = map(t, 0, 1, isMobile ? 5 : 12, 0);
		return `inset(${insetV}rem ${insetH}rem)`;
	});

	// Seperates showcases into the two sections (or less depending on quantity)
	const intialShowcases =
		projectData.showcases.length < 3
			? []
			: projectData.showcases.slice(1, 3);
	const restShowcases = projectData.showcases.slice(
		projectData.showcases.length < 3 ? 1 : 3,
	);

	//Next project
	const { traverse, replaceWindow } = useSystemKeys(
		"traverse",
		"replaceWindow",
	);

	const parentFolders = traverse(sysObj);
	if (!parentFolders || parentFolders.length == 0) return;
	const projects = parentFolders[parentFolders.length - 1].children;
	const i = projects.findIndex(obj => obj.name === sysObj.name) + 1;
	const nextProject = projects[i % projects.length];
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
		() => scrollYProgress2.on("change", val => val > 0.999 && gotoNext()),
		[sysObj],
	);

	return (
		<>
			<div
				ref={loadingRef}
				className="pointer-events-none absolute z-1 size-full bg-black-primary opacity-0"
			>
				<img
					src={throbberGif}
					alt="Throbber"
					className="absolute top-1/2 left-1/2 w-16 -translate-x-1/2 -translate-y-1/2"
				/>
			</div>
			<div
				ref={scrollContainer}
				className="relative flex-1 overflow-x-hidden overflow-y-auto"
			>
				<div
					className="mx-4 h-[150%] min-h-250 text-white-primary md:mt-12"
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
					className="dlig ss02 mb-10 bg-white-primary p-4 pb-1 text-center font-display text-6xl leading-[0.95] text-white-primary uppercase xs:pb-0 xs:text-7xl md:hidden"
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
							className="ss02 dlig pointer-events-none absolute -right-12 -bottom-9 font-display text-9xl text-purple-watermark uppercase select-none md:text-[12.5rem]"
						>
							ABOUT
						</GlitchText>
						<p className="relative mb-2 w-full">
							{projectData.description}
						</p>
						{projectData.tags.map(tag => (
							<Tag bg="random" key={tag} className="relative">
								{tag}
							</Tag>
						))}
					</div>
				</div>
				{intialShowcases.length && (
					<div className="mx-4 mb-4 grid h-225 grid-cols-1 grid-rows-[1fr_0_auto_2fr] gap-4 overflow-hidden md:grid-cols-2 md:grid-rows-[50%_1fr_auto]! average:h-[150%] average:grid-rows-[1fr_150px_auto_2fr]">
						<div className="relative min-h-0 border-2 border-white-primary bg-black-primary">
							<img
								src={throbberGif}
								alt="Throbber"
								className="absolute top-1/2 left-1/2 w-16 -translate-x-1/2 -translate-y-1/2"
							/>
							<motion.div
								onViewportEnter={onViewportEnter}
								viewport={{
									root: scrollContainer,
								}}
								className="relative h-full cursor-none transition-all duration-1000 ease-steps10 [clip-path:inset(0_100%_0_0)]"
							>
								<Showcase src={intialShowcases[1]} />
								{!isMobile && <Follow />}
							</motion.div>
						</div>
						<div className="relative overflow-hidden border-2 border-white-primary bg-black-primary">
							<SmartImage
								src={mapImg}
								alt="map watermark"
								className="absolute size-full object-contain"
							/>
							<img
								src={handsGif}
								alt="spinning shape"
								className="absolute size-full scale-75 object-contain"
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
								className="absolute top-1/2 left-1/2 w-16 -translate-x-1/2 -translate-y-1/2"
							/>
							<motion.div
								onViewportEnter={onViewportEnter}
								viewport={{
									root: scrollContainer,
								}}
								className="relative h-full cursor-none transition-all duration-1000 ease-steps10 [clip-path:inset(0_100%_0_0)]"
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
							className="absolute top-1/2 left-1/2 w-16 -translate-x-1/2 -translate-y-1/2"
						/>
						<motion.div
							onViewportEnter={onViewportEnter}
							viewport={{
								root: scrollContainer,
							}}
							className="relative size-full cursor-none transition-all duration-1000 ease-steps10 [clip-path:inset(0_100%_0_0)]"
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
						<motion.div className="size-full" style={{ clipPath }}>
							<Showcase src={nextProject.value.showcases[0]} />
						</motion.div>
						<div className="absolute top-0 flex size-full flex-col justify-center gap-4 bg-black-primary/45 px-8 pb-12">
							<GlitchText
								onScroll
								scrollRoot={scrollContainer}
								decayRate={0.5}
								className="text-lg font-bold xs:mb-12"
							>
								next →
							</GlitchText>
							<h3 className="dlig ss02 font-display text-5xl leading-[0.95] whitespace-pre uppercase xs:text-7xl">
								{nextProject.name
									.split("_")
									.map((str, i) =>
										(i + 1) % 2 == 0 ? `\n• ${str}` : str,
									)}
							</h3>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default MediaViewer;
