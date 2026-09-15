import { useEffect, useRef } from "react";
import { randomChar } from "../utils";

const APPROX_CHAR_W = 15;
const APPROX_CHAR_H = 35;

const GlitchWall = ({ duration = 6000, enable = false }) => {
	const textRef = useRef<HTMLParagraphElement>(null);

	//Doesn't create a new array every frame now
	const charCount = Math.ceil(
		(window.innerWidth / APPROX_CHAR_W) *
			(window.innerHeight / APPROX_CHAR_H) +
			100,
	);

	useEffect(() => {
		if (!enable) return;

		const interval = setInterval(() => {
			if (!textRef.current) return;
			textRef.current.textContent = Array.from(
				{ length: charCount },
				randomChar,
			).join("");
		}, 60);

		let timeout = -1;
		if (duration !== Infinity)
			timeout = setTimeout(() => clearInterval(interval), duration);

		return () => {
			clearInterval(interval);
			clearTimeout(timeout);
		};
	}, [enable, duration]);

	return (
		<p
			className="pointer-events-none absolute top-1/2 -z-1 size-full -translate-y-1/2 text-center text-3xl break-all text-purple-watermark opacity-40"
			ref={textRef}
		/>
	);
};

export default GlitchWall;
