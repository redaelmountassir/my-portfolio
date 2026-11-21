import { useContext, useEffect } from "react";
import { InternalWindowDataContext } from "../window/windowContext";
import closeBtnDark from "../../assets/images/close_dark_sm.png";
import backBtn from "../../assets/images/back_arrow.png";
import reloadBtn from "../../assets/images/reload.png";
import throbberGif from "../../assets/images/stone.gif";
import SmartImage from "../SmartImage";

const SimpleBrowser = () => {
	const setTitle = useContext(InternalWindowDataContext)?.setTitle;

	useEffect(() => {
		setTitle?.("Simple Site");
		window.location.assign("/simwple/");
	}, [setTitle]);

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-gray-200 text-black-primary">
			<div
				aria-hidden
				className="flex h-11 shrink-0 items-end gap-2 bg-[#292631] px-3 pt-2"
			>
				<div
					className="flex h-9 max-w-60 min-w-32 items-center translate-y-0.5 pb-0.5 gap-2 bg-gray-200 px-3 text-sm"
				>
					<span
						aria-hidden
						className="size-2 bg-purple-accent"
					/>
					<span className="truncate">Simple Site</span>
					<SmartImage
						src={closeBtnDark}
						alt=""
						className="size-4"
					/>
				</div>
				<div
					className="mb-2 relative outline-2 size-6 transition ease-steps-10 text-white-primary hover:bg-white-primary/15"
				>
					<div className="h-0.5 w-2.5 top-1/2 absolute bg-gray-200 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
					<div className="w-0.5 h-2.5 top-1/2 absolute bg-gray-200 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
				</div>
			</div>
			<div
				aria-hidden
				className="flex h-12 shrink-0 items-center gap-2 bg-gray-200 px-3"
			>
				<div
					className="flex size-8 items-center transition ease-steps-10 justify-center text-lg hover:bg-black/10"
				>
					<SmartImage src={backBtn} alt="" className="size-4" />
				</div>
				<div
					className="flex size-8 items-center transition ease-steps-10 justify-center text-lg hover:bg-black/10"
				>
					<SmartImage src={reloadBtn} alt="" className="size-4" />
				</div>
				<div
					className="flex min-w-0 flex-1 items-center gap-2 bg-white-primary px-4 py-2 text-sm shadow-sm"
				>
					<div aria-hidden className="bg-green-700 size-1.5" />
					<span className="truncate">
						{window.location.host}/simple/
					</span>
				</div>
				<div
					className="size-8 flex-col flex items-center justify-center gap-0.5 text-xl hover:bg-black-primary/10"
				>
					<div className="size-1 bg-black-primary"></div>
					<div className="size-1 bg-black-primary"></div>
					<div className="size-1 bg-black-primary"></div>
				</div>
			</div>
			<main
				role="presentation"
				className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-white-primary p-8 text-center"
			>
				<div className="max-w-lg">
					<img src={throbberGif} alt="" className="mx-auto size-32" />
					<p aria-hidden className="mb-2 text-2xl font-semibold">
						Opening the portfolio
					</p>
					<p className="text-dark-primary">
						<span aria-hidden>Loading the simpler view. </span>
						<a className="text-blue-accent group underline" href="/simple/">
							Continue if you are not redirected<span aria-hidden className="inline-block transition ease-steps-10 opacity-0 translate-x-5 group-focus:opacity-100 group-focus:outline-0! group-focus:translate-x-0 group-hover:opacity-100 group-hover:translate-x-0 pl-2">{">"}</span>
						</a>
					</p>
				</div>
			</main>
		</div>
	);
};

export default SimpleBrowser;
