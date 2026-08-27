import { StateCreator } from 'zustand';
import type {
	WindowSlice,
	DirectorySlice,
	SystemObject,
	Window,
	WindowType,
} from './types';
import { useMobileStore, useSettingsStore } from '.';
import windowOpenAudio from '../audio/open_window.mp3';
import { randRange } from '../utils';

const pickWindowType = (sysObj: SystemObject): WindowType => {
	if (!('ext' in sysObj)) return 'FileExplorer';
	switch (sysObj.ext) {
		case 'exe':
			if (sysObj.name === 'Console') return 'Console';
			if (sysObj.name === 'Contact') return 'Contact';
		case 'png':
		case 'mp4':
			return 'MediaViewer';
		case 'pdf':
			return 'PDFReader';
		case 'txt':
			return 'TextEditor';
		case 'mys':
			return 'Virus';
		default:
			return 'Blank';
	}
};

export const createWindowSlice: StateCreator<
	WindowSlice & DirectorySlice,
	[],
	[],
	WindowSlice
> = (set, get) => ({
	windows: [],
	lastId: 0,
	windowAudio: undefined,
	windowMaximized: false,
	setWindowMaximized(windowMaximized) {
		// Only for three js optimization has no impact on the maximization of any window
		set({ windowMaximized });
	},
	playSound(lower = false) {
		const globalVol = useSettingsStore.getState().volume * 0.01;
		if (globalVol === 0) return;
		let audioElement = get().windowAudio;
		if (!audioElement) {
			audioElement = new Audio(windowOpenAudio);
			audioElement.playbackRate = lower
				? randRange(1, 1.05)
				: randRange(1.1, 1.2);
			audioElement.preservesPitch = false;
			audioElement.volume = 0.2 * globalVol;
			// set({ windowAudio: audioElement });
		}
		if (audioElement.readyState >= 3) return audioElement.play();
		audioElement.addEventListener('canplay', audioElement.play);
	},
	findWindow: (windows, ref) =>
		typeof ref === 'number'
			? windows.findIndex(window => window.id === ref)
			: windows.indexOf(ref),
	addWindow(sysObj, customID = -1, blockSound = false) {
		const type = pickWindowType(sysObj);
		let id = customID === -1 ? get().lastId : customID;
		const newWindow: Window = {
			sysObj,
			type,
			id,
		};
		useMobileStore.getState().showWindow(newWindow);
		if (!blockSound) get().playSound();
		set(state => ({
			lastId: id + 1,
			windows: [...state.windows, newWindow],
		}));
	},
	deleteWindow(ref) {
		get().playSound(true);
		set(state => {
			const windows = [...state.windows];
			if (
				(typeof ref === 'number' ? ref : ref.id) ===
				useMobileStore.getState().windowOpen?.id
			)
				useMobileStore.setState({ windowOpen: undefined });
			windows.splice(get().findWindow(windows, ref), 1);
			return windows.length ? { windows } : { windows, lastId: 0 };
		});
	},
	replaceWindow(oldWindow, newObj) {
		get().deleteWindow(oldWindow);
		const idToReuse =
			typeof oldWindow === 'number' ? oldWindow : oldWindow.id;
		get().addWindow(newObj, idToReuse, true);
	},
	deleteWindows() {
		useMobileStore.setState({ windowOpen: undefined });
		set(_ => ({ windows: [], lastId: 0, windowMaximized: false }));
	},
});
