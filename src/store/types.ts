import { z } from "zod";

// Zod probes `new Function` to enable JIT parsing. That probe is reported as a
// CSP violation even when the error is caught, so disable it before any schema is created.
z.config({ jitless: true });

export type SystemObject = Directory | File;
export type FileExtension = "pdf" | "txt" | "png" | "mp4" | "exe" | "mys";
export type WindowType =
	| "FileExplorer"
	| "Console"
	| "Contact"
	| "PDFReader"
	| "TextEditor"
	| "MediaViewer"
	| "Virus"
	| "Blank";
export type Path = string[];
export type SystemState = WindowSlice & DirectorySlice;

// Essentially media === projects
export const mediaSchema = z.object({
	loc: z
		.object({
			text: z.string(),
			link: z.string(),
		})
		.optional(),
	org: z.string().optional(),
	roles: z.array(z.string()),
	date: z.coerce.date(),
	categories: z.array(z.string()),
	tags: z.array(z.string()),
	description: z.string(),
	showcases: z.array(z.string()),
});

export type Media = z.infer<typeof mediaSchema>;

export interface Directory {
	name: string;
	hidden?: boolean;
	children: SystemObject[];
	htmlElement?: HTMLElement;
}

export interface File {
	name: string;
	hidden?: boolean;
	ext: FileExtension;
	value?: Media | string;
	htmlElement?: HTMLElement;
}

export const isFile = (obj?: SystemObject): obj is File =>
	!!obj && "ext" in obj;

export type MediaFile = File & { value: Media }; // MediaFile === projects for my portfolio

export const isMediaFile = (obj?: SystemObject): obj is MediaFile =>
	isFile(obj) && !!obj.value && typeof obj.value !== "string";

export interface WindowData {
	id: number;
	sysObj: SystemObject;
	type: WindowType;
}

export interface WindowSlice {
	lastId: number;
	windows: WindowData[];
	windowAudio?: HTMLAudioElement;
	windowMaximized: boolean;
	setWindowMaximized(windowMaximized: boolean): void;
	/** True while a desktop window is dragged/resized — pauses the 3D frameloop. */
	windowInteracting: boolean;
	setWindowInteracting(windowInteracting: boolean): void;
	playSound(reverse?: boolean): void;
	findWindow(windows: WindowData[], ref: number | WindowData): number;
	addWindow(
		sysObj: SystemObject,
		customID?: number,
		blockSound?: boolean,
	): void;
	deleteWindow(ref: number | WindowData): void;
	replaceWindow(oldWindow: number | WindowData, newObj: SystemObject): void;
	deleteWindows(): void;
}

export interface DirectorySlice {
	rootDir: Directory;
	toPath(path: Path | string): Path;
	navigateFrom(
		startDir: Directory,
		path: Path | string,
	): SystemObject | undefined;
	navigate(path: Path | string): SystemObject | undefined;
	traverse(target: SystemObject, startDir?: Directory): Directory[] | null;
	modifySystem(
		target: Path | string,
		mod: (dir: Directory) => Directory,
	): void;
	emptyDir(target: Path | string): void;
	fillDir(target: Path | string, children?: SystemObject[]): void;
}

export interface MobileStore {
	menuOpen: boolean;
	windowOpen?: WindowData;
	toggleMenu: () => void;
	home: () => void;
	showWindow(toShow: WindowData): void;
	back: () => void;
}

export interface SettingsStore {
	brightness: number;
	use3D: boolean;
	useStatic: boolean;
	useFlicker: boolean;
	scanlines: boolean;
	blur: boolean;
	fancyText: boolean;
	volume: number;
	lightModeText: string;
	lightMode: boolean;
	fullscreen: boolean;
	skipLoader: boolean;
	setBrightness(val: number): void;
	set3D(val: boolean): void;
	setStatic(val: boolean): void;
	setScanlines(val: boolean): void;
	setBlur(val: boolean): void;
	setFancyText(val: boolean): void;
	setFlicker(val: boolean): void;
	setVolume(val: number): void;
	setLightMode(val: boolean): void;
	setFullscreen(val: boolean): void;
	setSkipLoader(val: boolean): void;
	initFullscreen: () => void;
	restart: () => void;
	shutdown: () => void;
}
