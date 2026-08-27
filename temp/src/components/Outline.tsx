import { motion } from "framer-motion";
import React from "react";

interface OutlineProps {
  ghost?: boolean;
}

const Outline: React.FC<OutlineProps> = ({ ghost }) => {
  return (
    <svg
      className="pointer-events-none absolute"
      style={{ transform: "translate(-2px, -2px)" }}
      width="calc(100% + 4px)"
      height="calc(100% + 4px)"
    >
      <motion.rect
        width="100%"
        height="100%"
        className="fill-none stroke-white-primary"
        strokeDasharray="400%"
        strokeWidth={4}
        initial={{ strokeDashoffset: "-400%" }}
        animate={{ strokeDashoffset: "0%" }}
        transition={{
          ease: "linear",
          duration: 1,
        }}
      />
      {ghost && (
        <motion.rect
          width="100%"
          height="100%"
          className="visible fill-none stroke-white-primary"
          strokeDasharray={20}
          strokeWidth={4}
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: 40 }}
          transition={{
            ease: "linear",
            duration: 1,
            repeat: Infinity,
          }}
        />
      )}
    </svg>
  );
};

export default Outline;
