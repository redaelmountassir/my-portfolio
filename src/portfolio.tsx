import { MotionConfig } from "motion/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Portfolio from "./pages/Portfolio.tsx";

document.documentElement.classList.add("portfolio-scroll");

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<MotionConfig reducedMotion="user">
			<Portfolio />
		</MotionConfig>
	</StrictMode>,
);
