import { useCallback, useEffect, useState } from "react";
import Background3D from "../components/Background3D";
import { MobileContext } from "../store/MobileContext";
import type { MediaFile } from "../store/types";
import { useBreakpointMD, useBreakpointShort } from "../utils";
import AboutSection from "./portfolio/AboutSection";
import ContactSection from "./portfolio/ContactSection";
import { projectAnchor, SECTIONS, type SectionId } from "./portfolio/data";
import HeroSection from "./portfolio/HeroSection";
import PortfolioNav from "./portfolio/PortfolioNav";
import ProjectsSection from "./portfolio/ProjectsSection";

const Portfolio = () => {
	const wide = useBreakpointMD();
	const tall = useBreakpointShort();
	const isMobile = !wide || !tall;
	const [active, setActive] = useState<SectionId>("top");

	useEffect(() => {
		const updateVH = () =>
			document.documentElement.style.setProperty(
				"--vh-full",
				`${window.innerHeight}px`,
			);
		window.addEventListener("resize", updateVH);
		window.addEventListener("orientationchange", updateVH);
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
			});
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });

		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener("resize", updateVH);
			window.removeEventListener("orientationchange", updateVH);
			window.removeEventListener("scroll", onScroll);
			document.documentElement.style.removeProperty("--vh-full");
		};
	}, []);

	const showProject = useCallback((next: MediaFile) => {
		const behavior = window.matchMedia("(prefers-reduced-motion: reduce)")
			.matches
			? "auto"
			: "smooth";
		document.getElementById(projectAnchor(next.name))?.scrollIntoView({
			behavior,
			block: "start",
		});
	}, []);

	return (
		<MobileContext.Provider value={isMobile}>
			<div
				aria-hidden="true"
				className="pointer-events-none fixed inset-0 -z-10"
			>
				<Background3D />
			</div>
			<PortfolioNav active={active} />
			<main className="text-white-primary">
				<HeroSection />
				<ProjectsSection onNext={showProject} />
				<AboutSection />
				<ContactSection />
			</main>
		</MobileContext.Provider>
	);
};

export default Portfolio;
