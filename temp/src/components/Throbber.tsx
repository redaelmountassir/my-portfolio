import { Sphere } from "@react-three/drei";
import { motion } from "framer-motion-3d";
import { Colors } from "../utils";
import React from "react";

const DOTS = 10;
const RADIUS = 0.75;
export const Throbber = () => {
  return (
    <group>
      {Array(DOTS)
        .fill(0)
        .map((_, i) => {
          i /= DOTS;
          return (
            <Sphere
              key={i}
              args={[0.15]}
              position={[
                Math.sin(i * 2 * Math.PI) * RADIUS,
                Math.cos(i * 2 * Math.PI) * RADIUS,
                0,
              ]}
            >
              <motion.meshBasicMaterial
                color={Colors.whitePrimary}
                animate={{
                  color: Colors.blackPrimary,
                }}
                transition={{
                  repeat: Infinity,
                  delay: i * -1.5,
                  duration: ((DOTS - 1) / DOTS) * 1.5,
                  type: "tween",
                  ease: "circOut",
                }}
              />
            </Sphere>
          );
        })}
    </group>
  );
};
