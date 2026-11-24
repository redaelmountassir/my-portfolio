import GlitchWall from "./GlitchWall";
import staticVid from "../assets/videos/static.mp4";
import { useReducedMotion } from "motion/react";

const NotFound404 = () => {
	const shouldReduceMotion = useReducedMotion();

	return (
		<main className="relative flex h-dvh w-screen bg-black-primary items-center justify-center overflow-hidden p-5 text-white-primary">
			<title>404 - Page Not Found | RedaOS</title>
			<section
				aria-labelledby="error-title"
				className="relative w-full z-2 max-w-xl border-2 border-white-primary bg-black-primary/90 p-6 text-center shadow-[8px_8px_0_#291632] sm:p-10"
			>
				<p className="mb-3 text-sm font-bold tracking-[0.35em] text-pink-accent">
					ERROR
				</p>
				<h1
					id="error-title"
					className="font-display text-9xl leading-none text-pink-accent sm:text-9xl"
				>
					404
				</h1>
				<h2 className="mt-5 text-xl font-bold sm:text-2xl">Page not found</h2>
				<p className="mt-3 text-light-primary">
					The address you entered does not exist in this system.
				</p>
				<a
					href="/"
					className="mt-8 inline-block border-2 group border-white-primary bg-blue-accent px-6 py-3 font-bold transition-colors hover:bg-pink-accent focus-visible:bg-pink-accent"
				>
					<span className="translate-x-5 relative inline-block transition ease-steps-10 group-hover:translate-x-0">Return to desktop</span>
					<span
						aria-hidden
						className="opacity-0 transition ease-steps-10 group-hover:opacity-100"
					>
						{" >"}
					</span>
				</a>
			</section>
			<div className="inset-0 absolute z-1">
				<GlitchWall enable duration={Infinity} />
			</div>
			{shouldReduceMotion && <video
				aria-hidden
				className="pointer-events-none z-3 opacity-35 fixed top-0 size-full object-cover mix-blend-color-dodge"
				muted
				autoPlay
				loop
				playsInline
			>
				<source src={staticVid} type="video/mp4" />
			</video>}
		</main>
	);
};

export default NotFound404;
