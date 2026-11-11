import { createContext, type Dispatch, type SetStateAction } from "react";
import type { MediaFile, WindowData } from "../../store/types";

export interface InternalWindowData extends WindowData {
	setTitle: Dispatch<SetStateAction<string>>;
	getWidth: () => number;
	/** Document-flow layout. Apps use this to drop OS taskbar offsets. */
	embedded?: boolean;
	onNext?: (next: MediaFile) => void;
}

export const InternalWindowDataContext = createContext<
	InternalWindowData | undefined
>(undefined);
