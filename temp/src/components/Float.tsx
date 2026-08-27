import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import React, { useMemo } from "react";
import { createNoise2D } from "simplex-noise";

interface FloatProps {
  strength?: number;
  speed?: number;
  children: React.ReactNode;
  className?: string;
}

const Float: React.FC<FloatProps> = ({
  strength = 7,
  speed = 0.0002,
  children,
  className,
}) => {
  const [noiseX, noiseY] = useMemo(
    () => [createNoise2D(), createNoise2D()],
    [],
  );
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useAnimationFrame((time) => {
    time *= speed;
    let xNoise = (noiseX(time, 0) + noiseX(time, 100) * 0.5) / 1.5;
    let yNoise = (noiseY(time, 0) + noiseY(time, 100) * 0.5) / 1.5;
    x.set(xNoise * strength);
    y.set(yNoise * strength);
  });

  return (
    <motion.div className={className} style={{ x, y }}>
      {children}
    </motion.div>
  );
};

export default Float;
