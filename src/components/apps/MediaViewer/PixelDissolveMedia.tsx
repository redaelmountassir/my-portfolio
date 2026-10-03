import { Canvas } from "@react-three/fiber";
import { animate, useMotionValue } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { cn } from "../../../utils";
import { silenceContextLoss } from "../../../utils/3D";
import Throbber from "../../Throbber";
import DissolveMaterial, { type TextureContent } from "./DissolveMaterial";
import FixCanvas from "./FixCanvas";
import MediaMesh, { type ObjectFit } from "./MediaMesh";

interface PixelDissolveProps {
	media: ImportedImage | string;
	duration?: number;
	onComplete?: () => void;
	pixelGranularity?: number;
	disolveFactor?: number;
	dissolved?: boolean;
	objectFit?: ObjectFit;
}

const PixelDissolveMedia = ({
	media,
	duration = 2,
	onComplete,
	pixelGranularity = 18,
	disolveFactor = 1,
	dissolved = false,
	objectFit = "cover",
}: PixelDissolveProps) => {
	const [texture, setTexture] = useState<TextureContent | null>(null);
	const [ready, setReady] = useState(false);
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const [contentAspectRatio, setContentAspectRatio] = useState(1);
	const [isVideo, setIsVideo] = useState(false);
	const [seed, setSeed] = useState(Math.random());
	const [internalDissolved, setInternalDissolved] = useState(dissolved);
	const progress = useMotionValue(0);
	const onCompleteRef = useRef(onComplete);
	onCompleteRef.current = onComplete;

	// Sync internal dissolved state with prop
	useEffect(() => setInternalDissolved(dissolved), [dissolved]);

	// Determine media type and load accordingly
	useEffect(() => {
		setReady(false);
		if (typeof media == "string") {
			setIsVideo(true);

			// Load video
			const video = document.createElement("video");
			video.crossOrigin = "anonymous";
			video.loop = true;
			video.muted = true;
			video.playsInline = true;
			let videoTexture: THREE.VideoTexture<HTMLVideoElement> | null =
				null;

			const onLoadedMetadata = () => {
				const ratio = video.videoWidth / video.videoHeight;
				setContentAspectRatio(ratio);

				// Create video texture
				videoTexture = new THREE.VideoTexture(video);
				videoTexture.colorSpace = THREE.NoColorSpace;
				setTexture(videoTexture);

				video
					.play()
					.catch(e => console.warn("Video autoplay failed:", e));
			};

			video.addEventListener("loadedmetadata", onLoadedMetadata);
			video.src = media;
			videoRef.current = video;

			return () => {
				video.removeEventListener("loadedmetadata", onLoadedMetadata);
				video.pause();
				videoTexture?.dispose();
			};
		}

		setIsVideo(false);
		const textureLoader = new THREE.TextureLoader();
		let loadedTexture: THREE.Texture | null = null;
		let active = true;
		textureLoader.load(media.src, texture => {
			// Keep the file's sRGB bytes. An sRGB texture is decoded to linear on
			// sample, and this shader writes the sample straight to the canvas.
			texture.colorSpace = THREE.NoColorSpace;
			if (!active) {
				texture.dispose();
				return;
			}
			loadedTexture = texture;
			setContentAspectRatio(texture.image.width / texture.image.height);
			setTexture(texture);
		});

		return () => {
			active = false;
			loadedTexture?.dispose();
		};
	}, [media]);

	// Handle animation completion
	const handleAnimationComplete = useCallback(() => {
		// Generate new seed for next animation
		setSeed(Math.random());
		onCompleteRef.current?.();
	}, []);

	// Animate to the target state when dissolved changes
	useEffect(() => {
		if (!texture) return;

		const targetProgress = (internalDissolved ? 1 : 0) * disolveFactor;
		if (Math.abs(progress.get() - targetProgress) <= 0.01) {
			if (internalDissolved) handleAnimationComplete();
			return;
		}

		let cancelled = false;
		const controls = animate(progress, targetProgress, {
			duration,
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
		duration,
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
