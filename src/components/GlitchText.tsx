import { inView } from "motion/react";
import React, { useEffect, useRef } from "react";
import { randomChar } from "../utils";

interface GlitchTextProps {
	children: string;
	className?: string;
	animated?: boolean;
	onLoad?: boolean | number;
	onScroll?: boolean;
	scrollRoot?: React.RefObject<Element>;
	decay?: boolean;
	decayRate?: number;
	onComplete?: Function;
}

const GlitchText = ({
	children,
	animated,
	className,
	onLoad = false,
	onScroll = false,
	scrollRoot,
	decay = true,
	decayRate = 1,
	onComplete,
}: GlitchTextProps) => {
	const text = useRef<HTMLSpanElement>(null);
	const interval = useRef(-1);
	const iterations = useRef(0);

	useEffect(
		() => {
			if (!text.current) return;
			clearInterval(interval.current);
			const begin = () => {
				if (interval.current !== -1) return;
				interval.current = setInterval(() => {
					if (!text.current) return;
					if (iterations.current > children.length) {
						clearInterval(interval.current);
						interval.current = -1;
						onComplete && onComplete();
						return;
					}

					text.current.textContent = children
						.split("")
						.map((_, i) =>
							(decay && i < iterations.current) || children[i] == " "
								? children[i]
								: randomChar(),
						)
						.join("");
					iterations.current += decayRate;
				}, 30);
			};

			if (animated || onLoad || onScroll) {
				if (onScroll)
					inView(text.current, begin, {
						root: scrollRoot?.current ?? undefined,
						amount: 0.7,
					});
				else if (typeof onLoad === "number") setTimeout(begin, onLoad);
				else begin();
			} else if (text.current) {
				text.current.textContent = children;
				iterations.current = 0;
			}

			return () => {
				clearInterval(interval.current);
				interval.current = -1;
			};
		},
		onLoad || onScroll ? [text.current] : [animated, text.current],
	);

	return (
		<span className={className} ref={text}>
			{children}
		</span>
	);
};

export default GlitchText;
