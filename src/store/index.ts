import { clamp } from "motion/react";
import screenfull from "screenfull";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import { createDirectorySlice } from "./directorySlice";
import type { MobileStore, SettingsStore, SystemState } from "./types";
import { createWindowSlice } from "./windowSlice";

export const SETTING_DETAILS = {
	use3D: "Activates a 3D background which can cause battery to drain faster.",
	useStatic: "Applies a glitchy overlay to the screen.",
	scanlines: "Applies an overlay of horizontal lines.",
	blur: "Activates background blurs which can cause visual artifacts and drain battery.",
	flicker:
		"Rapid changes in brightness, likely not ideal for those with epilepsy.",
	fancyText:
		"Uses built-in sans-serif fonts instead of the stylized pixelated font.",
	lightMode: "A joke setting, turn on if you dare.",
	fullscreen:
		"Fullscreens the entire experience. Not equivalent to pressing F11.",
	skipLoader:
		"Skips the initial loading screen. Loading is not made any faster.",
} as const;

const LIGHT_MODE_TEXT = [
	"Light Mode?",
	"Why?",
	"Srsly? ¿Por qué?",
	"Stop",
	"No point",
	"Nice try",
	"Next ones the real one",
	"Ha!",
	"Give up",
	"Actually",
	"It's not going to work",
	"There's literally no point",
	"Please",
	"Pleassssse",
	"UWU",
	"SORRY BUT IT JUST CAN'T HAPPEN",
	"I CAN'T DO THIS FOREVER",
	"YOU LEAVE ME NO CHOICE",
	"10",
	"9",
	"8",
	"7",
	"6",
	"5",
	"4",
	"3",
	"2",
	"2.",
	"2..",
	"2...",
	"2....",
	"2.....",
	"1",
	"LET THERE BE LIGHT",
	"Exactly what where you expecting",
	"Now ur gonna try again???",
	"Fine",
	"Light Mode",
];

export function useSystemKeys<K extends keyof SystemState>(
	...keys: K[]
): Pick<SystemState, K> {
	return useSystemStore(
		useShallow(state => {
			const slice = {} as Pick<SystemState, K>;
			for (const key of keys) {
				slice[key] = state[key];
			}
			return slice;
		}),
	);
}

export const useSystemStore = create<SystemState>()((...a) => ({
	...createWindowSlice(...a),
	...createDirectorySlice(...a),
}));

export const useMobileStore = create<MobileStore>(set => ({
	menuOpen: false,
	windowOpen: undefined,
	toggleMenu: () => set(state => ({ menuOpen: !state.menuOpen })),
	home: () => set({ windowOpen: undefined, menuOpen: false }),
	showWindow: toShow => set({ windowOpen: toShow }),
	back: () =>
		set(state =>
			state.menuOpen ? { menuOpen: false } : { windowOpen: undefined },
		),
}));

const prefersReducedMotion = () =>
	typeof window !== "undefined" &&
	window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const isMobileViewport = () =>
	typeof window !== "undefined" &&
	(!window.matchMedia("(min-width: 768px)").matches ||
		!window.matchMedia("(min-height: 500px)").matches);

export const useSettingsStore = create<
	SettingsStore,
	[["zustand/persist", SettingsStore]]
>(
	persist(
		(set, get) => {
			const reducedMotion = prefersReducedMotion();
			return {
			brightness: 100,
			use3D: !(isMobileViewport() || reducedMotion),
			useStatic: false,
			scanlines: true,
			blur: true,
			flicker: false,
			volume: 0,
			fancyText: true,
			lightModeText: LIGHT_MODE_TEXT[0],
			lightMode: false,
			fullscreen: false,
			skipLoader: reducedMotion,
			setLightMode(val) {
				const nextIndex = Math.min(
					LIGHT_MODE_TEXT.indexOf(get().lightModeText) + 1,
					LIGHT_MODE_TEXT.length - 1,
				);
				const nextText = LIGHT_MODE_TEXT[nextIndex];
				set({
					lightModeText: nextText,
					lightMode:
						(nextIndex === LIGHT_MODE_TEXT.length - 1 ||
							nextText === "LET THERE BE LIGHT") &&
						val,
				});
				const invertLayer = document.getElementById("invert-layer");
				if (invertLayer)
					invertLayer.style.filter = get().lightMode
						? "invert(1)"
						: "";
			},
			setBrightness: val => set({ brightness: clamp(0, 100, val) }),
			set3D: val => set({ use3D: val }),
			setStatic: val => set({ useStatic: val }),
			setScanlines: val => set({ scanlines: val }),
			setBlur: val => {
				document.documentElement.classList.toggle("no-blur", !val);
				set({ blur: val });
			},
			setFancyText: val => {
				document.documentElement.style.fontFamily = val
					? ""
					: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
				set({ fancyText: val });
			},
			setFlicker: val => set({ flicker: val }),
			setVolume: val => set({ volume: clamp(0, 100, val) }),
			setSkipLoader: val => set({ skipLoader: val }),
			setFullscreen: val => {
				if (!screenfull.isEnabled) return;
				val ? screenfull.request() : screenfull.exit();
			},
			initFullscreen() {
				if (!screenfull.isEnabled) return;
				set({ fullscreen: screenfull.isFullscreen });
				screenfull.on("change", () =>
					set({ fullscreen: screenfull.isFullscreen }),
				);

				document.addEventListener("keydown", e => {
					// Throws an error but works god knows y
					if (e.key !== "F11") return;
					screenfull.toggle();
					e.preventDefault();
				});
			},
			restart: () => location.reload(),
			shutdown() {
				document.documentElement.style.animation =
					"shutdown 0.5s forwards ease-in-out";
				document.documentElement.style.overflow = "hidden";
				localStorage.setItem("introDone", "false");
			},
		};
		},
		{
			name: "settings",
			onRehydrateStorage: () => state => {
				if (!state) return;
				document.documentElement.classList.toggle(
					"no-blur",
					state.blur === false,
				);
			},
		},
	),
);
