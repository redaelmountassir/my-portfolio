import { useEffect, useRef } from "react";
import { cn } from "../utils";
import SmartImage from "./SmartImage";

interface ShowcaseProps {
	src: string | ImportedImage;
	className?: string;
	autoHeight?: boolean;
}

const Showcase = ({ src, className, autoHeight = false }: ShowcaseProps) => {
	const classes = cn(
		"flicker relative z-1 scale-by-height object-cover !size-full",
		autoHeight && "!h-auto",
		className,
	);

	const videoRef = useRef<HTMLVideoElement>(null);
	useEffect(() => videoRef.current?.load(), [src]);

	if (typeof src === "string") {
		return (
			<video
				ref={videoRef}
				muted
				autoPlay
				playsInline
				loop
				className={classes}
			>
				<source src={src} type="video/mp4" />
				Your browser does not support the video tag.
			</video>
		);
	}

	return (
		<SmartImage src={src} alt="Showcase for project" className={classes} />
	);
};

export default Showcase;
