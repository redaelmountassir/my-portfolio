import type { RefObject } from "react";
import handsGif from "../../../assets/images/hands.gif";
import mapImg from "../../../assets/images/map_watermark.png";
import Marquee from "../../Marquee";
import SmartImage from "../../SmartImage";
import MediaFrame from "./MediaFrame";

const ShowcasePair = ({
	project,
	showcases,
	scrollContainer,
	decorativeCursor,
}: {
	project: string;
	showcases: string[];
	scrollContainer: RefObject<HTMLElement | null>;
	decorativeCursor: boolean;
}) => (
	<div className="mx-4 mb-4 grid h-225 grid-cols-1 grid-rows-[1fr_0_auto_2fr] gap-4 overflow-hidden md:grid-cols-2 md:grid-rows-[50%_1fr_auto]! average:h-[150%] average:grid-rows-[1fr_150px_auto_2fr]">
		<div className="relative min-h-0 border-2 border-white-primary bg-black-primary">
			<MediaFrame
				project={project}
				src={showcases[1]}
				scrollContainer={scrollContainer}
				decorativeCursor={decorativeCursor}
			/>
		</div>
		<div className="relative overflow-hidden border-2 border-white-primary bg-black-primary">
			<SmartImage
				src={mapImg}
				alt="map watermark"
				className="absolute size-full object-contain"
			/>
			<img
				src={handsGif}
				alt="spinning shape"
				className="absolute size-full scale-75 object-contain"
			/>
		</div>
		<Marquee
			className="relative shrink-0 border-x-2 border-white-primary bg-white-primary text-4xl font-bold text-black-primary select-none"
			panTime={1000}
			steps={10000}
			pauseOnHover={false}
		>
			▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
		</Marquee>
		<div className="relative min-h-0 border-2 border-white-primary bg-black-primary md:col-start-2 md:row-span-3 md:row-start-1">
			<MediaFrame
				project={project}
				src={showcases[0]}
				scrollContainer={scrollContainer}
				decorativeCursor={decorativeCursor}
			/>
		</div>
	</div>
);

export default ShowcasePair;
