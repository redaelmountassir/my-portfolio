import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
	headers: [
		{
			source: "/resume.pdf",
			headers: [
				{
					key: "X-Frame-Options",
					value: "SAMEORIGIN",
				},
			],
		},
	],
	siteMetadata: {
		title: `Reda OS`,
		siteUrl: `https://redaos.run`,
		image: "/logo.png",
		twitterUsername: "@RedaElmo",
		description: `An OS-like experience meant to provide a glimpse into my mind, Reda Elmountassir. I can't wait to get started on any technological project that comes my way.`,
	},
	graphqlTypegen: false,
	plugins: [
		`gatsby-plugin-glslify`,
		"gatsby-plugin-postcss",
		"gatsby-plugin-image",
		{
			resolve: "gatsby-plugin-manifest",
			options: {
				icon: "./src/images/logo/logo.png",
			},
		},
		"gatsby-plugin-sharp",
		"gatsby-transformer-sharp",
		{
			resolve: "gatsby-source-filesystem",
			options: {
				name: "images",
				path: "./src/images/",
			},
			__key: "images",
		},
		`gatsby-transformer-yaml`,
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: "projects",
				path: `./src/content/projects`,
			},
		},
		{
			resolve: "gatsby-plugin-manifest",
			options: {
				icon: `./src/images/logo/logo_512x512.png`,
				icons: [
					{
						src: `./src/images/logo/logo.png`,
						sizes: `16x16`,
						type: `image/png`,
					},
					{
						src: `./src/images/logo/logo.ico`,
						sizes: `32x32`,
						type: `image/vnd.microsoft.icon`,
					},
					{
						src: `./src/images/logo/logo_192x192.png`,
						sizes: `192x192`,
						type: `image/png`,
					},
					{
						src: `./src/images/logo/logo_512x512.png`,
						sizes: `512x512`,
						type: `image/png`,
					},
					{
						src: `./src/images/logo/logo_512x512.png`,
						sizes: `512x512`,
						type: `image/png`,
					},
					{
						src: "./src/images/logo/maskable_logo.png",
						sizes: "128x128",
						type: "image/png",
						purpose: "maskable",
					},
				],
				name: "RedaOS",
				short_name: "RedaOS",
				description: `Philadelphia-based fullstack developer and engineer Reda Elmountassir offers bespoke software, graphic design, and full-stack development. Explore this OS-like portfolio experience!`,
				start_url: `/`,
				background_color: `#1f0728`,
				theme_color: `#f9c80e`,
				display: `standalone`,
			},
		},
		{
			resolve: "gatsby-plugin-html-attributes",
			options: {
				lang: "en",
			},
		},
		{
			resolve: "gatsby-plugin-robots-txt",
			options: {
				host: "https://redaos.netlify.app",
				policy: [{ userAgent: "*", allow: "/" }],
			},
		},
		"gatsby-plugin-minify",
		"gatsby-plugin-offline",
		`gatsby-plugin-perf-budgets`,
		{
			resolve: "gatsby-plugin-webpack-bundle-analyser-v2",
			options: {
				openAnalyzer: false,
			},
		},
	],
};

export default config;
