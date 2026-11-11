import type { MediaFile } from "../../store/types";
import { projectAnchor, projects } from "./data";
import SectionTitle from "./SectionTitle";
import WindowSlot from "./WindowSlot";

const ProjectsSection = ({
	onNext,
}: {
	onNext: (next: MediaFile) => void;
}) => (
	<section
		id="projects"
		className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16 md:px-8"
	>
		<SectionTitle>Projects</SectionTitle>
		{projects.map((project, index) => (
			<WindowSlot
				key={project.name}
				id={projectAnchor(project.name)}
				windowData={{
					id: index + 1,
					sysObj: project,
					type: "MediaViewer",
				}}
				onNext={onNext}
			/>
		))}
	</section>
);

export default ProjectsSection;
