import React, { use, useContext } from "react";
import { resolveProjectAsset } from "../content/projectsLoader";
import { MobileContext } from "../store/MobileContext";
import { isFile, type SystemObject } from "../store/types";
import SmartImage from "./SmartImage";

interface IconProps extends React.ComponentPropsWithoutRef<"img"> {
	sysObj: SystemObject;
}

const selectIcon = (sysObj: SystemObject, isMobile: boolean) => {
	if (!isFile(sysObj))
		return sysObj.name === "Trash"
			? "trash.png"
			: sysObj.children.length
				? isMobile
					? "mobile_group.png"
					: "folder.png"
				: isMobile
					? "empty_mobile_group.png"
					: "empty_folder.png"; //Special folder
	if (sysObj.ext === "mys") return "mystery.gif";
	if (!(sysObj.ext === "exe")) return `${sysObj.ext}.png`;
	return `${sysObj.name.toLowerCase()}.png`;
};

const Icon = ({ sysObj, ...props }: IconProps) => {
	const isMobile = useContext(MobileContext);
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
			src={`/icons/${selectIcon(sysObj, isMobile)}`}
		/>
	);
};

export default Icon;
