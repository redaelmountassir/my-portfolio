import { Suspense, type RefObject } from "react";
import Throbber from "../../Throbber";
import Showcase from "./Showcase";

const MediaFrame = ({
	scrollContainer,
	...rest
}: {
	project: string;
	src: string;
	scrollContainer: RefObject<HTMLElement | null>;
	decorativeCursor?: boolean;
}) => (
	<Suspense
		fallback={
			<div className="relative h-full min-h-64 w-full">
				<Throbber />
			</div>
		}
	>
		<Showcase animation={{ scrollContainer }} {...rest} />
	</Suspense>
);

export default MediaFrame;
