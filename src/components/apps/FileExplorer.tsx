import { useContext, useEffect, useState } from "react";
import sunImg from "../../assets/images/circle.png";
import listModeImg from "../../assets/images/list_mode.png";
import tileModeImg from "../../assets/images/tile_mode.png";
import { useSystemKeys } from "../../store";
import { cn } from "../../utils";
import GlitchText from "../GlitchText";
import Marquee from "../Marquee";
import Shortcut from "../Shortcut";
import SmartImage from "../SmartImage";
import TrashBtn from "../TrashBtn";
import { InternalWindowDataContext } from "../window/Window";

const FileExplorer = () => {
	const windowData = useContext(InternalWindowDataContext);
	const sysObj = windowData?.sysObj;

	const [tileMode, setTileMode] = useState(true);
	const [selected, setSelected] = useState(-1);
	const { traverse, replaceWindow } = useSystemKeys(
		"traverse",
		"replaceWindow",
	);

	useEffect(() => {
		if (!windowData || !sysObj || "ext" in sysObj) return;
		windowData.setTitle(`File Explorer - ${sysObj.name}`);
	}, [windowData, sysObj]);

	if (!windowData || !sysObj || "ext" in sysObj) return null;

	const { id, getWidth } = windowData;
	const isTrash = sysObj.name === "Trash";
	const children = sysObj.children.filter(child => !child.hidden);
	const parentFolders = traverse(sysObj) ?? [];

	return (
		<div className="relative flex-1 grid-cols-3 overflow-x-hidden overflow-y-auto md:grid short:md:mt-8.5">
			<Marquee
				className="sticky! z-1 hidden overflow-hidden border-b-2 border-white-primary bg-yellow-accent md:fixed! md:top-10 short:block"
				innerClass="text-black-primary text-md py-1 px-20 text-center whitespace-pre"
				panTime={getWidth() / 15}
				steps={250}
			>
				{`${children.length} Items       ${children.length * 35}KB in ${sysObj.name}       175KB Available`}
			</Marquee>

			<ul className="hidden-scrollbar relative z-1 flex flex-1 justify-end overflow-x-hidden border-b-2 border-white-primary text-white-primary md:flex-col md:justify-start md:border-r-2 md:border-b-0 md:bg-black-primary">
				{parentFolders.map((folder, i) => (
					<li key={folder.name} className="text-nowrap">
						<button
							type="button"
							className="text-md group relative w-full p-2 text-left transition-colors ease-steps2 md:p-4 md:hover:bg-white-primary md:hover:text-black-primary"
							onPointerDown={() => setSelected(i)}
							onClick={() => replaceWindow(id, folder)}
						>
							<span className="absolute opacity-0 transition-opacity ease-steps2 md:group-hover:opacity-100">
								&gt;
							</span>
							<GlitchText
								className="block whitespace-nowrap transition-transform ease-steps2 group-hover:underline md:no-underline! md:group-hover:translate-x-4"
								animated={i === selected}
								onComplete={() =>
									i === selected && setSelected(-1)
								}
							>
								{folder.name}
							</GlitchText>
						</button>
						<span className="inline-block -translate-x-2 md:hidden">
							►
						</span>
					</li>
				))}
				<li className="text-md w-full p-2 text-left md:mb-2 md:bg-purple-watermark md:p-4">
					{sysObj.name}
				</li>
				<button
					type="button"
					onClick={() => setTileMode(mode => !mode)}
					className="relative m-2 mt-auto hidden self-start border-2 border-white-primary whitespace-nowrap md:flex"
				>
					<SmartImage
						src={tileModeImg}
						className="m-2"
						alt="tile mode"
					/>
					<SmartImage
						src={listModeImg}
						className="m-2"
						alt="list mode"
					/>
					<div
						className={cn(
							"absolute -z-1 h-full w-1/2 bg-purple-watermark transition ease-out",
							!tileMode && "translate-x-full",
						)}
					/>
				</button>
			</ul>

			{children.length === 0 ? (
				<p className="relative col-span-2 my-auto w-full p-4 py-12 text-center font-bold text-white-primary">
					{isTrash
						? "Your trashcan is empty"
						: "This folder is empty"}
				</p>
			) : (
				<ul
					className={cn(
						"relative z-1 col-span-2 p-4 pb-12 xs:px-6 md:pt-4 short:pb-20 short:md:pb-4",
						tileMode &&
							"grid grid-cols-[repeat(auto-fill,minmax(min-content,100px))] grid-rows-[max-content] justify-around gap-2",
					)}
				>
					{children.map(child => (
						<li
							key={child.name}
							className={tileMode ? "w-24" : "w-full"}
						>
							<Shortcut
								sysObj={child}
								overrideClick={
									"ext" in child
										? undefined
										: () => replaceWindow(id, child)
								}
								tile={tileMode}
							/>
						</li>
					))}
				</ul>
			)}

			{isTrash && (
				<TrashBtn
					onDelete={() =>
						replaceWindow(id, { ...sysObj, children: [] })
					}
				/>
			)}
			<SmartImage
				src={sunImg}
				alt="Background graphic"
				className="absolute right-1/2 -bottom-6 w-[125%] max-w-none translate-x-1/2 opacity-40 md:-right-32 md:bottom-[5%] md:-z-1 md:h-3/4 md:w-auto md:translate-x-0 md:opacity-100"
			/>
		</div>
	);
};

export default FileExplorer;
