import Window from "../../components/window/Window";
import type { MediaFile, WindowData } from "../../store/types";

const WindowSlot = ({
	id,
	windowData,
	onNext,
}: {
	id?: string;
	windowData: WindowData;
	onNext?: (next: MediaFile) => void;
}) => (
	<div
		id={id}
		className="relative h-[85vh] min-h-112 transform-[translateZ(0)] shadow-[10px_10px_0_0] shadow-black-primary/25"
	>
		<Window embedded windowData={windowData} onNext={onNext} />
	</div>
);

export default WindowSlot;
