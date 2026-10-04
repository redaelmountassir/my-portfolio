import { MotionConfig } from "motion/react";
import OS from "./components/OS";

function App() {
	return (
		<MotionConfig reducedMotion="user">
			<OS />
		</MotionConfig>
	);
}

export default App;
