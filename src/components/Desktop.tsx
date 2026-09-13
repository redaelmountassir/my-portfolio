import { type Variants, motion } from "motion/react";
import { useBoundStore } from "../store";
import Shortcut from "./Shortcut";

const itemVariants: Variants = {
	unloaded: {
		opacity: 0,
		scale: 2,
	},
	loaded: {
		opacity: 1,
		scale: 1,
	},
};

const listVariants: Variants = {
	loaded: {
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.25,
		},
	},
};

const Desktop = () => {
	const desktop = useBoundStore(state =>
		state.navigate("users/@redaelmountassir/Desktop"),
	);
	const shortcuts = desktop && "children" in desktop ? desktop.children : [];

	return (
		<motion.ul
			className="pointer-events-none absolute top-0 grid h-full w-full grid-cols-3 grid-rows-2 justify-items-center p-4 pt-20 pb-24 xs:grid-cols-5 sm:grid-cols-6! md:flex md:items-start md:pb-4 short:grid-rows-3 average:grid-rows-4 tall:grid-rows-5"
			style={{ gridAutoRows: 0 }}
			initial="unloaded"
			animate="loaded"
			variants={listVariants}
		>
			{shortcuts.map((shortcut, i) => (
				<motion.li
					key={shortcut.name + i}
					variants={itemVariants}
					className="pointer-events-auto"
				>
					<Shortcut sysObj={shortcut} />
				</motion.li>
			))}
		</motion.ul>
	);
};

export default Desktop;
