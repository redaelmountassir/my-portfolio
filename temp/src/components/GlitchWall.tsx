import React, { useEffect, useMemo, useRef } from "react";
import { randomChar } from "../utils";

const APPROX_CHAR_W = 15;
const APPROX_CHAR_H = 35;

const GlitchWall: React.FC<{ duration?: number }> = ({ duration = 6000 }) => {
  const mask = "radial-gradient(circle, transparent 128px, white 256px)";
  const textRef = useRef<HTMLParagraphElement>(null);

  //Doesn't create a new array every frame now
  const array = useMemo(() => {
    const charCount = Math.ceil(
      (window.innerWidth / APPROX_CHAR_W) *
        (window.innerHeight / APPROX_CHAR_H) +
        100,
    );
    return Array.from(Array(charCount));
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      if (!textRef.current) return;
      textRef.current.textContent = array.map(randomChar).join("");
    }, 60);

    let timeout: NodeJS.Timeout;
    if (duration !== Infinity)
      timeout = setTimeout(() => clearInterval(interval), duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <p
      className="pointer-events-none absolute top-1/2 -z-10 h-full w-full -translate-y-1/2 break-all text-center text-3xl text-purple-watermark opacity-40"
      style={{ mask, WebkitMask: mask }}
      ref={textRef}
    />
  );
};

export default GlitchWall;
