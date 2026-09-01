// import ShortcutsArea from "./ShortcutsArea";
// import Background from "./Background";
// import Taskbar from "./Taskbar";
// import MobileTaskbar from "./MobileTaskbar";
// import WindowsArea from "./WindowsArea";
// import Modifiers from "./Modifiers";
import Loader from "./Loader";
import Intro from "./Intro";
import Head from "./Head";
import React from "react";
import { createContext, useEffect } from "react";
import { cn, useBreakpointMD, useBreakpointShort } from "../utils";
import { usePersistent } from "../utils";
import { useReducedMotion } from "motion/react";

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
					"relative w-screen overflow-hidden bg-black h-(--vh-full,100vh)",
					isMobile && "use-scrollbar",
				)}
				ref={mainRef}
				id="invert-layer"
			>
				{ready &&
					(introDone ? (
						<>
							<Loader />
							{/* <Background />
							{isMobile ? <MobileTaskbar /> : <Taskbar />}
							<ShortcutsArea />
							<WindowsArea /> */}
						</>
					) : (
						<Intro onFinish={() => setIntroDone(true)} />
					))}
				{/* <Intro onFinish={() => setIntroDone(true)} /> */}
			</main>
			{/* <Modifiers /> */}
		</MobileContext.Provider>
	);
};

export default OS;
