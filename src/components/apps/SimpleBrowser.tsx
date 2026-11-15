import { useContext, useEffect } from "react";
import { InternalWindowDataContext } from "../window/windowContext";

const SimpleBrowser = () => {
	const setTitle = useContext(InternalWindowDataContext)?.setTitle;

	useEffect(() => {
		setTitle?.("Simple Site");
		window.location.assign("/simple/");
	}, [setTitle]);

	return (
		<p className="p-4">
			Opening the portfolio in its simpler view.{" "}
			<a className="underline" href="/simple/">
				Continue if you are not redirected.
			</a>
		</p>
	);
};

export default SimpleBrowser;
