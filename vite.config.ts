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
				portfolio: resolve(import.meta.dirname, "portfolio/index.html"),
			},
		},
	},
	plugins: [
		react({
			compiler: true,
		}),
		tailwindcss(),
		glsl(),
		ViteYaml(),
		imagetools({
			defaultDirectives: new URLSearchParams({
				kernel: "nearest",
				as: "metadata:src;width;height",
			}),
			exclude: /\.gif(\?|$)/i,
		}),
	],
});
