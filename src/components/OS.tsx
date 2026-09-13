import { useReducedMotion } from "motion/react";
import React, { createContext, useEffect } from "react";
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
import Loader from "./Loader";
import MobileTaskbar from "./MobileTaskbarPanel";
import Taskbar from "./Taskbar";

export const MobileContext = createContext(true);

const OS = () => {
	const wide = useBreakpointMD();
	const tall = useBreakpointShort();
	const isMobile = !wide || !tall;
	const reducedMotion = useReducedMotion();
	const mainRef = React.useRef<HTMLDivElement>(null);

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

	const [ready, introDone, setIntroDone] = usePersistent(
		"introDone",
		isMobile || (reducedMotion ?? false),
		str => str === "true",
	);

	return (
		<MobileContext.Provider value={isMobile}>
			<Head />
			<main
				className={cn(
					"relative h-(--vh-full,100vh) w-screen overflow-hidden bg-black",
					isMobile && "use-scrollbar",
				)}
				ref={mainRef}
				id="invert-layer"
			>
				{ready &&
					(introDone ? (
						<>
							<Loader />
							<Background />
							{isMobile ? <MobileTaskbar /> : <Taskbar />}
							<Desktop />
							{/* <WindowsArea /> */}
						</>
					) : (
						<Intro onFinish={() => setIntroDone(true)} />
					))}
			</main>
			{/* <Modifiers /> */}
		</MobileContext.Provider>
	);
};

export default OS;
