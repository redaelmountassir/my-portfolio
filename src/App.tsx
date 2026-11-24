import { MotionConfig } from "motion/react";
import OS from "./components/OS";
import NotFound494 from "./components/NotFound404";

function App() {
	const pathname = window.location.pathname.replace(/\/+$/, "").toLowerCase();
	const is494Page =
		pathname === "/494" ||
		pathname === "/494.html" ||
		(pathname !== "" && pathname !== "/" && pathname !== "/simple");

	if (is494Page) {
		return (
			<MotionConfig reducedMotion="user">
				<NotFound494 />
			</MotionConfig>
		);
	}

	return (
		<MotionConfig reducedMotion="user">
			<OS />
		</MotionConfig>
	);
}

export default App;
