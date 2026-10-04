import { useEffect, useState } from "react";
import { subscribeAnnounce } from "../utils/a11y";

const LiveRegion = () => {
	const [message, setMessage] = useState("");
	useEffect(() => subscribeAnnounce(setMessage), []);
	return (
		<div aria-live="polite" aria-atomic="true" className="sr-only">
			{message}
		</div>
	);
};

export default LiveRegion;
