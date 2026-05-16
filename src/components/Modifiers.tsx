import React from "react";
import { useSettingsStore } from "../store";
import { map } from "../utils";
import { motion } from "framer-motion";
import staticVid from "../videos/static.mp4";

const Modifiers = () => {
  const [brightness, scanlines, useStatic, useFlicker] = useSettingsStore(
    (state) => [
      state.brightness,
      state.scanlines,
      state.useStatic,
      state.useFlicker,
    ],
  );
  return (
    <>
      <div
        className="pointer-events-none fixed top-0 z-50 h-full w-full bg-black"
        style={{ opacity: map(brightness, 0, 100, 0.8, 0) }}
      />
      {useStatic && (
        <video
          className="pointer-events-none fixed top-0 z-50 h-full w-full object-cover mix-blend-color-dodge"
          muted
          autoPlay
          loop
          playsInline
        >
          <source src={staticVid} type="video/mp4" />
        </video>
      )}
      {scanlines && (
        <motion.div
          className="pointer-events-none fixed bottom-0 z-50 box-content h-full w-full bg-linear-to-b from-transparent via-black bg-size-[100%_10px] bg-repeat-y pt-3 opacity-5"
          initial={{ y: 0 }}
          animate={{ y: 10 }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "linear",
          }}
        />
      )}
      {useFlicker && (
        <div className="full-flicker pointer-events-none fixed top-0 z-50 h-full w-full bg-black/20" />
      )}
    </>
  );
};

export default Modifiers;
