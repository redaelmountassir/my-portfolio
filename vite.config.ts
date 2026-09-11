import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import glsl from "vite-plugin-glsl";
import { imagetools } from "vite-imagetools";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		glsl(),
		imagetools({
			defaultDirectives: new URLSearchParams({
				kernel: "nearest",
				as: "metadata:src;width;height",
			}),
			exclude: /\.gif(\?|$)/i,
		}),
	],
});
