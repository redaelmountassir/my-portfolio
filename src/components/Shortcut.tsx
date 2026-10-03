import React, { useContext } from "react";
import { useSystemKeys } from "../store";
import { MobileContext } from "../store/MobileContext";
import { isFile, type SystemObject } from "../store/types";
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
				"group flex h-auto max-h-full w-24 items-center p-2 outline-2 outline-offset-8 outline-transparent transition-all ease-steps-2 hover:outline-offset-0 hover:outline-white-primary md:p-4 md:active:shadow-[inset_0_0_70px] md:active:outline-offset-0 md:active:outline-white-primary",
				tile ? "flex-col gap-2" : "w-full gap-6 md:gap-4 md:py-2",
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
					"pointer-events-none",
					tile ? "size-16 md:mb-4" : "size-16 shrink-0",
				)}
				sysObj={sysObj}
			/>
			<p
				className={cn(
					"max-w-[175%] p-2 leading-none wrap-break-word text-white-primary transition-all ease-steps-2 select-none",
					tile
						? "text-center text-sm shadow-[inset_0_0_40px] shadow-black-primary md:group-active:shadow-none"
						: "flex-1 overflow-hidden text-left text-base text-nowrap text-ellipsis",
				)}
			>
				{sysObj.name}
				{isFile(sysObj) && sysObj.ext !== "exe" ? `.${sysObj.ext}` : ""}
			</p>
		</button>
	);
};

export default Shortcut;
