import InitialSystem from "../../content/InitialSystem";
import { projectFiles } from "../../content/projectsLoader";
import content from "../../content/simplePortfolio.yaml";
import {
	isMediaFile,
	type SystemObject,
	type WindowData,
} from "../../store/types";

export const HERO = content.hero;

type SectionIdValue = "top" | "projects" | "about" | "resume" | "contact";
type Section = { id: SectionIdValue; label: string };

export const SECTIONS: readonly Section[] = content.sections;

export type SectionId = Section["id"];

const desktopItems = (() => {
	const user = InitialSystem.children.find(
		item => item.name === "@redaelmountassir",
	);
	if (!user || !("children" in user)) return [] as SystemObject[];
	const desktop = user.children.find(item => item.name === "Desktop");
	if (!desktop || !("children" in desktop)) return [] as SystemObject[];
	return desktop.children;
})();

const aboutFile = desktopItems.find(item => item.name === "about_me");
const contactFile = desktopItems.find(item => item.name === "Contact");

export const projects = projectFiles.filter(isMediaFile);

export const aboutWindow: WindowData | undefined = aboutFile
	? { id: 100, sysObj: aboutFile, type: "TextEditor" }
	: undefined;
export const contactWindow: WindowData | undefined = contactFile
	? { id: 101, sysObj: contactFile, type: "Contact" }
	: undefined;
