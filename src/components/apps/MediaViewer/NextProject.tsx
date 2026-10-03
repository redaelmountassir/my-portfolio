import type { MotionValue } from "motion/react";
import type { RefObject } from "react";
import GlitchText from "../../GlitchText";
import Showcase from "./Showcase";
import type { MediaFile } from "./types";

const NextProject = ({
	project,
	scrollContainer,
	clipPath,
	targetRef,
	onClick,
}: {
	project: MediaFile;
	scrollContainer: RefObject<HTMLElement | null>;
	clipPath: MotionValue<string>;
	targetRef: RefObject<null>;
	onClick: () => void;
}) => (
	<div className="mt-12 h-[300%]" ref={targetRef}>
		<div
			className="sticky top-0 h-1/3 cursor-pointer bg-black-primary text-white-primary outline-2 outline-white-primary"
			onClick={onClick}
		>
			<Showcase
				key={`${project.name}:${project.value.showcases[0]}`}
				project={project.name}
				src={project.value.showcases[0]}
				animation={{ style: { clipPath } }}
			/>
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
					{project.name
						.split("_")
						.map((str, i) =>
							(i + 1) % 2 == 0 ? `\n• ${str}` : str,
						)}
				</h3>
			</div>
		</div>
	</div>
);

export default NextProject;
