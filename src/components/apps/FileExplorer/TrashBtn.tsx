import trashAudio from "../../../assets/audio/trash.mp3";
import trashImg from "../../../assets/images/trash.png";
import { useSystemKeys } from "../../../store";
import type { Directory } from "../../../store/types";
import { useAudio } from "../../../utils";
import SmartImage from "../../SmartImage";

const TRASH: Directory = { name: "Trash", children: [] };

const TrashBtn = ({ onDelete }: { onDelete?: () => void }) => {
	const [playTrash] = useAudio(trashAudio, 0.25);
	const { emptyDir, traverse } = useSystemKeys("emptyDir", "traverse");
	const parents = traverse(TRASH);

	return (
		<button
			type="button"
			aria-label="Empty Trash"
			className="fixed right-10 bottom-20 z-1 m-4 bg-linear-to-r from-blue-accent to-pink-accent bg-double bg-left px-4 py-2 text-white-primary outline-2 outline-white-primary transition-all ease-steps-2 hover:bg-right focus-visible:bg-right active:scale-95 md:bottom-0"
			disabled={!parents}
			onClick={() => {
				if (!parents) return;
				playTrash();
				emptyDir([...parents.map(dir => dir.name), TRASH.name]);
				onDelete?.();
			}}
		>
			<span className="hidden md:inline" aria-hidden="true">
				Empty Trash
			</span>
			<SmartImage
				src={trashImg}
				alt=""
				className="my-2 block w-8 md:hidden"
			/>
		</button>
	);
};

export default TrashBtn;
