import { use } from "react";
import { readProjectAsset } from "../../../content/projectsLoader";
import PixelDissolveMedia from "./PixelDissolveMedia";

const TOTAL_DURATION = 0.75;
const HALF_DURATION = TOTAL_DURATION / 2;

const MainShowcaseMedia = ({
	project,
	src,
	dissolved,
	onDissolveComplete,
}: {
	project: string;
	src: string;
	dissolved: boolean;
	onDissolveComplete: () => void;
}) => {
	const asset = use(readProjectAsset(project, src));

	return (
		<div className="relative z-1 size-full flicker">
			<PixelDissolveMedia
				media={asset}
				dissolved={dissolved}
				duration={HALF_DURATION}
				onComplete={onDissolveComplete}
			/>
		</div>
	);
};

export default MainShowcaseMedia;
