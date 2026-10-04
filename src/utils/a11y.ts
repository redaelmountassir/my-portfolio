const FOCUSABLE =
	'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const getFocusable = (container: HTMLElement) =>
	[...container.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(el => {
		let node: HTMLElement | null = el;
		while (node && node !== container) {
			if (
				node.getAttribute("aria-hidden") === "true" ||
				node.hasAttribute("inert")
			)
				return false;
			node = node.parentElement;
		}
		return el.getClientRects().length > 0;
	});

export const trapTab = (
	container: HTMLElement,
	e: { key: string; shiftKey: boolean; preventDefault: () => void },
) => {
	if (e.key !== "Tab") return;
	const items = getFocusable(container);
	if (items.length === 0) {
		e.preventDefault();
		container.focus();
		return;
	}
	const first = items[0];
	const last = items[items.length - 1];
	const active = document.activeElement;
	if (e.shiftKey && (active === first || active === container)) {
		e.preventDefault();
		last.focus();
	} else if (!e.shiftKey && active === last) {
		e.preventDefault();
		first.focus();
	}
};

type Announcer = (message: string) => void;
let announcer: Announcer | null = null;

export const subscribeAnnounce = (fn: Announcer) => {
	announcer = fn;
	return () => {
		announcer === fn && (announcer = null);
	};
};

export const announce = (message: string) => {
	announcer?.("");
	queueMicrotask(() => announcer?.(message));
};
