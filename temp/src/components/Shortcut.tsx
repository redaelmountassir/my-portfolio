import React from "react";
import type { SystemObject } from "../store/types";
import Icon from "./Icon";
import { useBoundStore } from "../store";
import { useContext } from "react";
import { MobileContext } from "./OS";

interface ShortcutPros {
  sysObj: SystemObject;
  overrideClick?: React.MouseEventHandler<HTMLButtonElement>;
  tile?: boolean;
}

const Shortcut: React.FC<ShortcutPros> = ({
  sysObj,
  overrideClick,
  tile = true,
}) => {
  const [addWindow] = useBoundStore((state) => [state.addWindow]);
  const isMobile = useContext(MobileContext);

  return (
    <button
      className={`group flex h-auto max-h-full w-24 items-center p-2 outline-2 outline-offset-8 outline-transparent transition-all ease-steps2 hover:outline-offset-0 hover:outline-white-primary md:p-4 md:active:shadow-[inset_0_0_70px] md:active:outline-offset-0 md:active:outline-white-primary ${tile ? "flex-col gap-2" : "w-full gap-6 md:gap-4 md:py-2"}`}
      type="button"
      onDoubleClick={
        overrideClick
          ? (e) => !isMobile && overrideClick(e)
          : (e) =>
              !isMobile &&
              addWindow({
                ...sysObj,
                htmlElement:
                  e.target instanceof HTMLElement ? e.target : undefined,
              })
      }
      onClick={
        overrideClick
          ? (e) => isMobile && overrideClick(e)
          : (e) =>
              isMobile &&
              addWindow({
                ...sysObj,
                htmlElement:
                  e.target instanceof HTMLElement ? e.target : undefined,
              })
      }
    >
      <Icon
        className={`pointer-events-none ${tile ? "h-16 w-16 md:mb-4" : "h-10 w-10 shrink-0 md:h-10 md:w-10 xs:h-16 xs:w-16"}`}
        sysObj={sysObj}
      />
      <p
        className={`max-w-[175%] select-none wrap-break-word p-2 leading-none text-white-primary transition-all ease-steps2 ${tile ? "text-center text-sm shadow-[inset_0_0_40px] shadow-black-primary md:group-active:shadow-none" : "flex-1 overflow-hidden text-ellipsis text-nowrap text-left text-sm md:text-sm xs:text-base"}`}
      >
        {sysObj.name}
        {"ext" in sysObj && sysObj.ext !== "exe" ? `.${sysObj.ext}` : ""}
      </p>
    </button>
  );
};

export default Shortcut;
