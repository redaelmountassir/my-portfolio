import { motion, steps } from "motion/react";
import { useContext } from "react";
import { MobileContext } from "../store/MobileContext";
import MobileTaskbar from "./MobileTaskbar";
import TaskbarContents from "./TaskbarContents";

const Taskbar = () => {
	const isMobile = useContext(MobileContext);

	if (isMobile) return <MobileTaskbar />;

	return (
		<motion.nav
			className="backdrop-blur-parent fixed bottom-0 flex w-full bg-linear-to-r from-black-primary/75 from-25% to-dark-primary/75 to-70% font-bold text-white outline-2 outline-white-primary md:top-0 md:bottom-auto"
			variants={{
				unloaded: { opacity: 0, y: "-100%" },
				loaded: {
					opacity: 1,
					y: 0,
					transition: {
						type: "tween",
						ease: steps(5),
						delay: 0.5,
					},
				},
			}}
		>
			<TaskbarContents />
		</motion.nav>
	);
};

export default Taskbar;
