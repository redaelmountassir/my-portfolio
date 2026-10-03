import type { MotionValue } from "motion/react";
import type { RefObject } from "react";
import GlitchText from "../../GlitchText";
import ScrollMarquee from "../../ScrollMarquee";
import Tag from "./Tag";

const About = ({
	title,
	description,
	tags,
	scrollY,
	scrollContainer,
}: {
	title: string;
	description: string;
	tags: string[];
	scrollY: MotionValue<number>;
	scrollContainer: RefObject<HTMLElement | null>;
}) => (
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
			<p className="relative mb-2 w-full">{description}</p>
			{tags.map(tag => (
				<Tag bg="random" key={tag} className="relative">
					{tag}
				</Tag>
			))}
		</div>
	</div>
);

export default About;
