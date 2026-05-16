import React, { memo } from "react";
import { useBoundStore, useMobileStore } from "../store";
import { StaticImage } from "gatsby-plugin-image";
import { ease5Steps } from "../utils";
import { motion } from "framer-motion";
import MobileTaskbarPanel from "./MobileTaskbarPanel";

const MobileTaskbar = memo(() => {
	const [toggleMenu, home, back, windowOpen, menuOpen] = useMobileStore(
		(state) => [
			state.toggleMenu,
			state.home,
			state.back,
			state.windowOpen,
			state.menuOpen,
		],
	);
	const windows = useBoundStore((state) => state.windows.length);

	return (
		<>
			<MobileTaskbarPanel />
			<motion.nav
				className="fixed bottom-0 z-30 w-full p-0 font-bold short:px-4 short:py-2"
				variants={{
					unloaded: { opacity: 0, y: "100%" },
					loaded: {
						opacity: 1,
						y: 0,
						transition: {
							type: "tween",
							ease: ease5Steps,
							delay: 0.5,
						},
					},
				}}
			>
				<div
					className={`relative flex from-black-primary/75 from-25% to-dark-primary/75 to-70% text-white outline-2 outline-white-primary ${(!windowOpen || menuOpen) && "bg-linear-to-r"}`}
				>
					<button
						className="flex grow justify-center short:py-2"
						type="button"
						onClick={() => {
							if (windows == 0 && menuOpen) return home();
							toggleMenu();
						}}
					>
						<StaticImage
							src="../images/menu.png"
							alt="menu"
							placeholder="none"
							draggable={false}
							width={48}
							height={48}
						/>
					</button>
					<button
						className="flex grow justify-center short:py-2"
						type="button"
						onClick={() => home()}
					>
						<StaticImage
							src="../images/home.png"
							alt="home"
							placeholder="none"
							draggable={false}
							width={48}
							height={48}
						/>
					</button>
					<button
						className="flex grow justify-center short:py-2"
						type="button"
						onClick={() => back()}
					>
						<StaticImage
							src="../images/back.png"
							alt="back"
							placeholder="none"
							draggable={false}
							width={48}
							height={48}
						/>
					</button>
				</div>
			</motion.nav>
		</>
	);
});

export default MobileTaskbar;
