import { useContext, useEffect } from "react";
import bonziBuddyImg from "../../assets/images/bonzi_buddy.gif";
import { useSystemKeys } from "../../store";
import { pickRand, randomChar } from "../../utils";
import { InternalWindowDataContext } from "../window/Window";

const TITLES = [
	"Uh oh",
	"Big mistake",
	"Why'd you click it",
	"Better close this quick!",
	"A textbook example of exponential growth",
	"How many before we crash!",
];

const Virus = () => {
	const windowData = useContext(InternalWindowDataContext);
	const { addWindow } = useSystemKeys("addWindow");

	useEffect(() => {
		if (!windowData) return;
		const { setTitle, sysObj } = windowData;
		setTitle(pickRand(TITLES) ?? "");
		let interval = -1;
		const timeout = setTimeout(
			() =>
				(interval = setInterval(() => {
					setTitle(Array.from({ length: 50 }, randomChar).join(""));
					addWindow(sysObj);
				}, 1000)),
			1000,
		);

		return () => {
			clearTimeout(timeout);
			if (interval !== -1) clearInterval(interval);
		};
	}, [windowData, addWindow]);

	if (!windowData) return;

	return (
		<img
			src={bonziBuddyImg}
			alt="Loser"
			className="h-full bg-[url('/bg_imgs/rainbow.png')] bg-contain bg-repeat object-contain"
		/>
	);
};

export default Virus;
