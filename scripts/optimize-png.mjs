import optimise, { init } from "@jsquash/oxipng/optimise.js";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { findFilesByExtension } from "./find-files.mjs";

const distDir = resolve("dist");
const wasmPath = new URL(
	"../node_modules/@jsquash/oxipng/codec/pkg/squoosh_oxipng_bg.wasm",
	import.meta.url,
);
await init(await readFile(wasmPath));

const pngFiles = await findFilesByExtension(distDir, ".png");
let optimizedCount = 0;
let bytesSaved = 0;

for (const path of pngFiles) {
	const original = await readFile(path);
	const input = original.buffer.slice(
		original.byteOffset,
		original.byteOffset + original.byteLength,
	);
	const optimized = Buffer.from(
		await optimise(input, { level: 4, optimiseAlpha: false }),
	);

	if (optimized.length >= original.length) continue;

	await writeFile(path, optimized);
	optimizedCount++;
	bytesSaved += original.length - optimized.length;
}

console.info(
	`Optimized ${optimizedCount}/${pngFiles.length} PNGs; saved ${bytesSaved} bytes.`,
);
