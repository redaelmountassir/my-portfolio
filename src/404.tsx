import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "motion/react";
import "./index.css";
import NotFound404 from "./components/NotFound404";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<MotionConfig reducedMotion="user">
			<NotFound404 />
		</MotionConfig>
	</StrictMode>,
);
