import throbberGif from "../assets/images/throbber.gif";

const Throbber = () => (
	<img
		src={throbberGif}
		alt=""
		className="absolute top-1/2 left-1/2 w-16 -translate-x-1/2 -translate-y-1/2"
	/>
);

export default Throbber;
