import React, { memo } from "react";

interface HeadProps {
	description?: "string";
	children?: React.ReactNode;
}

const Head = memo(({ description, children }: HeadProps) => {
	const title = "RedaOS";

	return (
		<>
			<title id="title">{title}</title>
			{description && <meta name="description" content={description} />}
			{children}
		</>
	);
});

export default Head;
