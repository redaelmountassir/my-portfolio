import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { PNG } from "pngjs";

const DEFAULT_INPUT = "public/logo/logo.png";
const DEFAULT_OUTPUT = "public/logo/logo.svg";

function parseArgs(argv) {
	const positional = [];
	const flags = { merge: true };

	for (const arg of argv) {
		if (arg === "--no-merge") {
			flags.merge = false;
			continue;
		}
		if (arg.startsWith("-")) {
			throw new Error(`Unknown flag: ${arg}`);
		}
		positional.push(arg);
	}

	return {
		input: positional[0] ?? DEFAULT_INPUT,
		output: positional[1] ?? DEFAULT_OUTPUT,
		merge: flags.merge,
	};
}

function rgbaToCss(r, g, b, a) {
	if (a === 255) {
		const hex = [r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("");
		return `#${hex}`;
	}

	return `rgba(${r},${g},${b},${+(a / 255).toFixed(4)})`;
}

function pixelKey(data, index) {
	return data.readUInt32BE(index);
}

function collectRects(png, merge) {
	const { width, height, data } = png;
	const rects = [];

	for (let y = 0; y < height; y += 1) {
		let x = 0;

		while (x < width) {
			const index = (width * y + x) << 2;
			const alpha = data[index + 3];

			if (alpha === 0) {
				x += 1;
				continue;
			}

			let runWidth = 1;

			if (merge) {
				const key = pixelKey(data, index);
				while (x + runWidth < width) {
					const nextIndex = (width * y + x + runWidth) << 2;
					if (pixelKey(data, nextIndex) !== key) break;
					runWidth += 1;
				}
			}

			rects.push({
				x,
				y,
				width: runWidth,
				height: 1,
				fill: rgbaToCss(data[index], data[index + 1], data[index + 2], alpha),
			});

			x += runWidth;
		}
	}

	return rects;
}

function escapeAttr(value) {
	return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;");
}

function toSvg(png, rects) {
	const body = rects
		.map(
			(rect) =>
				`<rect x="${rect.x}" y="${rect.y}" width="${rect.width}" height="${rect.height}" fill="${escapeAttr(rect.fill)}"/>`,
		)
		.join("\n\t");

	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${png.width}" height="${png.height}" viewBox="0 0 ${png.width} ${png.height}" shape-rendering="crispEdges">
	${body}
</svg>
`;
}

async function main() {
	const { input, output, merge } = parseArgs(process.argv.slice(2));
	const png = PNG.sync.read(await readFile(input));
	const rects = collectRects(png, merge);
	const svg = toSvg(png, rects);

	await writeFile(output, svg, "utf8");

	console.log(
		`Wrote ${path.relative(process.cwd(), output)} (${png.width}x${png.height}, ${rects.length} rects)`,
	);
}

main().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
});
