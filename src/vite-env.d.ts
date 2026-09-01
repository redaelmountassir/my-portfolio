/// <reference types="vite/types/importMeta" />

declare module "*.css";

type ImportedImage = {
	src: string;
	width: number;
	height: number;
};

declare module "*.png" {
	const image: ImportedImage;
	export default image;
}

declare module "*.jpg" {
	const image: ImportedImage;
	export default image;
}

declare module "*.jpeg" {
	const image: ImportedImage;
	export default image;
}

declare module "*.webp" {
	const image: ImportedImage;
	export default image;
}

declare module "*.gif" {
	const src: string;
	export default src;
}

declare module "*.svg" {
	const src: string;
	export default src;
}

declare module "*.mp3" {
	const src: string;
	export default src;
}
