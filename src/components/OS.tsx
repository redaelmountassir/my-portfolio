import { useReducedMotion } from "motion/react";
import React, { useEffect } from "react";
import { MobileContext } from "../store/MobileContext";
import {
	cn,
	useBreakpointMD,
	useBreakpointShort,
	usePersistent,
} from "../utils";
import Background from "./Background";
import Desktop from "./Desktop";
import Head from "./Head";
import Intro from "./Intro";
import LiveRegion from "./LiveRegion";
import Loader from "./Loader";
import Modifiers from "./Modifiers";
import Taskbar from "./Taskbar";
import WindowsArea from "./WindowsArea";

const OS = () => {
	const wide = useBreakpointMD();
	const tall = useBreakpointShort();
	const isMobile = !wide || !tall;
	const reducedMotion = useReducedMotion();
	const mainRef = React.useRef<HTMLElement>(null);

	//Updates global css properties
	useEffect(() => {
		console.log(`
-------------------------------------------------------

  ▄▄▄▄▄▄                        ▄▄▄▄▄▄▄▄    ▄▄▄▄▄   
 █▀██▀▀▀█▄           █▄       ▄██▀▀▀▀▀▀██▄ ██▀▀▀▀█▄ 
   ██▄▄▄█▀           ██       ██        ██ ▀██▄   
   ██▀▀█▄   ▄█▀█▄ ▄████ ▄▀▀█▄ ██   ▀▀   ██   ▀██▄▄  
 ▄ ██  ██   ██▄█▀ ██ ██ ▄█▀██ ██▄      ▄██ ▄   ▀██▄ 
 ▀██▀  ▀██▀▄▀█▄▄▄▄█▀███▄▀█▄██  ▀████████▀  ▀██████▀ 

-------------------------------------------------------

Thank you for checking out my project in futher detail :).
If the logo looks goofy, try resizing the window. Also,
there may be some secrets hidden throughout the portfolio,
though you didn't hear that from me... 
		`); // Only double prints in dev mode!

		const updateVH = () =>
			document.documentElement.style.setProperty(
				"--vh-full",
				`${window.innerHeight}px`,
			);
		window.addEventListener("resize", updateVH);
		window.addEventListener("orientationchange", updateVH);
		updateVH();

		//I don't know why this is a bug
		if (mainRef.current)
			!isMobile
				? mainRef.current.classList.remove("use-scrollbar")
				: mainRef.current.classList.add("use-scrollbar");

		return () => {
			window.removeEventListener("resize", updateVH);
			window.removeEventListener("orientationchange", updateVH);
			document.documentElement.style.removeProperty("--vh-full");
		};
	}, []);

	const [introDone, setIntroDone] = usePersistent(
		"introDone",
		isMobile || (reducedMotion ?? false),
		str => str === "true",
	);

	return (
		<MobileContext.Provider value={isMobile}>
			<Head />
			<LiveRegion />
			<Loader
				enable={introDone}
				className={cn(
					"relative h-(--vh-full,100vh) w-screen overflow-hidden bg-black-primary",
					isMobile && "use-scrollbar",
				)}
				ref={mainRef}
				id="invert-layer"
			>
				<Background />
				<Desktop />
				<WindowsArea />
				<Taskbar />
			</Loader>
			<Modifiers />
			{!introDone && <Intro onComplete={() => setIntroDone(true)} />}
		</MobileContext.Provider>
	);
};

export default OS;
