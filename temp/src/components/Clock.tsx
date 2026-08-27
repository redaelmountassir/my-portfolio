import React from "react";
import { Colors } from "../utils";

const Clock: React.FC<{ now?: Date }> = ({ now }) => {
  const secs = now?.getSeconds() ?? 0;
  const minHand = (now?.getMinutes() ?? 0) * 60 + secs;
  const hrHand = ((now?.getHours() ?? 0) % 12) * 3600 + minHand;
  return (
    <>
      <p className="whitespace-nowrap">
        {now?.toLocaleDateString() ?? "Loading..."}
      </p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -0.5 32 32"
        shapeRendering="crispEdges"
        className="mt-4"
      >
        <path
          stroke={Colors.whitePrimary}
          opacity=".3"
          d="M12 0h8M9 1h3M20 1h3M7 2h2M15 2h2M23 2h2M6 3h1M15 3h2M25 3h1M5 4h1M26 4h1M4 5h1M9 5h1M22 5h1M27 5h1M3 6h1M28 6h1M2 7h1M29 7h1M2 8h1M29 8h1M1 9h1M30 9h1M1 10h1M5 10h1M26 10h1M30 10h1M1 11h1M30 11h1M0 12h1M31 12h1M0 13h1M31 13h1M0 14h1M31 14h1M0 15h1M2 15h2M28 15h2M31 15h1M0 16h1M2 16h2M28 16h2M31 16h1M0 17h1M31 17h1M0 18h1M31 18h1M0 19h1M31 19h1M1 20h1M30 20h1M1 21h1M5 21h1M26 21h1M30 21h1M1 22h1M30 22h1M2 23h1M29 23h1M2 24h1M29 24h1M3 25h1M28 25h1M4 26h1M9 26h1M22 26h1M27 26h1M5 27h1M26 27h1M6 28h1M15 28h2M25 28h1M7 29h2M15 29h2M23 29h2M9 30h3M20 30h3M12 31h8"
        />
        <rect
          fill={Colors.whitePrimary}
          width="1"
          height="10"
          x="15.75"
          y="13.5"
          transform={`rotate(${(hrHand / 43200) * 360 + 180})`}
          transform-origin="16 15.5"
          className="drop-shadow-[1px_1px_0_rgb(0_0_0/0.1)]"
        />
        <rect
          fill={Colors.whitePrimary}
          width=".75"
          height="18"
          x="15.625"
          y="13.5"
          transform={`rotate(${minHand * 0.1 + 180})`}
          transform-origin="16 15.5"
          className="drop-shadow-[1px_1px_0_rgb(0_0_0/0.1)]"
        />
        <rect
          fill={Colors.pinkAccent}
          width=".5"
          height="16"
          x="15.75"
          y="13.5"
          transform={`rotate(${secs * 6 + 180})`}
          transform-origin="16 15.5"
        />
      </svg>
    </>
  );
};

export default Clock;
