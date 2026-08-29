import React, { memo } from "react";

interface HeadProps {
	description?: "string";
	children?: React.ReactNode;
}

export const Head: React.FC<HeadProps> = memo(({ description, children }) => {
	const title = "RedaOS";

	return (
		<>
			<title id="title">{title}</title>
			{description && <meta name="description" content={description} />}
			{children}
		</>
	);
});
