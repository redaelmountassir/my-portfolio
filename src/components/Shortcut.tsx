import React, { useContext } from "react";
import { useSystemKeys } from "../store";
import { MobileContext } from "../store/MobileContext";
import type { SystemObject } from "../store/types";
import { cn } from "../utils";
import Icon from "./Icon";

interface ShortcutProps {
	sysObj: SystemObject;
	overrideClick?: React.MouseEventHandler<HTMLButtonElement>;
	tile?: boolean;
}

const Shortcut = ({ sysObj, overrideClick, tile = true }: ShortcutProps) => {
	const { addWindow } = useSystemKeys("addWindow");
	const isMobile = useContext(MobileContext);

	return (
		<button
			className={cn(
				"group ease-steps-2 flex h-auto max-h-full w-24 flex-col items-center gap-2 p-2 outline-2 outline-offset-8 outline-transparent transition-all hover:outline-offset-0 hover:outline-white-primary md:p-4 md:active:shadow-[inset_0_0_70px] md:active:outline-offset-0 md:active:outline-white-primary",
				!tile && "w-full gap-6 md:gap-4 md:py-2",
			)}
			type="button"
			onDoubleClick={
				overrideClick
					? e => !isMobile && overrideClick(e)
					: e =>
							!isMobile &&
							addWindow({
								...sysObj,
								htmlElement:
									e.target instanceof HTMLElement
										? e.target
										: undefined,
							})
			}
			onClick={
				overrideClick
					? e => isMobile && overrideClick(e)
					: e =>
							isMobile &&
							addWindow({
								...sysObj,
								htmlElement:
									e.target instanceof HTMLElement
										? e.target
										: undefined,
							})
			}
		>
			<Icon
				className={cn(
					"pointer-events-none size-10",
					tile ? "size-16 md:mb-4" : "shrink-0 xs:size-16 md:size-10",
				)}
				sysObj={sysObj}
			/>
			<p
				className={cn(
					"ease-steps-2 max-w-[175%] p-2 text-sm leading-none wrap-break-word text-white-primary transition-all select-none",
					tile
						? "text-center shadow-[inset_0_0_40px] shadow-black-primary md:group-active:shadow-none"
						: "flex-1 overflow-hidden text-nowrap text-ellipsis xs:text-base md:text-sm",
				)}
			>
				{sysObj.name}
				{"ext" in sysObj && sysObj.ext !== "exe"
					? `.${sysObj.ext}`
					: ""}
			</p>
		</button>
	);
};

export default Shortcut;
