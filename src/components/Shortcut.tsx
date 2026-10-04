import React from "react";
import { useSystemKeys } from "../store";
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

	return (
		<button
			className={cn(
				"group flex h-auto max-h-full w-24 items-center p-2 outline-2 outline-offset-8 outline-transparent transition-all ease-steps-2 hover:outline-offset-0 hover:outline-white-primary focus-visible:outline-offset-0 focus-visible:outline-pink-accent active:outline-offset-0 active:outline-white-primary focus-visible:active:outline-white-primary md:p-4 md:active:shadow-[inset_0_0_70px]",
				tile ? "flex-col gap-2" : "w-full gap-6 md:gap-4 md:py-2",
			)}
			type="button"
			onClick={
				overrideClick ??
				(e =>
					addWindow({
						...sysObj,
						htmlElement:
							e.target instanceof HTMLElement
								? e.target
								: undefined,
					}))
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
						? "text-center text-sm shadow-black-primary md:shadow-[inset_0_0_40px] md:group-active:shadow-none"
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
