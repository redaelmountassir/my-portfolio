import { useContext, useEffect, useState } from "react";
import sunImg from "../../../assets/images/circle.png";
import filterImg from "../../../assets/images/filter.png";
import listModeImg from "../../../assets/images/list_mode.png";
import tileModeImg from "../../../assets/images/tile_mode.png";
import { useSystemKeys } from "../../../store";
import { isMediaFile } from "../../../store/types";
import { cn } from "../../../utils";
import Dropdown from "../../Dropdown";
import GlitchText from "../../GlitchText";
import Marquee from "../../Marquee";
import Shortcut from "../../Shortcut";
import SmartImage from "../../SmartImage";
import { InternalWindowDataContext } from "../../window/Window";
import FilterOptions, { useOptionSelection } from "./FilterOptions";
import TrashBtn from "./TrashBtn";

const uniqueSorted = (values: string[]) => [...new Set(values)].sort();

const FileExplorer = () => {
	const windowData = useContext(InternalWindowDataContext);
	const sysObj = windowData?.sysObj;

	const [tileMode, setTileMode] = useState(true);
	const [selected, setSelected] = useState(-1);
	const { traverse, replaceWindow } = useSystemKeys(
		"traverse",
		"replaceWindow",
	);

	const directory = sysObj && !("ext" in sysObj) ? sysObj : undefined;
	const children = directory?.children.filter(child => !child.hidden) ?? [];
	const isProjects = directory?.name === "Projects";
	const extensions = uniqueSorted(
		children.flatMap(child => ("ext" in child ? [child.ext] : [])),
	);
	const categories = isProjects
		? uniqueSorted(
				children.flatMap(child =>
					"ext" in child && isMediaFile(child)
						? child.value.categories
						: [],
				),
			)
		: [];
	const extensionFilter = useOptionSelection(
		`${directory?.name ?? ""}:${extensions.join("\0")}`,
		extensions,
	);
	const categoryFilter = useOptionSelection(
		`${directory?.name ?? ""}:${categories.join("\0")}`,
		categories,
	);

	useEffect(() => {
		if (!windowData || !sysObj || "ext" in sysObj) return;
		windowData.setTitle(`File Explorer - ${sysObj.name}`);
	}, [windowData, sysObj]);

	if (!windowData || !directory) return;

	const { id, getWidth } = windowData;
	const isTrash = directory.name === "Trash";
	const shown = children.filter(child => {
		if (!("ext" in child)) return true;
		if (
			extensions.length > 0 &&
			!extensionFilter.selected.includes(child.ext)
		)
			return false;
		if (!isProjects || categories.length === 0 || !isMediaFile(child))
			return true;
		return child.value.categories.some(category =>
			categoryFilter.selected.includes(category),
		);
	});
	const parentFolders = traverse(directory) ?? [];

	return (
		<div className="relative flex-1 grid-cols-3 overflow-x-hidden overflow-y-auto md:grid short:md:mt-8 short:md:border-t-2">
			<Marquee
				className="sticky! z-1 hidden overflow-hidden border-b-2 border-white-primary bg-yellow-accent md:fixed! md:top-10 short:block"
				innerClass="text-black-primary text-md py-1 px-20 text-center whitespace-pre"
				panTime={getWidth() / 15}
				steps={250}
			>
				{`${shown.length} Items       ${shown.length * 35}KB in ${directory.name}       175KB Available`}
			</Marquee>

			<ul className="hidden-scrollbar relative z-1 flex flex-1 justify-end overflow-x-hidden border-b-2 border-white-primary text-white-primary md:flex-col md:justify-start md:border-r-2 md:border-b-0 md:bg-black-primary">
				{parentFolders.map((folder, i) => (
					<li key={folder.name} className="text-nowrap">
						<button
							type="button"
							className="text-md group relative w-full p-2 text-left transition-colors ease-steps-2 md:p-4 md:hover:bg-white-primary md:hover:text-black-primary"
							onPointerDown={() => setSelected(i)}
							onClick={() => replaceWindow(id, folder)}
						>
							<span className="absolute opacity-0 transition-opacity ease-steps-2 md:group-hover:opacity-100">
								&gt;
							</span>
							<GlitchText
								className="block whitespace-nowrap transition-transform ease-steps-2 group-hover:underline md:no-underline! md:group-hover:translate-x-4"
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
					{directory.name}
				</li>
				<div className="relative m-2 mt-auto hidden gap-2 md:flex">
					<button
						type="button"
						onClick={() => setTileMode(mode => !mode)}
						className="relative flex self-start border-2 border-white-primary whitespace-nowrap"
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
					{(extensions.length > 0 || categories.length > 0) && (
						<Dropdown
							forcedDirection="up"
							dClassName="z-10 whitespace-nowrap"
							dContent={
								<div className="flex flex-col gap-4">
									{extensions.length > 0 && (
										<FilterOptions
											label="By Extension:"
											options={extensions}
											selected={extensionFilter.selected}
											allSelected={
												extensionFilter.allSelected
											}
											onToggle={extensionFilter.toggle}
											onToggleAll={
												extensionFilter.toggleAll
											}
											format={ext => `.${ext}`}
										/>
									)}
									{isProjects && categories.length > 0 && (
										<FilterOptions
											label="By Category:"
											options={categories}
											selected={categoryFilter.selected}
											allSelected={
												categoryFilter.allSelected
											}
											onToggle={categoryFilter.toggle}
											onToggleAll={
												categoryFilter.toggleAll
											}
										/>
									)}
								</div>
							}
							pClassName="flex-1"
							className="group flex size-full items-center gap-3 border-2 bg-purple-watermark px-3 transition ease-steps-10 hover:bg-white-primary hover:text-black-primary"
						>
							<>
								<SmartImage
									src={filterImg}
									alt="filter icon"
									className="size-4 group-hover:invert"
								/>
								<p>Filter</p>
							</>
						</Dropdown>
					)}
				</div>
			</ul>

			{shown.length === 0 ? (
				<p className="relative col-span-2 my-auto w-full p-4 py-12 text-center font-bold text-white-primary">
					{children.length === 0
						? isTrash
							? "Your trashcan is empty"
							: "This folder is empty"
						: "No items match the current filter"}
				</p>
			) : (
				<ul
					className={cn(
						"relative z-1 col-span-2 p-4 pb-12 xs:px-6 md:pt-4 short:pb-20 short:md:pb-4",
						tileMode &&
							"grid grid-cols-[repeat(auto-fill,minmax(min-content,100px))] grid-rows-[max-content] justify-around gap-2",
					)}
				>
					{shown.map(child => (
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
						replaceWindow(id, { ...directory, children: [] })
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
