import type { File, Media, SystemObject } from "../../../store/types";

export type MediaFile = File & { value: Media };

export const isMediaFile = (obj: SystemObject): obj is MediaFile =>
	"ext" in obj && !!obj.value && typeof obj.value !== "string";
