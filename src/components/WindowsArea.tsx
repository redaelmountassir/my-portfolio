import React, { useContext, useRef } from 'react';
import Window, { Dimensions } from './Window';
import { useBoundStore, useMobileStore } from '../store';
import { AnimatePresence, Point } from 'framer-motion';
import { MobileContext } from './OS';
import Menu from './Menu';
import { WindowType } from '../store/types';
import { randRange } from '../utils';

const getInitialBounds = (type: WindowType): [Point, Dimensions] => {
	switch (type) {
		case 'FileExplorer':
			return [
				{ x: 50, y: 50 },
				{ w: 700, h: 400 },
			];
		case 'Console':
			return [
				{ x: 200, y: 10 },
				{ w: 200, h: 150 },
			];
		case 'Contact':
			return [
				{ x: 10, y: 10 },
				{ w: 800, h: window.innerHeight - 300 },
			];
		case 'PDFReader':
			return [
				{ x: 300, y: 30 },
				{ w: 400, h: 600 },
			];
		case 'MediaViewer':
			return [
				{ x: 0, y: 0 },
				{ w: 900, h: window.innerHeight - 200 },
			];
		case 'TextEditor':
			return [
				{ x: 500, y: 20 },
				{ w: 800, h: window.innerHeight - 200 },
			];
		case 'Virus':
			return [
				{ x: randRange(0, window.innerWidth), y: randRange(0, 100) },
				{ w: randRange(0, 25), h: randRange(0, 1000) },
			];
		case 'Blank':
		default:
			return [
				{ x: 100, y: 100 },
				{ w: 100, h: 100 },
			];
	}
};

const WindowsArea = () => {
	const windowsAreaRef = useRef(null);
	const [windows, bringToFrontReq, deleteWindows] = useBoundStore(state => [
		state.windows,
		state.bringToFront,
		state.deleteWindow,
		state.deleteWindows,
	]);

	const isMobile = useContext(MobileContext);
	const [menuOpen, windowOpen] = useMobileStore(state => [
		state.menuOpen,
		state.windowOpen,
	]);

	// The extra div is only there to prevent overlap with the taskbar
	return (
		<div className="absolute w-full h-full md:pt-14 top-0 pointer-events-none">
			<div ref={windowsAreaRef} className="h-full relative">
				<AnimatePresence>
					{isMobile && menuOpen && (
						<Menu
							windows={windows}
							bringToFrontReq={bringToFrontReq}
							deleteWindows={deleteWindows}
						/>
					)}
					{(isMobile
						? menuOpen || windows.length === 0
							? []
							: windowOpen
								? [windows[windows.length - 1]]
								: []
						: windows
					).map(window => {
						const [initialLocation, initialDimensions] =
							getInitialBounds(window.type);
						return (
							<Window
								key={window.id}
								{...window}
								area={windowsAreaRef}
								initialLocation={initialLocation}
								initialDimensions={initialDimensions}
							/>
						);
					})}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default WindowsArea;
