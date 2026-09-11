import { motion } from "motion/react";
import backImg from "../assets/images/back.png";
import homeImg from "../assets/images/home.png";
import menuImg from "../assets/images/menu.png";
import { useBoundStore, useMobileStore } from "../store";
import { cn, ease5Steps } from "../utils";
import MobileTaskbarPanel from "./MobileTaskbarPanel";
import SmartImage from "./SmartImage";

const MobileTaskbar = () => {
	const [toggleMenu, home, back, windowOpen, menuOpen] = useMobileStore(
		state => [
			state.toggleMenu,
			state.home,
			state.back,
			state.windowOpen,
			state.menuOpen,
		],
	);
	const windows = useBoundStore(state => state.windows.length);

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
					className={cn(
						"relative flex from-black-primary/75 from-25% to-dark-primary/75 to-70% text-white outline-2 outline-white-primary",
						(!windowOpen || menuOpen) && "bg-linear-to-r",
					)}
				>
					<button
						className="flex grow justify-center short:py-2"
						type="button"
						onClick={() => {
							if (windows == 0 && menuOpen) return home();
							toggleMenu();
						}}
					>
						<SmartImage
							src={menuImg}
							alt="menu"
							draggable="false"
							className="p-12"
						/>
					</button>
					<button
						className="flex grow justify-center short:py-2"
						type="button"
						onClick={() => home()}
					>
						<SmartImage
							src={homeImg}
							alt="home"
							draggable="false"
							className="p-12"
						/>
					</button>
					<button
						className="flex grow justify-center short:py-2"
						type="button"
						onClick={() => back()}
					>
						<SmartImage
							src={backImg}
							alt="back"
							draggable="false"
							className="p-12"
						/>
					</button>
				</div>
			</motion.nav>
		</>
	);
};

export default MobileTaskbar;
