import GlitchText from "../../components/GlitchText";
import { HERO } from "./data";

const HeroSection = () => (
	<section
		id="top"
		className="flex min-h-(--vh-full,100dvh) items-end px-4 pt-16 pb-16 md:px-10 md:pb-24"
	>
		<div className="w-full max-w-4xl border-2 border-white-primary bg-black-primary/80 p-6 shadow-[10px_10px_0_0] shadow-black-primary/40 md:p-10">
			<p className="mb-4 tracking-wide text-yellow-accent">
				{HERO.kicker}
			</p>
			<h1 className="font-display text-5xl leading-[0.95] uppercase md:text-8xl">
				<span className="sr-only">{HERO.title}</span>
				<GlitchText onLoad className="ss02 ss01">
					{HERO.title}
				</GlitchText>
			</h1>
			<p className="mt-6 max-w-xl leading-7">{HERO.line}</p>
		</div>
	</section>
);

export default HeroSection;
