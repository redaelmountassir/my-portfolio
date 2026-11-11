import InitialSystem from "../../content/InitialSystem";
import { projectFiles } from "../../content/projectsLoader";
import {
	isMediaFile,
	type SystemObject,
	type WindowData,
} from "../../store/types";

export const HERO = {
	kicker: "Reda Elmountassir",
	title: "Mechanical Engineer",
	line: "With interests in all things artistic, development, or social work",
};

export const SECTIONS = [
	{ id: "top", label: "Home" },
	{ id: "projects", label: "Projects" },
	{ id: "about", label: "About" },
	{ id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

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

export const projectAnchor = (name: string) => `project-${name}`;
