import { StaticImage } from "gatsby-plugin-image";
import React, { useState } from "react";
import { useTimeout } from "../utils";

const Tippy: React.FC<{ children: string }> = ({ children }) => {
	const [closed, setClosed] = useState(false);
	useTimeout(() => !closed && setClosed(true), 15000); // Auto-close after awhile

	return (
		<div
			className="absolute bottom-16 z-40 flex w-full items-center gap-4 border-4 border-black-primary bg-yellow-accent p-2 text-black-primary transition-all duration-500 ease-steps10 md:bottom-10 md:right-4 md:w-2/5 short:bottom-20"
			style={{ clipPath: closed ? "inset(0 0 0 100%)" : "inset(0 0 0 0)" }}
		>
			<div
				className="animate-left-to-right h-20 min-w-20 bg-cover"
				style={{ backgroundImage: "url('/bg_imgs/tippy.png')" }}
				title="please don't hover on Tippy, it makes him uncomfortable"
			/>
			<span className="flex-1 py-2">
				<button
					type="button"
					onClick={() => setClosed(true)}
					className="float-right mb-6 ml-6 inline-block"
				>
					<StaticImage
						src="../images/close_dark.png"
						layout="fixed"
						placeholder="none"
						className="origin-top-right scale-[2]"
						title="please don't hover on Tippy, it makes him uncomfortable"
						alt="Tippy, you're virtual assistant to the operating system"
					/>
				</button>
				{children}
			</span>
		</div>
	);
};

export default Tippy;
