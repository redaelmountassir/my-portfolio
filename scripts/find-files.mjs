import { readdir } from "node:fs/promises";
import { join } from "node:path";

export const findFilesByExtension = async (directory, extension) => {
	const entries = await readdir(directory, { withFileTypes: true });
	const nested = await Promise.all(
		entries.map(entry => {
			const path = join(directory, entry.name);
			if (entry.isDirectory()) return findFilesByExtension(path, extension);
			return entry.isFile() && entry.name.endsWith(extension) ? [path] : [];
		}),
	);

	return nested.flat();
};
