import { use } from "react";
import SmartImage from "../../components/SmartImage";
import { resolveProjectAsset } from "../../content/projectsLoader";

const ProjectLogo = ({ name }: { name: string }) => {
	const logo = use(
		resolveProjectAsset(name, "logo.png") as Promise<ImportedImage>,
	);

	return (
		<SmartImage
			src={logo}
			alt=""
			draggable="false"
			className="m-2 size-16 object-contain"
		/>
	);
};

export default ProjectLogo;
