import { motion, steps, useInView, type HTMLMotionProps } from "motion/react";
import { use, useRef, type RefObject } from "react";
import { readProjectAsset } from "../../../content/projectsLoader";
import { cn } from "../../../utils";
import Follow from "../../Follow";
import SmartImage from "../../SmartImage";

interface ShowcaseProps {
	project: string;
	src: string;
	className?: string;
	autoHeight?: boolean;
	animation?:
		| {
				scrollContainer: RefObject<Element | null>;
		  }
		| HTMLMotionProps<"div">;
	decorativeCursor?: boolean;
}

const Showcase = ({
	project,
	src,
	className,
	autoHeight = false,
	animation = undefined,
	decorativeCursor = false,
}: ShowcaseProps) => {
	const classes = cn(
		"flicker relative z-1 scale-by-height object-cover size-full!",
		autoHeight && "h-auto!",
		className,
	);

	const revealRef = useRef<HTMLDivElement>(null);
	const scrollRoot =
		animation && "scrollContainer" in animation
			? animation.scrollContainer
			: undefined;
	const isInView = useInView(revealRef, {
		root: scrollRoot,
		once: true,
	});

	const asset = use(readProjectAsset(project, src));

	const customAnim = !scrollRoot;

	return (
		<motion.div
			ref={revealRef}
			className={cn(
				"size-full",
				decorativeCursor && "relative cursor-none",
			)}
			{...(customAnim
				? animation
				: {
						initial: {
							clipPath: "inset(0 100% 0 0)",
						},
						animate: {
							clipPath: isInView
								? "inset(0 0% 0 0)"
								: "inset(0 100% 0 0)",
						},
						transition: {
							duration: 1,
							ease: steps(10),
							type: "tween",
						},
					})}
		>
			{typeof asset === "string" ? (
				<video
					key={asset}
					src={asset}
					muted
					autoPlay
					playsInline
					loop
					className={classes}
				/>
			) : (
				<SmartImage
					src={asset}
					alt="Showcase for project"
					className={classes}
				/>
			)}
			{decorativeCursor && <Follow />}
		</motion.div>
	);
};

export default Showcase;
