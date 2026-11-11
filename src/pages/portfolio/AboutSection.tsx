import { aboutWindow } from "./data";
import SectionTitle from "./SectionTitle";
import WindowSlot from "./WindowSlot";

const AboutSection = () => {
	if (!aboutWindow) return null;

	return (
		<section
			id="about"
			className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16 md:px-8"
		>
			<SectionTitle>About</SectionTitle>
			<WindowSlot windowData={aboutWindow} />
		</section>
	);
};

export default AboutSection;
