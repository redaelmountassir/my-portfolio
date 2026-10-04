import { motion } from "motion/react";
import { useState } from "react";
import columnImg from "../../../assets/images/column.png";
import dolphinImg from "../../../assets/images/dolphin.png";
import throbberGif from "../../../assets/images/throbber.gif";
import { cn } from "../../../utils";
import SmartImage from "../../SmartImage";

const PDFNoSupport = () => {
	const [dowloaded, setDowloaded] = useState(false);

	return (
		<div className="relative size-full overflow-hidden bg-black-primary">
			<h3 className="dlig ss02 pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-7xl text-white-primary">
				{Array.from({ length: 11 }, (_, i) => (
					<motion.span
						key={i}
						className="block"
						initial={{
							opacity: 1 - Math.abs(i / 10 - 0.5) * 1.5,
						}}
						animate={{
							opacity: 0.1,
						}}
						transition={{
							repeat: Infinity,
							delay: Math.abs(i / 10 - 0.5) * 4,
							duration: 2,
						}}
					>
						DOWNLOAD
					</motion.span>
				))}
			</h3>
			<a
				href="./resume.pdf"
				download="resume.pdf"
				aria-label={
					dowloaded ? "Downloading resume" : "Download resume"
				}
				aria-busy={dowloaded}
				className={cn(
					"absolute top-1/2 left-1/2 z-1 flex h-16 w-44 -translate-x-1/2 -translate-y-1/2 items-center justify-center border-2 bg-black-primary text-lg text-white-primary transition-all ease-out hover:bg-white-primary hover:text-black-primary focus-visible:bg-white-primary focus-visible:text-black-primary",
					dowloaded && "size-28",
				)}
				onClick={() => !dowloaded && setDowloaded(true)}
			>
				{dowloaded ? (
					<img
						src={throbberGif}
						alt=""
						aria-hidden="true"
						className="w-16"
					/>
				) : (
					"Tap to download"
				)}
			</a>
			<SmartImage
				src={columnImg}
				alt=""
				aria-hidden="true"
				className="absolute top-1/2 left-1/2 h-110 -translate-x-1/2 -translate-y-1/2"
			/>
			<SmartImage
				src={dolphinImg}
				alt=""
				aria-hidden="true"
				className="absolute top-1/4 left-1/4 h-28 -translate-x-1/2 -translate-y-1/2 -rotate-45"
			/>
			<SmartImage
				src={dolphinImg}
				alt=""
				aria-hidden="true"
				className="absolute top-3/4 left-3/4 h-36 -translate-x-1/2 -translate-y-1/2"
			/>
		</div>
	);
};

export default PDFNoSupport;
