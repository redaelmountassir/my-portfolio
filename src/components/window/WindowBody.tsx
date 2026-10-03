import { lazy, useContext } from "react";
import Console from "../apps/Console";
import FileExplorer from "../apps/FileExplorer";
import PDFReader from "../apps/PDFReader";
import Virus from "../apps/Virus";
import { InternalWindowDataContext } from "./Window";

const Mail = lazy(() => import("../apps/Mail"));
const MediaViewer = lazy(() => import("../apps/MediaViewer"));
const TextEditor = lazy(() => import("../apps/TextEditor"));

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
			return;
	}
};

export default WindowBody;
