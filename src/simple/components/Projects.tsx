import {
	animate,
	easeOut,
	motion,
	steps,
	useMotionValue,
	useReducedMotion,
	type AnimationPlaybackControls,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ExternalWindowDataContext } from "../../components/window/externalWindowContext";
import { projects } from "./data";
import ProjectPick from "./ProjectPick";
import ProjectSlide from "./ProjectSlide";
import SectionTitle from "./SectionTitle";

const pageOf = (value: number, count: number) => {
	let page = value;
	while (page > count) page -= count;
	while (page < 1) page += count;
	return page;
};

// 0 is a clone of the last slide. 1..count are the real slides.
// count + 1 is a clone of the first slide.
const wrapIndex = (value: number, count: number) => {
	if (count <= 0) return 0;
	let wrapped = value;
	while (wrapped > count + 1) wrapped -= count;
	while (wrapped < 0) wrapped += count;
	return wrapped;
};

const Projects = () => {
	const count = projects.length;
	const index = useMotionValue(1);
	const target = useRef(1);
	const playback = useRef<AnimationPlaybackControls | null>(null);
	const sequence = useRef(0);
	const [visual, setVisual] = useState(1);
	const [closedProjects, setClosedProjects] = useState<Set<string>>(
		() => new Set(),
	);
	const reduce = useReducedMotion();

	useEffect(() => () => playback.current?.stop(), []);

	const sectionRef = useRef<HTMLElement>(null);

	// `distance` is how many projects the move covers. Neighbors keep the
	// original half-second flip; longer jumps stay stepped, but snappier.
	const moveTo = (next: number, distance: number) => {
		if (count <= 1) return;
		const id = ++sequence.current;
		playback.current?.stop();

		if (reduce) {
			const page = pageOf(next, count);
			target.current = page;
			index.set(page);
			setVisual(page);
			return;
		}

		const span = Math.max(1, distance);
		target.current = next;
		setVisual(wrapIndex(next, count));
		playback.current = animate(index, next, {
			duration: Math.min(0.85, 0.5 * span),
			ease: t => easeOut(steps(8 * Math.round(span))(t)),
			onComplete: () => {
				if (sequence.current !== id) return;
				const page = pageOf(next, count);
				target.current = page;
				index.set(page);
				setVisual(page);
			},
		});
	};

	const go = (delta: number) => {
		if (count <= 1) return;
		// Page from the in-flight destination, so extra clicks leap
		// instead of restarting from wherever the track currently sits.
		moveTo(target.current + delta, 1);
	};

	const select = (page: number) => {
		if (count <= 1 || page < 1 || page > count) return;
		const fromPage = pageOf(target.current, count);
		let delta = page - fromPage;
		if (delta > count / 2) delta -= count;
		if (delta < -count / 2) delta += count;
		if (delta === 0) return;

		const next = target.current + delta;
		// The track can only pass through the cloned edge by one slide.
		// A longer wrap would teleport mid-flip, so jump straight there.
		if (next < 0 || next > count + 1) {
			sequence.current += 1;
			playback.current?.stop();
			target.current = page;
			index.set(page);
			setVisual(page);
			return;
		}
		moveTo(next, Math.abs(delta));
	};

	const choose = (page: number) => {
		select(page);
		sectionRef.current?.scrollIntoView({
			behavior: reduce ? "auto" : "smooth",
			block: "end",
		});
	};

	const closeProject = (name: string) => {
		setClosedProjects(current => {
			const next = new Set(current);
			next.add(name);
			return next;
		});
	};

	if (count === 0) return null;

	const shown = visual <= 0 ? count : visual > count ? 1 : visual;
	const loop = [projects[count - 1], ...projects, projects[0]];
	const indexed = projects.map((project, item) => ({
		project,
		page: item + 1,
		name: project.name.replaceAll("_", " "),
	}));
	const featured = indexed.slice(0, 3);
	const rest = indexed.slice(3);

	return (
		<section
			ref={sectionRef}
			id="projects"
			aria-roledescription="carousel"
			aria-label="Projects"
			className="mx-auto flex min-h-(--vh-full,100dvh) w-full max-w-6xl flex-col gap-4 px-4 pt-16 pb-6 md:px-8"
		>
			<div className="flex items-end justify-between gap-4">
				<SectionTitle>• Projects</SectionTitle>
				<p
					aria-live="polite"
					className="pb-1 font-bold text-yellow-accent tabular-nums"
				>
					{String(shown).padStart(2, "0")}
					<span className="text-white-primary">
						{" / "}
						{String(count).padStart(2, "0")}
					</span>
				</p>
			</div>
			<nav
				aria-label="Choose a project"
				className="relative z-1 flex flex-col gap-1.5 pb-1"
			>
				<div className="grid grid-cols-3 gap-1.5">
					{featured.map(item => (
						<ProjectPick
							key={item.project.name}
							page={item.page}
							projectName={item.project.name}
							name={item.name}
							active={shown === item.page}
							featured
							onChoose={choose}
						/>
					))}
				</div>
				<div className="flex flex-wrap gap-1.5">
					{rest.map(item => (
						<ProjectPick
							key={item.project.name}
							page={item.page}
							projectName={item.project.name}
							name={item.name}
							active={shown === item.page}
							featured={false}
							onChoose={choose}
						/>
					))}
				</div>
			</nav>
			<div className="flex items-center gap-2 md:gap-3">
				<button
					type="button"
					aria-label="Previous project"
					onClick={() => go(-1)}
					className="z-1 hidden sm:block shrink-0 self-center border-2 border-white-primary bg-black-primary px-2.5 py-4 text-2xl leading-none text-white-primary shadow-[4px_4px_0_0] shadow-black-primary/40 transition ease-steps-10 hover:bg-white-primary hover:text-black-primary md:px-3"
				>
					←
				</button>
				<div
					className="h-[85vh] min-h-112 min-w-0 flex-1 overflow-visible"
					style={{ perspective: 1000 }}
				>
					<motion.div className="relative h-full w-full">
						<ExternalWindowDataContext.Provider
							value={{ disableAdvance: true }}
						>
							{loop.map((project, slide) => (
								<ProjectSlide
									key={`${project.name}-${slide}`}
									slide={slide}
									count={count}
									index={index}
									active={slide === visual}
									project={project}
									closed={closedProjects.has(project.name)}
									onClose={closeProject}
								/>
							))}
						</ExternalWindowDataContext.Provider>
					</motion.div>
				</div>
				<button
					type="button"
					aria-label="Next project"
					onClick={() => go(1)}
					className="z-1 hidden sm:block shrink-0 self-center border-2 border-white-primary bg-black-primary px-2.5 py-4 text-2xl leading-none text-white-primary shadow-[4px_4px_0_0] shadow-black-primary/40 transition ease-steps-10 hover:bg-white-primary hover:text-black-primary md:px-3"
				>
					→
				</button>
			</div>
		</section>
	);
};

export default Projects;
