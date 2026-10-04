import { Canvas } from "@react-three/fiber";
import { animate, useMotionValue, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { cn } from "../utils";
import { silenceContextLoss } from "../utils/3D";
import DissolveMaterial, { type TextureContent } from "./DissolveMaterial";
import FixCanvas from "./FixCanvas";
import MediaMesh, { type ObjectFit } from "./MediaMesh";
import Throbber from "./Throbber";

type MediaSource = ImportedImage | string;

const mediaKey = (media: MediaSource) =>
	typeof media === "string" ? media : media.src;

interface PixelDissolveProps {
	media: MediaSource;
	duration?: number;
	onComplete?: () => void;
	onDisplay?: (media: MediaSource) => void;
	pixelGranularity?: number;
	disolveFactor?: number;
	dissolved?: boolean;
	objectFit?: ObjectFit;
}

// Pass `dissolved` when the parent owns the transition (MediaViewer).
// Omit it and a new `media` dissolves out, swaps, then dissolves back in.
const PixelDissolveMedia = ({
	media,
	duration = 2,
	onComplete,
	onDisplay,
	pixelGranularity = 18,
	disolveFactor = 1,
	dissolved,
	objectFit = "cover",
}: PixelDissolveProps) => {
	const controlled = dissolved !== undefined;
	const [shownMedia, setShownMedia] = useState(media);
	const [texture, setTexture] = useState<TextureContent | null>(null);
	const [ready, setReady] = useState(false);
	const [contentAspectRatio, setContentAspectRatio] = useState(1);
	const [isVideo, setIsVideo] = useState(false);
	const [seed, setSeed] = useState(Math.random());
	const [internalDissolved, setInternalDissolved] = useState(
		dissolved ?? false,
	);
	const progress = useMotionValue(0);
	const reducedMotion = useReducedMotion();
	const dissolveDuration = reducedMotion ? 0 : duration;
	const onCompleteRef = useRef(onComplete);
	onCompleteRef.current = onComplete;
	const onDisplayRef = useRef(onDisplay);
	onDisplayRef.current = onDisplay;
	const swapTarget = useRef<MediaSource | null>(null);
	const revealAfterLoad = useRef(false);
	const hasTexture = useRef(false);
	const internalDissolvedRef = useRef(internalDissolved);
	internalDissolvedRef.current = internalDissolved;
	const mediaRef = useRef(media);
	mediaRef.current = media;
	const requestedKey = mediaKey(media);

	useEffect(() => {
		if (dissolved === undefined) return;
		setInternalDissolved(dissolved);
	}, [dissolved]);

	useEffect(() => {
		const requested = mediaRef.current;
		const sameMedia = (current: MediaSource) =>
			mediaKey(current) === requestedKey;

		if (controlled || !hasTexture.current) {
			if (
				!controlled &&
				!hasTexture.current &&
				mediaKey(shownMedia) !== requestedKey
			)
				onDisplayRef.current?.(requested);
			setShownMedia(current =>
				sameMedia(current) ? current : requested,
			);
			return;
		}

		if (sameMedia(shownMedia)) return;
		swapTarget.current = requested;
		setInternalDissolved(true);
	}, [controlled, requestedKey, shownMedia]);

	useEffect(() => {
		if (!revealAfterLoad.current) setReady(false);

		let cancelled = false;

		const adopt = (
			next: TextureContent,
			ratio: number,
			video: boolean,
		) => {
			if (cancelled) {
				next.dispose();
				return;
			}
			hasTexture.current = true;
			setIsVideo(video);
			setContentAspectRatio(ratio);
			setTexture(previous => {
				if (previous && previous !== next) previous.dispose();
				return next;
			});
			if (!revealAfterLoad.current) return;

			revealAfterLoad.current = false;
			const queued = swapTarget.current;
			if (queued) {
				swapTarget.current = null;
				revealAfterLoad.current = true;
				onDisplayRef.current?.(queued);
				setShownMedia(queued);
				return;
			}
			setInternalDissolved(false);
		};

		if (typeof shownMedia === "string") {
			const video = document.createElement("video");
			video.crossOrigin = "anonymous";
			video.loop = true;
			video.muted = true;
			video.playsInline = true;

			const onLoadedMetadata = () => {
				const videoTexture = new THREE.VideoTexture(video);
				videoTexture.colorSpace = THREE.NoColorSpace;
				adopt(
					videoTexture,
					video.videoWidth / video.videoHeight,
					true,
				);
				video
					.play()
					.catch(error => console.warn("Video autoplay failed:", error));
			};

			video.addEventListener("loadedmetadata", onLoadedMetadata);
			video.src = shownMedia;

			return () => {
				cancelled = true;
				video.removeEventListener("loadedmetadata", onLoadedMetadata);
				video.pause();
			};
		}

		const textureLoader = new THREE.TextureLoader();
		textureLoader.load(shownMedia.src, loaded => {
			loaded.colorSpace = THREE.NoColorSpace;
			adopt(
				loaded,
				loaded.image.width / loaded.image.height,
				false,
			);
		});

		return () => {
			cancelled = true;
		};
	}, [shownMedia]);

	const handleAnimationComplete = useCallback(() => {
		setSeed(Math.random());
		const next = swapTarget.current;
		if (!controlled && next && internalDissolvedRef.current) {
			swapTarget.current = null;
			revealAfterLoad.current = true;
			onDisplayRef.current?.(next);
			setShownMedia(next);
			return;
		}
		onCompleteRef.current?.();
	}, [controlled]);

	useEffect(() => {
		if (!texture) return;

		const targetProgress = (internalDissolved ? 1 : 0) * disolveFactor;
		if (Math.abs(progress.get() - targetProgress) <= 0.01) {
			if (internalDissolved && !revealAfterLoad.current)
				handleAnimationComplete();
			return;
		}

		let cancelled = false;
		const controls = animate(progress, targetProgress, {
			duration: dissolveDuration,
			ease: t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
			onComplete: () => {
				if (!cancelled) handleAnimationComplete();
			},
		});

		return () => {
			cancelled = true;
			controls.stop();
		};
	}, [
		internalDissolved,
		texture,
		dissolveDuration,
		progress,
		disolveFactor,
		handleAnimationComplete,
	]);

	return (
		<div className="relative size-full">
			{texture && (
				<Canvas
					frameloop="demand"
					orthographic
					camera={{ position: [0, 0, 5], fov: 75 }}
					gl={{
						antialias: false,
						depth: false,
						stencil: false,
						powerPreference: "high-performance",
						toneMapping: THREE.NoToneMapping,
					}}
					dpr={[1, 2]}
					onCreated={silenceContextLoss}
					className={cn(
						"relative size-full overflow-hidden",
						!ready && "opacity-0",
					)}
				>
					<MediaMesh
						contentAspectRatio={contentAspectRatio}
						objectFit={objectFit}
					>
						<DissolveMaterial
							texture={texture}
							progress={progress}
							seed={seed}
							pixelGranularity={pixelGranularity}
							aspect={contentAspectRatio}
							isVideo={isVideo}
						/>
					</MediaMesh>
					<FixCanvas
						texture={texture}
						isVideo={isVideo}
						onReady={() => setReady(true)}
					/>
				</Canvas>
			)}
			{!ready && (
				<div className="absolute inset-0 z-1 bg-black-primary">
					<Throbber />
				</div>
			)}
		</div>
	);
};

export default PixelDissolveMedia;
