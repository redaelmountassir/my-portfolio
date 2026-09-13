import { z } from "zod";
import { mediaSchema, type File } from "../store/types";

type ProjectAsset = ImportedImage | string;
type ProjectYaml = z.infer<typeof mediaSchema>;

const yamlModules = import.meta.glob("./projects/*.yaml", {
	eager: true,
	import: "default",
});

const projectAssets = import.meta.glob<ProjectAsset>(
	"../assets/project_assets/**/*.{png,jpg,jpeg,gif,mp4,webp}",
	{
		eager: false,
		import: "default",
	},
);

const projectAssetPromises = new Map<string, Promise<ProjectAsset>>();

const yamlName = (path: string) =>
	path
		.split("/")
		.pop()
		?.replace(/\.ya?ml$/, "");

const projectAssetKey = (projectName: string, fileName: string) =>
	`../assets/project_assets/${projectName}/${fileName}`;

const parseProjectYaml = (filePath: string, data: unknown): ProjectYaml => {
	const result = mediaSchema.safeParse(data);
	if (result.success) return result.data;
	throw new Error(
		`Invalid project YAML "${filePath}":\n${z.prettifyError(result.error)}`,
	);
};

const assertProjectLogo = (projectName: string) => {
	if (projectAssets[projectAssetKey(projectName, "logo.png")]) return;
	throw new Error(`A logo.png is required for project "${projectName}"`);
};

const loadProjects = (): Record<string, ProjectYaml> => {
	const projects: Record<string, ProjectYaml> = {};
	for (const [filePath, data] of Object.entries(yamlModules)) {
		const name = yamlName(filePath);
		if (name === undefined) continue;
		assertProjectLogo(name);
		projects[name] = parseProjectYaml(filePath, data);
	}
	return projects;
};

const toProjectFiles = (projects: Record<string, ProjectYaml>): File[] =>
	Object.entries(projects).map(([name, value]) => {
		const isVid = /\.mp4$/i.test(value.showcases[0] ?? "");
		return { name, value, ext: isVid ? "mp4" : "png" };
	});

export const mediaSrc = (asset: ProjectAsset) =>
	typeof asset === "string" ? asset : asset.src;

export const resolveProjectAsset = (
	projectName: string,
	fileName: string,
): Promise<ProjectAsset> | undefined => {
	const key = projectAssetKey(projectName, fileName);
	const cached = projectAssetPromises.get(key);
	if (cached) return cached;

	const loader = projectAssets[key];
	if (!loader) {
		console.error(`Path for ${projectName} media is likely wrong: ${fileName}`);
		return undefined;
	}

	const promise = loader();
	projectAssetPromises.set(key, promise);
	return promise;
};

export const projects = loadProjects();
export const projectFiles = toProjectFiles(projects);
