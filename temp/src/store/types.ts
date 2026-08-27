import { IGatsbyImageData } from 'gatsby-plugin-image';

export type SystemObject = Directory | File;
export type FileExtension = 'pdf' | 'txt' | 'png' | 'mp4' | 'exe' | 'mys';
export type WindowType =
	| 'FileExplorer'
	| 'Console'
	| 'Contact'
	| 'PDFReader'
	| 'TextEditor'
	| 'MediaViewer'
	| 'Virus'
	| 'Blank';
export type Path = string[];

export interface MediaFile {
	loc?: {
		text: string;
		link: string;
	};
	org?: string;
	roles: string[];
	date: Date;
	categories: string[];
	tags: string[];
	description: string;
	showcases: (string | IGatsbyImageData)[];
	logo: IGatsbyImageData;
	parent?: {
		name?: string;
	};
}

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
	value?: MediaFile | string;
	htmlElement?: HTMLElement;
}

export interface Window {
	id: number;
	sysObj: SystemObject;
	type: WindowType;
}

export interface WindowSlice {
	lastId: number;
	windows: Window[];
	windowAudio?: HTMLAudioElement;
	windowMaximized: boolean;
	setWindowMaximized(windowMaximized: boolean): void;
	playSound(reverse?: boolean): void;
	findWindow(windows: Window[], ref: number | Window): number;
	addWindow(
		sysObj: SystemObject,
		customID?: number,
		blockSound?: boolean
	): void;
	deleteWindow(ref: number | Window): void;
	replaceWindow(oldWindow: number | Window, newObj: SystemObject): void;
	deleteWindows(): void;
}

export interface DirectorySlice {
	rootDir: Directory;
	toPath(path: Path | string): Path;
	navigateFrom(
		startDir: Directory,
		path: Path | string
	): SystemObject | undefined;
	navigate(path: Path | string): SystemObject | undefined;
	traverse(target: SystemObject, startDir?: Directory): Directory[] | null;
	modifySystem(
		target: Path | string,
		mod: (dir: Directory) => Directory
	): void;
	emptyDir(target: Path | string): void;
	fillDir(target: Path | string, children?: SystemObject[]): void;
}

export interface MobileStore {
	menuOpen: boolean;
	windowOpen?: Window;
	toggleMenu: Function;
	home: Function;
	showWindow(toShow: Window): void;
	back: Function;
}

export interface SettingsStore {
	brightness: number;
	use3D: boolean;
	useStatic: boolean;
	useFlicker: boolean;
	scanlines: boolean;
	fancyText: boolean;
	volume: number;
	lightModeText: string;
	lightMode: boolean;
	fullscreen: boolean;
	setBrightness(val: number): void;
	set3D(val: boolean): void;
	setStatic(val: boolean): void;
	setScanlines(val: boolean): void;
	setFancyText(val: boolean): void;
	setFlicker(val: boolean): void;
	setVolume(val: number): void;
	setLightMode(val: boolean): void;
	setFullscreen(val: boolean): void;
	initFullscreen: Function;
	restart: Function;
	shutdown: Function;
}
