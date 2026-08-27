import { GatsbyImage, IGatsbyImageData, getImage } from "gatsby-plugin-image";
import React, { useEffect, useRef } from "react";

const Showcase: React.FC<{
	src: string | IGatsbyImageData;
	className?: string;
	autoHeight?: boolean;
}> = ({ src, className, autoHeight = false }) => {
	const classes = `${className} flicker relative z-10 object scale-by-height object-cover !w-full ${autoHeight ? "!h-auto" : "!h-full"}`;

	const videoRef = useRef<HTMLVideoElement>(null);
	useEffect(() => videoRef.current?.load(), [src]);

	if (typeof src === "string") {
		return (
			<video ref={videoRef} muted autoPlay playsInline loop className={classes}>
				<source src={src} type="video/mp4" />
				Your browser does not support the video tag.
			</video>
		);
	}

	const img = getImage(src);
	if (!img) {
		console.error("Not found", img);
		return;
	}
	return (
		<GatsbyImage
			alt={`Showcase for project`}
			image={img}
			className={classes}
			imgClassName="!transition-none !relative group-hover:scale-150"
			objectFit="cover"
		/>
	);
};

export default Showcase;
