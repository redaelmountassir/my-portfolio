import React, { useContext, useEffect, useMemo, useState } from "react";
import { WindowDataContext } from "../Window";
import { useBoundStore } from "../../store";
import Shortcut from "../Shortcut";
import GlitchText from "../GlitchText";
import Marquee from "../Marquee";
import { useAudio } from "../../utils";
import trashAudio from "../../audio/trash.mp3";
import sunImg from "../../images/circle.png";
import trashImg from "../../images/trash.png";
import { StaticImage } from "gatsby-plugin-image";

export const FileExplorer = () => {
	const windowData = useContext(WindowDataContext);
	if (!windowData) return;
	const { sysObj, id, setTitle, getWidth } = windowData;
	if ("ext" in sysObj) return null;

	// Update title on currently selected folder
	useEffect(() => setTitle(`File Explorer - ${sysObj.name}`), [sysObj]);

	// Seperate functionality exists for the trashcan
	const isTrash = sysObj.name === "Trash";

	// Set view type
	const [tileMode, setTileMode] = useState(true);

	const [traverse, replaceWindow, emptyDir] = useBoundStore((state) => [
		state.traverse,
		state.replaceWindow,
		state.emptyDir,
	]);
	const parentFolders = useMemo(() => traverse(sysObj), [sysObj]);
	const [selected, setSelected] = useState(-1);
	//sysObj itself will not react to updates, requires state. This solution is both criminal and poorly designed
	let [children, setChildren] = useState(sysObj.children);
	useEffect(
		() => setChildren(sysObj.children.filter((child) => !child.hidden)),
		[sysObj.children],
	);

	return (
		<div className="relative flex-1 grid-cols-3 overflow-y-auto overflow-x-hidden md:grid short:md:mt-[34px]">
			<Marquee
				className="sticky! z-20 hidden overflow-hidden border-b-2 border-white-primary bg-yellow-accent md:fixed! md:top-10 short:block"
				innerClass="text-black-primary text-md py-1 px-20 text-center whitespace-pre"
				panTime={getWidth() / 15}
				steps={250}
			>
				{`${children.length} Items       ${children.length * 35}KB in ${sysObj.name}       175KB Available`}
			</Marquee>
			<ul className="hidden-scrollbar relative z-20 flex flex-1 justify-end overflow-x-hidden border-b-2 border-white-primary text-white-primary md:flex-col md:justify-start md:border-b-0 md:border-r-2 md:bg-black-primary">
				{parentFolders &&
					parentFolders.map((folder, i) => (
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
									onComplete={() => i === selected && setSelected(-1)}
								>
									{folder.name}
								</GlitchText>
							</button>
							<span className="inline-block -translate-x-2 md:hidden">►</span>
						</li>
					))}
				<li className="text-md w-full p-2 text-left md:mb-2 md:bg-purple-watermark md:p-4">
					{sysObj.name}
				</li>
				<button
					type="button"
					onClick={() => setTileMode((tileMode) => !tileMode)}
					className="relative m-2 mt-auto hidden self-start whitespace-nowrap border-2 border-white-primary md:flex"
				>
					<StaticImage
						src="../../images/tile_mode.png"
						layout="fixed"
						className="m-2"
						alt="tile mode"
					/>
					<StaticImage
						src="../../images/list_mode.png"
						layout="fixed"
						className="m-2"
						alt="list mode"
					/>
					<div
						className={`absolute -z-10 h-full w-1/2 bg-purple-watermark transition ease-out ${!tileMode && "translate-x-full"}`}
					/>
				</button>
			</ul>
			{children.length === 0 ? (
				<p className="relative col-span-2 my-auto w-full p-4 py-12 text-center font-bold text-white-primary">
					{isTrash ? "Your trashcan is empty" : "This folder is empty"}
				</p>
			) : (
				<ul
					className={`relative z-10 col-span-2 p-4 pb-12 md:pt-4 xs:px-6 short:pb-20 short:md:pb-4 ${tileMode ? "grid grid-cols-[repeat(auto-fill,minmax(min-content,100px))] grid-rows-[max-content] justify-around gap-2" : ""}`}
				>
					{children.map((child) => (
						<li key={child.name} className={tileMode ? "w-24" : "w-full"}>
							<Shortcut
								sysObj={child}
								overrideClick={
									"ext" in child ? undefined : () => replaceWindow(id, child)
								}
								tile={tileMode}
							/>
						</li>
					))}
				</ul>
			)}
			{isTrash && parentFolders && (
				<TrashBtn
					onClick={() => {
						emptyDir([...parentFolders.map((dir) => dir.name), sysObj.name]);
						setChildren([]);
					}}
				/>
			)}
			<img
				src={sunImg}
				alt="Background graphic"
				className="absolute -bottom-6 right-1/2 w-[125%] max-w-none translate-x-1/2 opacity-40 md:-right-32 md:bottom-[5%] md:-z-10 md:h-3/4 md:w-auto md:translate-x-0 md:opacity-100"
			/>
		</div>
	);
};

const TrashBtn: React.FC<{ onClick: Function }> = ({ onClick }) => {
	const [playTrash] = useAudio(trashAudio, 0.25);

	return (
		<button
			type="button"
			className="ease-steps2 fixed bottom-20 right-10 z-10 m-4 bg-linear-to-r from-blue-accent to-pink-accent bg-double bg-left px-4 py-2 text-white-primary outline-2 outline-white-primary transition-all hover:bg-right active:scale-95 md:bottom-0"
			onClick={() => {
				playTrash();
				onClick();
			}}
		>
			<span className="hidden md:inline">Empty Trash</span>
			<img
				src={trashImg}
				alt=""
				width={32}
				height={32}
				className="my-2 block md:hidden"
			/>
		</button>
	);
};

export default FileExplorer;
