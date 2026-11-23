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
	useEffectEvent,
	useRef,
	useState,
} from "react";
import { projectFiles } from "../../../content/projectsLoader";
import { useSystemKeys } from "../../../store";
import { MobileContext } from "../../../store/MobileContext";
import { isMediaFile, type MediaFile } from "../../../store/types";
import Throbber from "../../Throbber";
import { InternalWindowDataContext } from "../../window/windowContext";
import { ExternalWindowDataContext } from "../../window/externalWindowContext";
import About from "./About";
import MainShowcase from "./MainShowcase";
import MediaFrame from "./MediaFrame";
import NextProject from "./NextProject";
import ProjectTitle from "./ProjectTitle";
import ShowcasePair from "./ShowcasePair";

interface MediaViewerProps {
	file?: MediaFile;
}

const MediaViewer = ({ file: fileProp }: MediaViewerProps = {}) => {
	const windowData = useContext(InternalWindowDataContext);
	const disableAdvance =
		useContext(ExternalWindowDataContext)?.disableAdvance ?? false;
	const isMobile = useContext(MobileContext);
	const { traverse, replaceWindow } = useSystemKeys(
		"traverse",
		"replaceWindow",
	);

	const sysObj = windowData?.sysObj;
	const id = windowData?.id;
	const setTitle = windowData?.setTitle;
	const file = fileProp ?? (isMediaFile(sysObj) ? sysObj : null);
	const projectData = file?.value;
	const title = file?.name.replaceAll("_", " ") ?? "";

	const parent = fileProp || !file ? undefined : traverse(file)?.at(-1);
	const projects = fileProp
		? projectFiles.filter(isMediaFile)
		: (parent?.children.filter(isMediaFile) ?? []);
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
	// Block repeat advances until the swapped project is pinned at the top.
	const phase = useRef<"watch" | "loading" | "settle">("watch");

	const pinTop = () =>
		new Promise<void>(resolve => {
			const el = scrollContainer.current;
			if (!el) {
				resolve();
				return;
			}

			el.scrollTop = 0;
			let frames = 0;
			const pinFrame = () => {
				el.scrollTop = 0;
				frames += 1;
				if (frames < 6) {
					requestAnimationFrame(pinFrame);
					return;
				}
				if (el.scrollTop < 2) phase.current = "watch";
				resolve();
			};
			requestAnimationFrame(pinFrame);
		});

	const advance = async () => {
		const upcoming = nextProject;

		if (
			phase.current !== "watch" ||
			!upcoming ||
			!scrollContainer.current ||
			!loadingRef.current ||
			id === undefined
		)
			return;

		phase.current = "loading";
		await animate(
			loadingRef.current,
			{ opacity: [0, 1] },
			{
				type: "tween",
				duration: 0.6,
				ease: steps(3),
			},
		);

		setInTop(true);
		phase.current = "settle";
		replaceWindow(id, upcoming);
		await pinTop();

		await animate(
			loadingRef.current,
			{ opacity: [1, 0] },
			{
				type: "tween",
				delay: 1.8,
				duration: 0.6,
				ease: steps(3),
			},
		);
	};

	const onScrollToAdvance = useEffectEvent(() => {
		if (phase.current !== "watch") return;
		const el = scrollContainer.current;
		if (!el) return;
		const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
		if (remaining < 8 && el.scrollTop > 2) advance();
	});

	useEffect(() => {
		const el = scrollContainer.current;
		if (!el || disableAdvance) return;
		// Arm only after the scroller has been away from the end, so a swap
		// that lands on the bottom cannot immediately start another load.
		let armed = false;
		const onScroll = () => {
			const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
			if (remaining > 48) armed = true;
			if (armed) onScrollToAdvance();
		};
		el.addEventListener("scroll", onScroll, { passive: true });
		return () => el.removeEventListener("scroll", onScroll);
	}, [disableAdvance, scrollContainer]);

	if (!file || !projectData || !nextProject) return;
	if (!fileProp && id === undefined) return;

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
				className="relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto text-white-primary [overflow-anchor:none]"
			>
				<div
					className="mx-4 h-[150%] min-h-250 text-white-primary mt-6 md:mt-12"
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
						key={showcase.src}
						className="relative m-4 mt-0 border-2 bg-black-primary"
					>
						<MediaFrame
							project={file.name}
							src={showcase.src}
							alt={showcase.alt}
							caption={showcase.caption}
							scrollContainer={scrollContainer}
							decorativeCursor={!isMobile}
						/>
					</div>
				))}
				{!disableAdvance && (
					<Suspense
						fallback={
							<div className="relative mt-12 h-40">
								<Throbber />
							</div>
						}
					>
						<button
							type="button"
							className="tab-only relative"
							onClick={advance}
						>
							Next project:{" "}
							{nextProject.name.replaceAll("_", " ")}
						</button>
						<NextProject
							project={nextProject}
							scrollContainer={scrollContainer}
							clipPath={clipPath}
							targetRef={scrollTarget2}
							onClick={advance}
						/>
					</Suspense>
				)}
			</div>
		</>
	);
};

export default MediaViewer;
