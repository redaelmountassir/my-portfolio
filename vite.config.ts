import ViteYaml from "@modyfi/vite-plugin-yaml";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";
import glsl from "vite-plugin-glsl";

// https://vite.dev/config/
export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				main: resolve(import.meta.dirname, "index.html"),
				simple: resolve(import.meta.dirname, "simple/index.html"),
				notFound: resolve(import.meta.dirname, "404.html"),
			},
		},
		sourcemap: true,
	},
	plugins: [
		react({
			compiler: true,
		}),
		tailwindcss(),
		glsl(),
		ViteYaml(),
		imagetools({
			defaultDirectives: url => {
				const path = url.pathname;
				const isPng = /\.png$/i.test(path);
				const isPixelArt =
					isPng &&
					(path.includes("/src/assets/images/") ||
						/\/src\/content\/project_assets\/[^/]+\/logo\.png$/i.test(path));
				const directives = new URLSearchParams({
					as: "metadata:src;width;height",
					effort: "max",
				});

				if (isPixelArt) {
					directives.set("format", "png");
					directives.set("kernel", "nearest");
				} else {
					directives.set("format", "webp");
					if (isPng) directives.set("lossless", "true");
					else directives.set("quality", "82");
				}

				return directives;
			},
			exclude: /\.gif(\?|$)/i,
		}),
	],
});
