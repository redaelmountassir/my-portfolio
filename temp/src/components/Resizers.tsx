import React from "react";
import { PanInfo, motion } from "framer-motion";

type Cardinal = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";

interface ResizableProps {
  handleWidth?: number;
  onResizeStart?(info: PanInfo, cardinal: Cardinal): void;
  onResize?(info: PanInfo, cardinal: Cardinal): void;
  onResizeEnd?(info: PanInfo, cardinal: Cardinal): void;
}

interface Handle {
  dir: Cardinal;
  cursor:
    | "cursor-ns-resize"
    | "cursor-ew-resize"
    | "cursor-nesw-resize"
    | "cursor-nwse-resize";
  pos: Array<"top-full" | "bottom-full" | "left-full" | "right-full">;
  fullSide?: "!w-full" | "!h-full";
  drag?: "x" | "y";
}

const HANDLES: readonly Handle[] = [
  {
    dir: "n",
    cursor: "cursor-ns-resize",
    pos: ["bottom-full"],
    fullSide: "!w-full",
    drag: "y",
  },
  {
    dir: "e",
    cursor: "cursor-ew-resize",
    pos: ["left-full"],
    fullSide: "!h-full",
    drag: "x",
  },
  {
    dir: "s",
    cursor: "cursor-ns-resize",
    pos: ["top-full"],
    fullSide: "!w-full",
    drag: "y",
  },
  {
    dir: "w",
    cursor: "cursor-ew-resize",
    pos: ["right-full"],
    fullSide: "!h-full",
    drag: "x",
  },
  {
    dir: "ne",
    cursor: "cursor-nesw-resize",
    pos: ["bottom-full", "left-full"],
  },
  {
    dir: "se",
    cursor: "cursor-nwse-resize",
    pos: ["top-full", "left-full"],
  },
  {
    dir: "sw",
    cursor: "cursor-nesw-resize",
    pos: ["top-full", "right-full"],
  },
  {
    dir: "nw",
    cursor: "cursor-nwse-resize",
    pos: ["bottom-full", "right-full"],
  },
];

const Resizers: React.FC<ResizableProps> = ({
  handleWidth = 4,
  onResizeStart,
  onResize,
  onResizeEnd,
}) => {
  return (
    <div className="absolute -z-10 h-full w-full">
      {HANDLES.map(({ dir, cursor, pos, fullSide, drag }) => (
        <motion.div
          key={dir}
          drag={drag ?? true}
          dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
          dragElastic={0}
          dragMomentum={false}
          onDragStart={(_e, info) => {
            document.documentElement.classList.add(cursor);
            document.body.classList.add("pointer-events-none");
            onResizeStart?.(info, dir);
          }}
          onDrag={(_e, info) => onResize?.(info, dir)}
          onDragEnd={(_e, info) => {
            document.documentElement.classList.remove(cursor);
            document.body.classList.remove("pointer-events-none");
            onResizeEnd?.(info, dir);
          }}
          className={`absolute ${cursor} ${pos.join(" ")} ${fullSide ?? ""}`}
          style={{ width: handleWidth, height: handleWidth }}
        />
      ))}
    </div>
  );
};

export default Resizers;
