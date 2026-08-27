import { useState, useEffect, useRef, useMemo } from "react";
import { graphql, useStaticQuery } from "gatsby";
import { useSettingsStore } from "../store";

export const mod = (x: number, y: number) => ((x % y) + y) % y;

export const randRange = (min: number, max: number) =>
	Math.random() * (max - min) + min;

export const map = (
	x: number,
	min1: number = 0,
	max1: number = 1,
	min2: number,
	max2: number,
) => min2 + ((x - min1) * (max2 - min2)) / (max1 - min1);

export const gcd = (x: number, y: number) => {
	x = Math.abs(x);
	y = Math.abs(y);
	while (y) {
		var t = y;
		y = x % y;
		x = t;
	}
	return x;
};

export const easeSteps = (steps: number) => (progress: number) =>
	Math.floor(progress * steps) / steps;

export const ease5Steps = easeSteps(5);
export const ease25Steps = easeSteps(25);

const CHARS =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#+&%?!";
export const randomChar = () => pickRand(Array.from(CHARS));

export function pickRand<T>(arr: Array<T>): T | undefined {
	if (arr.length === 0) return undefined;
	const randIndex = Math.floor(Math.random() * arr.length);
	return arr[randIndex];
}

export const useMediaQuery = (query: string) => {
	const media = useMemo(
		() =>
			typeof window === "undefined" ? undefined : window.matchMedia(query),
		[query],
	);
	const [matches, setMatches] = useState(media ? media.matches : false);

	useEffect(() => {
		if (!media) return;

		if (media.matches !== matches) setMatches(media.matches);
		const listener = () => setMatches(media.matches);
		listener();
		media.addEventListener("change", listener);

		return () => media.removeEventListener("change", listener);
	}, [media]);

	return matches;
};

// export const useBreakpointSM = () => useMediaQuery('(min-width: 640px)');
export const useBreakpointMD = () => useMediaQuery("(min-width: 768px)");
export const useBreakpointShort = () => useMediaQuery("(min-height: 500px)");
// export const useBreakpointLG = () => useMediaQuery('(min-width: 1024px)');
// export const useBreakpointXL = () => useMediaQuery('(min-width: 1280px)');
// export const useBreakpoint2XL = () => useMediaQuery('(min-width: 1536px)');

export function usePersistent<type extends Object>(
	key: string,
	initialState: type,
	conversion: (str: string) => type,
): [boolean, type, (value: type) => void, Function] {
	const [ready, setReady] = useState(false);
	const [value, setValue] = useState(initialState);
	const setVal = (value: type) => {
		setValue(value);
		localStorage.setItem(key, value.toString());
	};

	useEffect(() => {
		const actualInitial = localStorage.getItem(key);
		if (actualInitial) setVal(conversion(actualInitial));
		setReady(true);
	}, []);

	const clear = () => localStorage.removeItem(key);

	return [ready, value, setVal, clear];
}

export function useDebounce<type>(
	initialState: type,
	delay = 3000,
): [type, React.Dispatch<React.SetStateAction<type>>] {
	const [state, dispatch] = useState(initialState);
	const timeout = useRef<NodeJS.Timeout>();
	const debouncedDispatch: React.Dispatch<React.SetStateAction<type>> = (
		...props
	) => {
		clearTimeout(timeout.current);
		timeout.current = setTimeout(() => {
			dispatch(...props);
		}, delay);
	};
	return [state, debouncedDispatch];
}

export function useInterval(callback: Function, delay: number) {
	useEffect(() => {
		const interval = setInterval(callback, delay);
		return () => clearInterval(interval);
	}, []);
}
export function useTimeout(callback: Function, delay: number) {
	useEffect(() => {
		const timeout = setTimeout(callback, delay);
		return () => clearTimeout(timeout);
	}, []);
}

export const useSiteMetadata = () => {
	const data = useStaticQuery(graphql`
		query {
			site {
				siteMetadata {
					title
					description
					image
					siteUrl
					twitterUsername
				}
			}
		}
	`);
	return data.site.siteMetadata;
};

export const useAudio = (src: string, vol = 1, loop = false) => {
	const audio = useMemo(() => new Audio(), []);
	const srcUsed = useRef("");
	const globalVol = useSettingsStore((store) => store.volume * 0.01);
	useEffect(() => {
		audio.volume = vol * globalVol;
	}, [vol, globalVol]);

	const tryPlay = () => {
		audio.loop = loop;
		if (srcUsed.current !== src) {
			srcUsed.current = src;
			audio.src = src;
		}
		if (!audio.paused) return;
		if (audio.readyState >= 3) return audio.play();

		audio.addEventListener("canplay", audio.play);
	};

	return [tryPlay, audio.pause.bind(audio)];
};

export enum Colors {
	blueAccent = "#023788",
	purpleAccent = "#650d89",
	burgundyAccent = "#920075",
	pinkAccent = "#f6019d",
	yellowAccent = "#f9c80e",
	blackPrimary = "#1f0728",
	darkPrimary = "#353c45",
	lightPrimary = "#6e83a1",
	whitePrimary = "#f5f9ff",
	purpleWatermark = "#291632",
}
