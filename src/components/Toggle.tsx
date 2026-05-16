import { motion } from "framer-motion";
import React, { memo } from "react";

interface ToggleProps {
  state: boolean;
  setter:
    | React.Dispatch<React.SetStateAction<boolean>>
    | ((value: boolean) => void);
  children: string;
}

const Toggle: React.FC<ToggleProps> = memo(
  ({ state, setter, children }) => {
    return (
      <button
        type="button"
        onClick={() => setter(!state)}
        className="my-2 flex w-full cursor-pointer items-center justify-between whitespace-nowrap"
      >
        {children}
        <div
          className={`ml-4 h-6 w-14 p-1 outline-2 outline-white-primary transition-colors ease-steps2 ${
            state && "bg-linear-to-r from-pink-accent to-blue-accent"
          }`}
        >
          <motion.div
            className="h-full w-1/2 bg-white-primary shadow-[-2px_-2px_inset] shadow-light-primary"
            animate={{
              x: state ? "100%" : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 800,
              damping: 30,
            }}
          />
        </div>
      </button>
    );
  },
  ({ state, children }, newProps) => {
    return state === newProps.state && newProps.children === children;
  },
);

export default Toggle;
