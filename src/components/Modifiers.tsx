import { motion } from "motion/react";
import { useShallow } from "zustand/react/shallow";
import staticVid from "../assets/videos/static.mp4";
import { useSettingsStore } from "../store";
import { map } from "../utils";

const Modifiers = () => {
	const [brightness, scanlines, useStatic, useFlicker] = useSettingsStore(
		useShallow(state => [
			state.brightness,
			state.scanlines,
			state.useStatic,
			state.useFlicker,
		]),
	);
	return (
		<>
			<div
				aria-hidden="true"
				className="pointer-events-none fixed top-0 size-full bg-black"
				style={{ opacity: map(brightness, 0, 100, 0.8, 0) }}
			/>
			{useStatic && (
				<video
					aria-hidden="true"
					className="pointer-events-none fixed top-0 size-full object-cover mix-blend-color-dodge"
					muted
					autoPlay
					loop
					playsInline
				>
					<source src={staticVid} type="video/mp4" />
				</video>
			)}
			{scanlines && (
				<motion.div
					aria-hidden="true"
					className="pointer-events-none fixed bottom-0 box-content size-full bg-linear-to-b from-transparent via-black bg-size-[100%_10px] bg-repeat-y pt-3 opacity-5"
					initial={{ y: 0 }}
					animate={{ y: 10 }}
					transition={{
						repeat: Infinity,
						duration: 2,
						ease: "linear",
					}}
				/>
			)}
			{useFlicker && (
				<div
					aria-hidden="true"
					className="pointer-events-none fixed top-0 size-full full-flicker bg-black/20"
				/>
			)}
		</>
	);
};

export default Modifiers;
