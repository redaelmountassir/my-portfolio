import React from "react";
import { SystemObject } from "../store/types";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

interface IconProps
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  sysObj: SystemObject;
}

const selectIcon = (sysObj: SystemObject) => {
  if (!("ext" in sysObj))
    return sysObj.name === "Trash"
      ? "trash.png"
      : sysObj.children.length
        ? "folder.png"
        : "folder_empty.png"; //Special folder
  if (sysObj.ext === "mys") return "mystery.gif";
  if (!(sysObj.ext === "exe")) return `${sysObj.ext}.png`;
  return `${sysObj.name.toLowerCase()}.png`;
};

const Icon: React.FC<IconProps> = ({ sysObj, ...props }) => {
  if (!("value" in sysObj) || !sysObj.value || typeof sysObj.value === "string")
    return (
      <img
        {...props}
        draggable={false}
        src={`/icons/${selectIcon(sysObj)}`}
        loading="eager"
        alt=""
      />
    );

  const image = getImage(sysObj.value.logo);
  return image ? (
    <GatsbyImage
      className={props.className}
      imgClassName="transition-none"
      style={{ width: "", height: "", ...props.style }}
      alt=""
      draggable={false}
      image={image}
    />
  ) : null;
};

export default Icon;
