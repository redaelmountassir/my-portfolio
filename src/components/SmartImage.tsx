import { cn } from "../utils";

type ImageProps = Omit<
	React.ComponentPropsWithRef<"img">,
	"src" | "alt" | "width" | "height"
> & {
	src: ImportedImage;
	alt: string;
	ref?: React.RefObject<HTMLImageElement | null>;
};

const SmartImage = ({ src, ...props }: ImageProps) => (
	<img {...src} {...props} className={cn("size-auto", props.className)} />
);

export default SmartImage;
