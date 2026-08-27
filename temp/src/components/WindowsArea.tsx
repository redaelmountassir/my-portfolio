import React, { lazy, Suspense, useContext, useRef } from "react";
import { Dimensions } from "./Window";
import { useBoundStore, useMobileStore } from "../store";
import { AnimatePresence, Point } from "framer-motion";
import { MobileContext } from "./OS";
import Menu from "./Menu";
import { WindowType } from "../store/types";
import { randRange } from "../utils";

const Window = lazy(() => import("./Window"));

const getInitialBounds = (type: WindowType): [Point, Dimensions] => {
  switch (type) {
    case "FileExplorer":
      return [
        { x: 50, y: 50 },
        { w: 700, h: 400 },
      ];
    case "Console":
      return [
        { x: 200, y: 10 },
        { w: 600, h: 400 },
      ];
    case "Contact":
      return [
        { x: 10, y: 10 },
        { w: 800, h: window.innerHeight - 300 },
      ];
    case "PDFReader":
      return [
        { x: 300, y: 30 },
        { w: 400, h: 600 },
      ];
    case "MediaViewer":
      return [
        { x: 0, y: 0 },
        { w: 900, h: window.innerHeight - 200 },
      ];
    case "TextEditor":
      return [
        { x: 500, y: 20 },
        { w: 800, h: window.innerHeight - 200 },
      ];
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

const WindowsArea = () => {
  const windowsAreaRef = useRef(null);
  const z = useRef(1);
  const [windows, deleteWindows] = useBoundStore((state) => [
    state.windows,
    state.deleteWindows,
  ]);

  const isMobile = useContext(MobileContext);
  const [menuOpen, windowOpen] = useMobileStore((state) => [
    state.menuOpen,
    state.windowOpen,
  ]);

  // The extra div is only there to prevent overlap with the taskbar
  return (
    <div
      ref={windowsAreaRef}
      className={`pointer-events-none absolute z-0 h-full w-full ${isMobile ? "top-0" : "top-14 border-b-56"}`}
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
        ).map((window) => {
          const [initialLocation, initialDimensions] = getInitialBounds(
            window.type,
          );
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
    </div>
  );
};

export default WindowsArea;
