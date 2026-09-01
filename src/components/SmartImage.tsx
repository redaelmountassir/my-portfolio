import type { ImgHTMLAttributes } from "react";

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
	src: ImportedImage;
	alt: string;
};

const SmartImage = ({ src, ...props }: ImageProps) => {
	return <img {...src} {...props} />;
};

export default SmartImage;
