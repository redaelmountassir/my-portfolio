import ffmpegPath from "ffmpeg-static";
import { spawn } from "node:child_process";
import { rename, rm, stat } from "node:fs/promises";
import { findFilesByExtension } from "./find-files.mjs";
import { resolve } from "node:path";

if (!ffmpegPath) throw new Error("The ffmpeg-static binary is not available.");

const distDir = resolve("dist");
const videoFiles = await findFilesByExtension(distDir, ".mp4");
let optimizedCount = 0;
let bytesSaved = 0;

const runFfmpeg = args =>
	new Promise((resolve, reject) => {
		const process = spawn(ffmpegPath, args, { stdio: "ignore" });
		process.once("error", reject);
		process.once("close", code => {
			if (code === 0) resolve();
			else reject(new Error(`FFmpeg exited with code ${code}.`));
		});
	});

for (const videoPath of videoFiles) {
	const tempPath = videoPath.replace(/\.mp4$/i, ".optimized.mp4");
	const originalSize = (await stat(videoPath)).size;

	try {
		await runFfmpeg([
			"-hide_banner",
			"-loglevel",
			"error",
			"-nostdin",
			"-y",
			"-i",
			videoPath,
			"-map",
			"0:v:0",
			"-map",
			"0:a?",
			"-c:v",
			"libx264",
			"-preset",
			"slow",
			"-crf",
			"25",
			"-pix_fmt",
			"yuv420p",
			"-c:a",
			"aac",
			"-b:a",
			"128k",
			"-movflags",
			"+faststart",
			tempPath,
		]);
		await runFfmpeg([
			"-hide_banner",
			"-loglevel",
			"error",
			"-nostdin",
			"-i",
			tempPath,
			"-f",
			"null",
			"-",
		]);

		const optimizedSize = (await stat(tempPath)).size;
		if (optimizedSize < originalSize) {
			await rename(tempPath, videoPath);
			optimizedCount++;
			bytesSaved += originalSize - optimizedSize;
		}
	} finally {
		await rm(tempPath, { force: true });
	}
}

console.info(
	`Optimized ${optimizedCount}/${videoFiles.length} MP4s; saved ${bytesSaved} bytes.`,
);
