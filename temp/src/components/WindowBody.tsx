import React, { memo } from "react";
import { WindowType } from "../store/types";
import { Console } from "./windows/Console";
import { FileExplorer } from "./windows/FileExplorer";
import Mail from "./windows/Mail";
import PDFReader from "./windows/PDFReader";
import MediaViewer from "./windows/MediaViewer";
import Virus from "./windows/Virus";
import TextEditor from "./windows/TextEditor";

interface WindowBodyProps {
  type: WindowType;
}

const pickContentComponent = (type: WindowType): React.ReactNode => {
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

const WindowBody: React.FC<WindowBodyProps> = memo(({ type }) => {
  return pickContentComponent(type);
});

export default WindowBody;
