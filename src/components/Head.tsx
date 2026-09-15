import type { ReactNode } from "react";

interface HeadProps {
	description?: "string";
	children?: ReactNode;
}

const Head = ({ description, children }: HeadProps) => (
	<>
		<title id="title">RedaOS</title>
		{description && <meta name="description" content={description} />}
		{children}
	</>
);

export default Head;
