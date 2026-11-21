import type { Point } from "motion/react";
import { randRange } from ".";
import type { WindowType } from "../store/types";

export interface Dimensions {
	w: number;
	h: number;
}

const centeredBounds = (w: number, h: number): [Point, Dimensions] => {
	const fittedWidth = Math.min(
		w,
		Math.min(1100, Math.max(320, window.innerWidth - 80)),
	);
	const fittedHeight = Math.min(
		Math.max(360, h),
		Math.min(760, Math.max(360, window.innerHeight - 150)),
	);
	const maxX = Math.max(0, window.innerWidth - fittedWidth);
	const maxY = Math.max(0, window.innerHeight - 70 - fittedHeight);

	return [
		{
			x: Math.min(maxX, Math.max(0, maxX / 2 + randRange(-28, 28))),
			y: Math.min(maxY, Math.max(0, maxY / 2 + randRange(-28, 28))),
		},
		{ w: fittedWidth, h: fittedHeight },
	];
};

export const getInitialBounds = (type: WindowType): [Point, Dimensions] => {
	switch (type) {
		case "FileExplorer":
			return centeredBounds(700, 400);
		case "Console":
			return centeredBounds(600, 400);
		case "Contact":
			return centeredBounds(800, window.innerHeight - 300);
		case "SimpleBrowser":
			return centeredBounds(
				Math.min(1100, Math.max(320, window.innerWidth - 80)),
				Math.min(760, Math.max(360, window.innerHeight - 150)),
			);
		case "PDFReader":
			return centeredBounds(400, 600);
		case "MediaViewer":
			return centeredBounds(900, window.innerHeight - 200);
		case "TextEditor":
			return centeredBounds(800, window.innerHeight - 200);
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
