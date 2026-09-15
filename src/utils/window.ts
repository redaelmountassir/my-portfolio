import type { Point } from "motion/react";
import { randRange } from ".";
import type { WindowType } from "../store/types";

export interface Dimensions {
	w: number;
	h: number;
}

export const getInitialBounds = (type: WindowType): [Point, Dimensions] => {
	switch (type) {
		case "FileExplorer":
			return [
				{ x: 50, y: 50 },
				{ w: 700, h: 400 },
			];
		case "Console":
			return [
				{ x: 200, y: 10 },
				{ w: 600, h: 400 },
			];
		case "Contact":
			return [
				{ x: 10, y: 10 },
				{ w: 800, h: window.innerHeight - 300 },
			];
		case "PDFReader":
			return [
				{ x: 300, y: 30 },
				{ w: 400, h: 600 },
			];
		case "MediaViewer":
			return [
				{ x: 0, y: 0 },
				{ w: 900, h: window.innerHeight - 200 },
			];
		case "TextEditor":
			return [
				{ x: 500, y: 20 },
				{ w: 800, h: window.innerHeight - 200 },
			];
		case "Virus":
			return [
				{ x: randRange(0, window.innerWidth), y: randRange(0, 100) },
				{ w: randRange(0, 25), h: randRange(0, 1000) },
			];
		case "Blank":
		default:
			return [
				{ x: 100, y: 100 },
				{ w: 100, h: 100 },
			];
	}
};

export const calcOrigin = (window: HTMLElement, windowOrigin: HTMLElement) => {
	const windowBounds = window.getBoundingClientRect();
	const windowOriginsBounds = windowOrigin.getBoundingClientRect();
	return `${
		windowOriginsBounds.x + windowOriginsBounds.width * 0.5 - windowBounds.x
	}px ${
		windowOriginsBounds.y + windowOriginsBounds.height * 0.5 - windowBounds.y
	}px`;
};
