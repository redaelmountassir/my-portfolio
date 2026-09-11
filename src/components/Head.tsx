import type { ReactNode } from "react";

interface HeadProps {
	description?: "string";
	children?: ReactNode;
}

const Head = ({ description, children }: HeadProps) => {
	const title = "RedaOS";

	return (
		<>
			<title id="title">{title}</title>
			{description && <meta name="description" content={description} />}
			{children}
		</>
	);
};

export default Head;
