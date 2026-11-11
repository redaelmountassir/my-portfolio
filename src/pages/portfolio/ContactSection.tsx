import { contactWindow } from "./data";
import SectionTitle from "./SectionTitle";
import WindowSlot from "./WindowSlot";

const ContactSection = () => {
	if (!contactWindow) return null;

	return (
		<section
			id="contact"
			className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pt-16 pb-24 md:px-8"
		>
			<SectionTitle>Contact</SectionTitle>
			<WindowSlot windowData={contactWindow} />
		</section>
	);
};

export default ContactSection;
