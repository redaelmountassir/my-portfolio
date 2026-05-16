import React from "react";
import { motion } from "framer-motion";
import { ease5Steps } from "../utils";
import TaskbarContents from "./TaskbarContents";

const Taskbar: React.FC = () => {
  return (
    <motion.nav
      className="backdrop-blur-parent fixed bottom-0 z-30 flex w-full bg-linear-to-r from-black-primary/75 from-25% to-dark-primary/75 to-70% font-bold text-white outline-2 outline-white-primary md:bottom-auto md:top-0"
      variants={{
        unloaded: { opacity: 0, y: "-100%" },
        loaded: {
          opacity: 1,
          y: 0,
          transition: {
            type: "tween",
            ease: ease5Steps,
            delay: 0.5,
          },
        },
      }}
    >
      <TaskbarContents />
    </motion.nav>
  );
};

export default Taskbar;
