import type { RefObject } from "react";
import GlitchText from "../../GlitchText";

const ProjectTitle = ({
	title,
	scrollContainer,
	headingRef,
}: {
	title: string;
	scrollContainer: RefObject<HTMLElement | null>;
	headingRef: RefObject<HTMLHeadingElement | null>;
}) => (
	<h2
		ref={headingRef}
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
	</h2>
);

export default ProjectTitle;
