import { AnimatePresence } from "motion/react";
import { lazy, Suspense, useContext, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { useMobileStore, useSystemKeys } from "../store";
import { MobileContext } from "../store/MobileContext";
import { cn } from "../utils";
import { getInitialBounds } from "../utils/window";
import Menu from "./Menu";

const Window = lazy(() => import("./window/Window"));

const WindowsArea = () => {
	const windowsAreaRef = useRef<HTMLElement>(null);
	const z = useRef(1);
	const { windows, deleteWindows } = useSystemKeys(
		"windows",
		"deleteWindows",
	);

	const isMobile = useContext(MobileContext);
	const [menuOpen, windowOpen] = useMobileStore(
		useShallow(state => [state.menuOpen, state.windowOpen]),
	);

	// The extra div is only there to prevent overlap with the taskbar
	return (
		<section
			ref={windowsAreaRef}
			aria-label="Open windows"
			className={cn(
				"pointer-events-none absolute top-0 z-0 size-full",
				!isMobile && "top-14 border-b-56",
			)}
		>
			<AnimatePresence>
				{isMobile && menuOpen && (
					<Menu windows={windows} deleteWindows={deleteWindows} />
				)}
				{(isMobile
					? menuOpen || !windowOpen
						? []
						: [windowOpen]
					: windows
				).map(window => {
					const [initialLocation, initialDimensions] =
						getInitialBounds(window.type);
					return (
						<Suspense key={window.id}>
							<Window
								key={window.id}
								windowData={window}
								z={z}
								area={windowsAreaRef}
								initialLocation={initialLocation}
								initialDimensions={initialDimensions}
							/>
						</Suspense>
					);
				})}
			</AnimatePresence>
		</section>
	);
};

export default WindowsArea;
