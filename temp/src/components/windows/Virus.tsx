import React, { useContext, useEffect, useMemo } from "react";
import { WindowDataContext } from "../Window";
import { pickRand, randomChar } from "../../utils";
import bonziBuddyImg from "../../images/bonzi_buddy.gif";
import { useBoundStore } from "../../store";

const TITLES = [
	"Uh oh",
	"Big mistake",
	"Why'd you click it",
	"Better close this quick!",
	"A textbook example of exponential growth",
	"How many before we crash!",
];

const Virus = () => {
	const windowData = useContext(WindowDataContext);
	if (!windowData) return;
	const { setTitle, sysObj } = windowData;
	const array = useMemo(() => Array.from(Array(50)), []);
	const addWindow = useBoundStore((state) => state.addWindow);
	useEffect(() => {
		setTitle(pickRand(TITLES) ?? "");
		let interval: NodeJS.Timeout | null = null;
		const timeout = setTimeout(
			() =>
				(interval = setInterval(() => {
					setTitle(array.map(randomChar).join(""));
					addWindow(sysObj);
				}, 1000)),
			1000,
		);

		return () => {
			clearTimeout(timeout);
			interval && clearInterval(interval);
		};
	}, []);

	return (
		<img
			src={bonziBuddyImg}
			alt="Loser"
			className="h-full bg-[url('/bg_imgs/rainbow.png')] bg-contain bg-repeat object-contain"
		/>
	);
};

export default Virus;
