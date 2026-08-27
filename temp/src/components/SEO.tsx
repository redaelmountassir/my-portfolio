import React, { memo } from "react";
import { useSiteMetadata } from "../utils";

interface SEOProps {
	description?: "string";
	pathname?: "string";
	children?: React.ReactNode;
}

export const SEO: React.FC<SEOProps> = memo(
	({ description, pathname, children }) => {
		const {
			description: defaultDescription,
			image,
			siteUrl,
			twitterUsername,
		} = useSiteMetadata();

		const seo = {
			title: "RedaOS",
			description: description || defaultDescription,
			image: `${siteUrl}${image}`,
			url: `${siteUrl}${pathname || ``}`,
			twitterUsername,
		};

		return (
			<>
				<title id="title">{seo.title ? seo.title : "RedaOS"}</title>
				<meta name="description" content={seo.description} />
				<meta name="image" content={seo.image} />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={seo.title} />
				<meta name="twitter:url" content={seo.url} />
				<meta name="twitter:description" content={seo.description} />
				<meta name="twitter:image" content={seo.image} />
				<meta name="twitter:creator" content={seo.twitterUsername} />
				{children}
			</>
		);
	},
);
