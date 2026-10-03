import {
	steps,
	useAnimate,
	useMotionValueEvent,
	useScroll,
	useTransform,
} from "motion/react";
import {
	Suspense,
	useContext,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { useSystemKeys } from "../../../store";
import { MobileContext } from "../../../store/MobileContext";
import Throbber from "../../Throbber";
import { InternalWindowDataContext } from "../../window/Window";
import About from "./About";
import MainShowcase from "./MainShowcase";
import MediaFrame from "./MediaFrame";
import NextProject from "./NextProject";
import ProjectTitle from "./ProjectTitle";
import ShowcasePair from "./ShowcasePair";
import { isMediaFile } from "./types";

const MediaViewer = () => {
	const windowData = useContext(InternalWindowDataContext);
	const isMobile = useContext(MobileContext);
	const { traverse, replaceWindow } = useSystemKeys(
		"traverse",
		"replaceWindow",
	);

	const sysObj = windowData?.sysObj;
	const id = windowData?.id;
	const setTitle = windowData?.setTitle;
	const file = sysObj && isMediaFile(sysObj) ? sysObj : null;
	const projectData = file?.value;
	const title = file?.name.replaceAll("_", " ") ?? "";

	const parent = file ? traverse(file)?.at(-1) : undefined;
	const projects = parent?.children.filter(isMediaFile) ?? [];
	const index = projects.findIndex(obj => obj.name === file?.name);
	const nextProject =
		projects.length > 0
			? projects[(index + 1) % projects.length]
			: undefined;

	useEffect(() => {
		if (!file || !setTitle) return;
		setTitle(`${file.name}.${file.ext} - Media Viewer`);
	}, [file, setTitle]);

	// Scroll animations
	const scrollToTitle = useRef<HTMLHeadingElement>(null);
	const [scrollContainer, animate] = useAnimate<HTMLDivElement>();
	const scrollTarget = useRef(null);
	const { scrollYProgress, scrollY } = useScroll({
		target: scrollTarget,
		container: scrollContainer,
	});
	const [inTop, setInTop] = useState(true);
	useMotionValueEvent(scrollYProgress, "change", latest => {
		if (!scrollContainer.current) return;
		setInTop(top => (top ? latest <= 0.45 : latest < 0.25));
	});

	const scrollTarget2 = useRef(null);
	const { scrollYProgress: scrollYProgress2 } = useScroll({
		target: scrollTarget2,
		container: scrollContainer,
	});
	const clipPath = useTransform(
		scrollYProgress2,
		[0, 1],
		[`inset(5rem ${isMobile ? 5 : 12}rem)`, "inset(0)"],
		{ ease: steps(25) },
	);

	const loadingRef = useRef<HTMLDivElement>(null);
	// "watch" accepts the end-of-scroll trigger. "loading" is the throbber.
	// "settle" is after the swap, until scrollTop is actually 0 — progress can
	// still read as 1 here and must not start another load.
	const phase = useRef<"watch" | "loading" | "settle">("watch");
	const nextRef = useRef(nextProject);
	nextRef.current = nextProject;
	const swapTimer = useRef<number>(undefined);

	const gotoNext = () => {
		const upcoming = nextRef.current;
		if (
			phase.current === "loading" ||
			!upcoming ||
			id === undefined ||
			!loadingRef.current ||
			!scrollContainer.current
		)
			return;
		phase.current = "loading";
		const controls = animate(
			loadingRef.current,
			{ opacity: [0, 1, 1, 0] },
			{
				type: "tween",
				duration: 3,
				times: [0, 0.2, 0.8, 1],
				ease: steps(5),
			},
		);
		void Promise.resolve(controls).then(() => {
			if (loadingRef.current) loadingRef.current.style.opacity = "0";
		});
		setInTop(true);
		window.clearTimeout(swapTimer.current);
		swapTimer.current = window.setTimeout(() => {
			replaceWindow(id, upcoming);
		}, 2000);
	};

	useEffect(() => () => window.clearTimeout(swapTimer.current), []);

	useLayoutEffect(() => {
		if (phase.current === "watch") return;
		const el = scrollContainer.current;
		if (!el) return;
		phase.current = "settle";
		el.scrollTop = 0;
		let frames = 0;
		let raf = 0;
		const pinTop = () => {
			el.scrollTop = 0;
			frames += 1;
			if (frames < 6) {
				raf = requestAnimationFrame(pinTop);
				return;
			}
			if (el.scrollTop < 2) phase.current = "watch";
		};
		raf = requestAnimationFrame(pinTop);
		return () => cancelAnimationFrame(raf);
	}, [file?.name]);

	useEffect(() => {
		const el = scrollContainer.current;
		if (!el) return;
		// Arm only after the scroller has been away from the end, so a swap
		// that lands on the bottom cannot immediately start another load.
		let armed = false;
		const onScroll = () => {
			if (phase.current !== "watch") return;
			const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
			if (remaining > 48) armed = true;
			if (armed && remaining < 8 && el.scrollTop > 2) gotoNext();
		};
		el.addEventListener("scroll", onScroll, { passive: true });
		return () => el.removeEventListener("scroll", onScroll);
	}, [file?.name]);

	if (!file || !projectData || !nextProject || id === undefined) return;

	const [firstPair, restShowcases] =
		projectData.showcases.length < 3
			? [[], projectData.showcases.slice(1)]
			: [
					projectData.showcases.slice(1, 3),
					projectData.showcases.slice(3),
				];

	return (
		<>
			<div
				ref={loadingRef}
				className="pointer-events-none absolute z-1 size-full bg-black-primary opacity-0"
			>
				<Throbber />
			</div>
			<div
				ref={scrollContainer}
				className="relative flex-1 overflow-x-hidden overflow-y-auto [overflow-anchor:none]"
			>
				<div
					className="mx-4 h-[150%] min-h-250 text-white-primary md:mt-12"
					ref={scrollTarget}
				>
					<MainShowcase
						file={file}
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
				<ProjectTitle
					title={title}
					scrollContainer={scrollContainer}
					headingRef={scrollToTitle}
				/>
				<About
					title={title}
					description={projectData.description}
					tags={projectData.tags}
					scrollY={scrollY}
					scrollContainer={scrollContainer}
				/>
				{firstPair.length > 0 && (
					<ShowcasePair
						project={file.name}
						showcases={firstPair}
						scrollContainer={scrollContainer}
						decorativeCursor={!isMobile}
					/>
				)}
				{restShowcases.map(showcase => (
					<div
						key={showcase}
						className="relative m-4 mt-0 border-2 border-white-primary bg-black-primary"
					>
						<MediaFrame
							project={file.name}
							src={showcase}
							scrollContainer={scrollContainer}
							decorativeCursor={!isMobile}
						/>
					</div>
				))}
				<Suspense
					fallback={
						<div className="relative mt-12 h-40">
							<Throbber />
						</div>
					}
				>
					<NextProject
						project={nextProject}
						scrollContainer={scrollContainer}
						clipPath={clipPath}
						targetRef={scrollTarget2}
						onClick={gotoNext}
					/>
				</Suspense>
			</div>
		</>
	);
};

export default MediaViewer;
