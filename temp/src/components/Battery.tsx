import React from "react";

interface BatteryProps
  extends React.DetailedHTMLProps<
    React.SVGAttributes<SVGSVGElement>,
    SVGSVGElement
  > {
  level: number;
}

const PATHS = [
  "M2 5h2M2 6h2M2 7h2M2 8h2M2 9h2M2 10h2",
  "M5 5h2M5 6h2M5 7h2M5 8h2M5 9h2M5 10h2",
  "M8 5h2M8 6h2M8 7h2M8 8h2M8 9h2M8 10h2",
  "M11 5h2M11 6h2M11 7h2M11 8h2M11 9h2M11 10h2",
];

const Battery: React.FC<BatteryProps> = (props) => {
  const { level, ...rest } = props;
  const levelScaled = level * PATHS.length;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -0.5 16 16"
      shapeRendering="crispEdges"
      {...rest}
    >
      <path
        className="stroke-current"
        d="M0 3h15M0 4h1M14 4h1M0 5h1M14 5h2M0 6h1M14 6h2M0 7h1M14 7h2M0 8h1M14 8h2M0 9h1M14 9h2M0 10h1M14 10h2M0 11h1M14 11h1M0 12h15"
      />
      {PATHS.map((path, i, arr) => (
        <path
          className={
            levelScaled > i
              ? `stroke-current ${levelScaled < i + 0.5 && "animate-pulse"}`
              : ""
          }
          key={path}
          d={path}
        />
      ))}
    </svg>
  );
};

export default Battery;
