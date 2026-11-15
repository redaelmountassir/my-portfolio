import GlitchText from "../../components/GlitchText";

const SectionTitle = ({ children }: { children: string }) => (
	<h2 className="font-display text-5xl leading-[0.95] uppercase md:text-6xl">
		<span className="sr-only">{children}</span>
		<GlitchText onScroll decayRate={0.5}>
			{children}
		</GlitchText>
	</h2>
);

export default SectionTitle;
