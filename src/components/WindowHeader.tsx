import { StaticImage } from "gatsby-plugin-image";
import React from "react";
import { motion } from "framer-motion";

interface WindowHeaderProps {
  onGrab: React.PointerEventHandler<Element>;
  onClose: React.MouseEventHandler;
  onMaximize: React.MouseEventHandler;
  maximized: boolean;
  title: string;
}

const WindowHeader: React.FC<WindowHeaderProps> = ({
  onGrab,
  onClose,
  onMaximize,
  maximized,
  title,
}) => {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: "-105%" }}
        animate={{ y: 0 }}
        transition={{ delay: 1.25, ease: "easeOut", type: "tween" }}
        onPointerDown={maximized ? undefined : onGrab}
        className={`flex h-10  w-full touch-none items-center border-b-2 border-white-primary text-white ${
          !maximized && "cursor-grab"
        }`}
      >
        <h3 className="grow select-none overflow-hidden text-ellipsis whitespace-nowrap px-1 text-center text-lg">
          {title}
        </h3>
        <button
          type="button"
          className="group h-full w-10 shrink-0 border-l-2 border-white-primary  p-1 hover:bg-white"
          onClick={onMaximize}
        >
          {maximized ? (
            <StaticImage
              src="../images/restore_down.png"
              title="restore down"
              alt="restore down"
              placeholder="none"
              draggable={false}
              width={36}
              className="group-hover:invert"
              loading="eager"
              imgClassName="!transition-none" //Loads in slowly and looks out of place
            />
          ) : (
            <StaticImage
              src="../images/maximize.png"
              title="maximize"
              alt="maximize"
              placeholder="none"
              draggable={false}
              width={36}
              className="group-hover:invert"
              loading="eager"
              imgClassName="!transition-none"
            />
          )}
        </button>
        <button
          type="button"
          className="group h-full w-10 shrink-0 border-l-2  p-[.2rem] hover:bg-white"
          onPointerUp={onClose}
        >
          <StaticImage
            src="../images/close.png"
            title="close"
            alt="close"
            placeholder="none"
            draggable={false}
            width={36}
            className="group-hover:invert"
            loading="eager"
            imgClassName="!transition-none"
          />
        </button>
      </motion.div>
    </div>
  );
};

export default WindowHeader;
