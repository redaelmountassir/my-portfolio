import { cn } from "../utils";

type ImageProps = Omit<
	React.ComponentPropsWithRef<"img">,
	"src" | "alt" | "width" | "height"
> & {
	src: ImportedImage;
	alt: string;
	lg?: boolean;
	ref?: React.RefObject<HTMLImageElement | null>;
};

const SmartImage = ({ src, lg, className, ...props }: ImageProps) => (
	<img
		{...src}
		loading={lg == true ? "eager" : undefined}
		fetchPriority={lg == true ? "high" : undefined}
		className={cn("size-auto", className)}
		decoding={lg == true ? "async" : undefined}
		{...props}
	/>
);

export default SmartImage;
