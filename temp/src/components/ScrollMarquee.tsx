import {
  motion,
  MotionValue,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useVelocity,
} from "framer-motion";
import React, { useRef } from "react";
import { mod } from "../utils";

interface MarqueeProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  frameTime?: number;
  flexMode?: boolean;
  scroll?: MotionValue<number>;
  innerClass?: string;
  panSpeed?: number;
  scrollStrength?: number;
  vertical?: boolean;
}

const ScrollMarquee: React.FC<MarqueeProps> = (props) => {
  const {
    children,
    className = "",
    innerClass = "",
    flexMode = false,
    panSpeed = 10,
    scrollStrength = 0.002,
    vertical = false,
    scroll = useScroll().scrollY,
    frameTime = 150,
    style,
    ...rest
  } = props;

  const fullInnerClass = `inline-block ${vertical ? "min-h-full" : "min-w-full"} ${innerClass}`;
  const smoothScroll = useSpring(useVelocity(scroll), {
    damping: 50,
    stiffness: 400,
  });
  const x = useMotionValue("0%");
  const secondX = useMotionValue("100%");
  const data = useRef({ timeSince: 0, val: 0 });
  useAnimationFrame((_, delta) => {
    data.current.val =
      mod(
        data.current.val +
          delta * 0.001 * panSpeed +
          smoothScroll.get() * scrollStrength +
          100,
        200,
      ) - 100;

    data.current.timeSince += delta;
    if (data.current.timeSince > frameTime) {
      data.current.timeSince = 0;
      x.set(`${data.current.val}%`);
      secondX.set(`${(data.current.val > 0 ? -100 : 100) + data.current.val}%`);
    }
  });

  return (
    <div
      {...rest}
      className={`${className} group relative ${vertical ? !flexMode && "h-full" : "w-full"} overflow-hidden whitespace-nowrap`}
      style={{
        ...style,
        textOrientation: vertical ? "upright" : style?.textOrientation,
        writingMode: vertical ? "vertical-lr" : style?.writingMode,
      }}
    >
      <motion.span
        className={`${flexMode && "absolute"} ${fullInnerClass}`}
        style={vertical ? { y: x } : { x }}
      >
        {children}
      </motion.span>
      <motion.span
        className={`absolute ${vertical ? "top-0" : "left-0"} ${fullInnerClass}`}
        style={vertical ? { y: secondX } : { x: secondX }}
      >
        {children}
      </motion.span>
    </div>
  );
};

export default ScrollMarquee;
