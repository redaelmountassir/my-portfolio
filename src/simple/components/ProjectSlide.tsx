import {
	resize,
	motion,
	useTransform,
	type MotionValue,
} from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import type { MediaFile } from "../../store/types";
import WindowSlot from "./WindowSlot";

const ProjectSlide = ({
	slide,
	count,
	index,
	active,
	project,
	closed,
	onClose,
}: {
	slide: number;
	count: number;
	index: MotionValue<number>;
	active: boolean;
	project: MediaFile;
	closed: boolean;
	onClose: (name: string) => void;
}) => {
	const slideRef = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState(0);

	useLayoutEffect(() => {
		const el = slideRef.current;
		if (!el) return;
		return resize(el, el => setWidth(el.clientWidth));
	}, []);

	const rotateY = useTransform(index, value => {
		const delta = slide - wrapIndex(value, count);
		const clamped = Math.max(-1, Math.min(1, delta));
		return clamped * 90;
	});

	return (
		<motion.div
			ref={slideRef}
			className="absolute inset-0"
			style={{
				rotateY,
				transformOrigin: `50% 50% ${-width / 2}px`,
				backfaceVisibility: "hidden",
			}}
		>
			<WindowSlot
				aria-hidden={!active}
				inert={!active}
				backfaceHidden
				className="h-full w-full overflow-hidden shadow-none"
				closed={closed}
				onClose={() => onClose(project.name)}
				windowData={{
					id: slide + 1,
					sysObj: project,
					type: "MediaViewer",
				}}
			/>
		</motion.div>
	);
};

const wrapIndex = (value: number, count: number) => {
	if (count <= 0) return 0;
	let wrapped = value;
	while (wrapped > count + 1) wrapped -= count;
	while (wrapped < 0) wrapped += count;
	return wrapped;
};

export default ProjectSlide;
