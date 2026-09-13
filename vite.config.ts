import ViteYaml from "@modyfi/vite-plugin-yaml";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";
import glsl from "vite-plugin-glsl";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
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
