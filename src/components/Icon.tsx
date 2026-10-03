import React, { use } from "react";
import { resolveProjectAsset } from "../content/projectsLoader";
import { isFile, type SystemObject } from "../store/types";
import SmartImage from "./SmartImage";

interface IconProps extends React.ComponentPropsWithoutRef<"img"> {
	sysObj: SystemObject;
}

const selectIcon = (sysObj: SystemObject) => {
	if (!isFile(sysObj))
		return sysObj.name === "Trash"
			? "trash.png"
			: sysObj.children.length
				? "folder.png"
				: "empty_folder.png"; //Special folder
	if (sysObj.ext === "mys") return "mystery.gif";
	if (!(sysObj.ext === "exe")) return `${sysObj.ext}.png`;
	return `${sysObj.name.toLowerCase()}.png`;
};

const Icon = ({ sysObj, ...props }: IconProps) => {
	// Look for media files (projects)
	if ("value" in sysObj && sysObj.value && typeof sysObj.value !== "string") {
		const logo = use(
			resolveProjectAsset(
				sysObj.name,
				"logo.png",
			) as Promise<ImportedImage>,
		);
		return <SmartImage {...props} draggable="false" src={logo} alt="" />;
	}
	return (
		<img
			{...props}
			draggable="false"
			loading="eager"
			alt=""
			width={32}
			height={32}
			src={`/icons/${selectIcon(sysObj)}`}
		/>
	);
};

export default Icon;
