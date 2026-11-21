import SectionTitle from "./SectionTitle";

const Resume = () => (
	<section
		id="resume"
		className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-16 md:px-8"
	>
		<SectionTitle>• Resume</SectionTitle>
		<p>
			<a
				href="/resume.pdf"
				target="_blank"
				rel="noreferrer"
				className="font-bold bg-black-primary/80 p-2 border-2 text-yellow-accent underline underline-offset-4 focus-visible:text-white-primary"
			>
				{">"} Download Resume
			</a>
		</p>
		<iframe
			title="Resume of Reda Elmountassir"
			src="/resume.pdf"
			className="h-[75vh] min-h-96 w-full border-2 border-white-primary bg-white"
			loading="lazy"
		/>
	</section>
);

export default Resume;
