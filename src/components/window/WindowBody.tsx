import { useContext } from "react";
import Console from "../apps/Console";
import FileExplorer from "../apps/FileExplorer";
import Mail from "../apps/Mail";
import MediaViewer from "../apps/MediaViewer";
import PDFReader from "../apps/PDFReader";
import TextEditor from "../apps/TextEditor";
import Virus from "../apps/Virus";
import { InternalWindowDataContext } from "./Window";

const WindowBody = () => {
	const type = useContext(InternalWindowDataContext)?.type;
	switch (type) {
		case "FileExplorer":
			return <FileExplorer />;
		case "Console":
			return <Console />;
		case "Contact":
			return <Mail />;
		case "PDFReader":
			return <PDFReader />;
		case "MediaViewer":
			return <MediaViewer />;
		case "TextEditor":
			return <TextEditor />;
		case "Virus":
			return <Virus />;
		case "Blank":
		default:
			return null;
	}
};

export default WindowBody;
