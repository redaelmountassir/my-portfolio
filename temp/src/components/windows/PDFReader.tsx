import React, { useContext, useEffect, useState } from "react";
import { WindowDataContext } from "../Window";
import throbberGif from "../../images/throbber.gif";
import { motion } from "framer-motion";
import { MobileContext } from "../OS";
import { StaticImage } from "gatsby-plugin-image";

const PDFReader = () => {
	const { setTitle, sysObj } = useContext(WindowDataContext) ?? {};
	useEffect(() => {
		if (setTitle && sysObj) setTitle(`${sysObj.name}.pdf - PDF Reader`);
	}, [sysObj]);

	const mobile = useContext(MobileContext);

	if (mobile) return <PDFNoSupport />;
	return (
		<object
			data="./resume.pdf"
			type="application/pdf"
			width="100%"
			height="100%"
			className="flex-1"
		>
			<iframe
				src="./resume.pdf"
				width="100%"
				height="100%"
				className="h-full flex-1 border-none"
			>
				<PDFNoSupport />
			</iframe>
		</object>
	);
};

const PDFNoSupport = () => {
	const [dowloaded, setDowloaded] = useState(false);

	return (
		<div className="relative  h-full w-full overflow-hidden bg-black-primary">
			<a
				href="./resume.pdf"
				download="resume.pdf"
				className={`absolute left-1/2 top-1/2 z-50 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center border-2 border-white-primary bg-black-primary text-lg text-white-primary transition-all ease-out hover:bg-white-primary hover:text-black-primary ${dowloaded ? "h-28 w-28" : "h-16 w-44"}`}
				onClick={() => !dowloaded && setDowloaded(true)}
			>
				{dowloaded ? (
					<img src={throbberGif} alt="Throbber" className="w-16" />
				) : (
					"Tap to download"
				)}
			</a>
			<h3 className="dlig ss02 pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-7xl text-white-primary">
				{[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((_, i, arr) => (
					<motion.span
						key={i}
						className="block"
						initial={{
							opacity: 1 - Math.abs(i / (arr.length - 1) - 0.5) * 1.5,
						}}
						animate={{
							opacity: 0.1,
						}}
						transition={{
							repeat: Infinity,
							delay: Math.abs(i / (arr.length - 1) - 0.5) * 4,
							duration: 2,
						}}
					>
						DOWNLOAD
					</motion.span>
				))}
			</h3>
			<StaticImage
				src="../../images/column.png"
				height={450}
				alt="greek column"
				layout="fixed"
				placeholder="none"
				imgClassName="transition-none"
				className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
			/>
			<StaticImage
				src="../../images/dolphin.png"
				alt="dolphin"
				placeholder="none"
				height={112}
				layout="fixed"
				className="absolute left-1/4 top-1/4 -translate-x-1/2 -translate-y-1/2 -rotate-45"
			/>
			<StaticImage
				src="../../images/dolphin.png"
				alt="dolphin"
				placeholder="none"
				height={144}
				layout="fixed"
				className="absolute left-3/4 top-3/4 -translate-x-1/2 -translate-y-1/2"
			/>
		</div>
	);
};
export default PDFReader;
