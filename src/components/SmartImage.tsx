import type { ImgHTMLAttributes } from "react";
import { cn } from "../utils";

type ImageProps = Omit<
	ImgHTMLAttributes<HTMLImageElement>,
	"src" | "alt" | "width" | "height"
> & {
	src: ImportedImage;
	alt: string;
};

const SmartImage = ({ src, ...props }: ImageProps) => {
	return (
		<img {...src} {...props} className={cn("h-auto w-auto", props.className)} />
	);
};

export default SmartImage;
