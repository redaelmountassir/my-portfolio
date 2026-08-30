import React from "react";
import { createContext, useEffect } from "react";
import { cn, useBreakpointMD, useBreakpointShort } from "../utils";
// import ShortcutsArea from "../../temp/src/components/ShortcutsArea";
// import Background from "../../temp/src/components/Background";
// import Taskbar from "../../temp/src/components/Taskbar";
// import MobileTaskbar from "../../temp/src/components/MobileTaskbar";
// import Intro from "../../temp/src/components/Intro";
import { usePersistent } from "../utils";
import Loader from "./Loader";
import { Head } from "./Head";
// import WindowsArea from "../../temp/src/components/WindowsArea";
// import Modifiers from "../../temp/src/components/Modifiers";
import { useReducedMotion } from "motion/react";

export const MobileContext = createContext(true);

const OS = () => {
	const wide = useBreakpointMD();
	const tall = useBreakpointShort();
	const isMobile = !wide || !tall;
	const reducedMotion = useReducedMotion();
	const mainRef = React.useRef<HTMLDivElement>(null);
	let ran = false;

	//Updates global css properties
	useEffect(() => {
		if (ran) return;
		ran = true;

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
		`);

		const documentStyle = document.documentElement.style;
		const updateVH = () =>
			documentStyle.setProperty("--vh-full", `${window.innerHeight}px`);
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
			documentStyle.removeProperty("--vh-full");
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
					"relative h-screen w-screen overflow-hidden bg-black",
					"h-(--vh-full)",
					isMobile && "use-scrollbar",
				)}
				ref={mainRef}
				id="invert-layer"
			>
				{/* {ready &&
					(introDone ? (
						<>
							<Loader />
							<Background />
							{isMobile ? <MobileTaskbar /> : <Taskbar />}
							<ShortcutsArea />
							<WindowsArea />
						</>
					) : (
						<Intro onFinish={() => setIntroDone(true)} />
					))} */}
				<Loader />
			</main>
			{/* <Modifiers /> */}
		</MobileContext.Provider>
	);
};

export default OS;
