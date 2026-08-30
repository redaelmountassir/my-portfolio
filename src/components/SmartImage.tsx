import type { ImgHTMLAttributes } from "react";

type ImageData = {
	src: string;
	width: number;
	height: number;
};

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
	src: ImageData;
};

const SmartImage = ({ src, ...props }: ImageProps) => {
	return <img {...src} {...props} />;
};

export default SmartImage;
