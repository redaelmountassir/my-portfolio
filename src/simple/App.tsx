import { useEffect, useRef, useState } from "react";
import type { SymbolName } from "../components/3D/Symbols";
import Background from "../components/Background";
import { MobileContext } from "../store/MobileContext";
import { useBreakpointMD, useBreakpointShort } from "../utils";
import Modifiers from "../components/Modifiers";
import About from "./components/About";
import Contact from "./components/Contact";
import { SECTIONS, type SectionId } from "./components/data";
import Hero from "./components/Hero";
import Nav from "./components/Nav";
import Projects from "./components/Projects";
import Resume from "./components/Resume";
import { resize } from "motion/react";

const SECTION_SYMBOLS_MAP = {
	top: "logo",
	projects: "computer",
	about: "bust",
	resume: "pen",
	contact: "phone",
} satisfies Record<SectionId, SymbolName>;

const Portfolio = () => {
	const wide = useBreakpointMD();
	const tall = useBreakpointShort();
	const isMobile = !wide || !tall;
	const [active, setActive] = useState<SectionId>("top");
	const mainContentRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const updateVH = () =>
			document.documentElement.style.setProperty(
				"--vh-full",
				`${window.innerHeight}px`,
			);
		const stop = resize(updateVH);
		updateVH();

		let frame = 0;
		const onScroll = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				const marker = 64;
				let current: SectionId = "top";
				for (const section of SECTIONS) {
					const el = document.getElementById(section.id);
					if (el && el.getBoundingClientRect().top <= marker)
						current = section.id;
				}
				setActive(prev => (prev === current ? prev : current));
				const hash = current === "top" ? "" : `#${current}`;
				if (window.location.hash !== hash) {
					history.replaceState(
						null,
						"",
						hash ||
							`${window.location.pathname}${window.location.search}`,
					);
				}
			});
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });

		return () => {
			cancelAnimationFrame(frame);

			window.removeEventListener("scroll", onScroll);
			stop();
			document.documentElement.style.removeProperty("--vh-full");
		};
	}, []);

	return (
		<MobileContext.Provider value={isMobile}>
			<a
				className="tab-only"
				href="#main-content"
				onClick={event => {
					event.preventDefault();
					mainContentRef.current?.focus();
				}}
			>
				Skip to main content
			</a>
			<div
				aria-hidden
				className="pointer-events-none fixed inset-0 -z-10"
			>
				<Background symbol={SECTION_SYMBOLS_MAP[active]} />
			</div>
			<Nav active={active} />
			<main
				ref={mainContentRef}
				id="main-content"
				tabIndex={-1}
				className="overflow-x-hidden text-white-primary"
			>
				<Hero />
				<Projects />
				<About />
				<Resume />
				<Contact />
			</main>
			<Modifiers />
		</MobileContext.Provider>
	);
};

export default Portfolio;
