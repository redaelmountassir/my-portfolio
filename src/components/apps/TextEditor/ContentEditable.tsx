import { motion, useMotionValue } from "motion/react";
import React, { useContext, useEffect, useRef } from "react";
import { MobileContext } from "../../../store/MobileContext";

function nonEmptyRect(range: Range) {
	const rects = range.getClientRects();
	for (const rect of rects) {
		if (rect.width > 0 || rect.height > 0) return rect;
	}
	const rect = range.getBoundingClientRect();
	if (rect.width === 0 && rect.height === 0) return null;
	return rect;
}

function rangeRect(node: Node, start: number, end: number) {
	const range = document.createRange();
	range.setStart(node, start);
	range.setEnd(node, end);
	return nonEmptyRect(range);
}

function caretClientRect(node: Node, offset: number): DOMRect | null {
	if (node.nodeType === Node.TEXT_NODE) {
		const text = node as Text;
		const length = text.data.length;
		const prev = offset > 0 ? rangeRect(text, offset - 1, offset) : null;
		const next =
			offset < length ? rangeRect(text, offset, offset + 1) : null;

		if (prev && next && Math.abs(prev.top - next.top) > 1) {
			const collapsed = rangeRect(text, offset, offset);
			const onPrevLine =
				!!collapsed &&
				Math.abs(collapsed.top - prev.top) <
					Math.abs(collapsed.top - next.top);
			if (onPrevLine) {
				return new DOMRect(prev.right, prev.top, 0, prev.height);
			}
			return new DOMRect(next.left, next.top, 0, next.height);
		}

		if (next) return new DOMRect(next.left, next.top, 0, next.height);
		if (prev) return new DOMRect(prev.right, prev.top, 0, prev.height);
	}

	if (node.nodeType === Node.ELEMENT_NODE) {
		const child = node.childNodes[offset];
		if (child) return caretClientRect(child, 0);
		const prevChild = node.childNodes[offset - 1];
		if (prevChild) {
			return caretClientRect(
				prevChild,
				prevChild.nodeType === Node.TEXT_NODE
					? (prevChild.textContent?.length ?? 0)
					: prevChild.childNodes.length,
			);
		}
	}

	return rangeRect(node, offset, offset);
}

function establishesFixedContainingBlock(style: CSSStyleDeclaration) {
	const willChange = style.willChange;
	if (
		willChange.includes("transform") ||
		willChange.includes("perspective") ||
		willChange.includes("filter")
	) {
		return true;
	}

	return (
		style.transform !== "none" ||
		style.perspective !== "none" ||
		style.filter !== "none" ||
		style.backdropFilter !== "none" ||
		style.translate !== "none" ||
		style.scale !== "none" ||
		style.rotate !== "none" ||
		style.contain.includes("paint")
	);
}

function fixedContainingOrigin(el: HTMLElement) {
	let node = el.parentElement;
	while (node) {
		const style = getComputedStyle(node);
		if (establishesFixedContainingBlock(style)) {
			const rect = node.getBoundingClientRect();
			return {
				left: rect.left + (parseFloat(style.borderLeftWidth) || 0),
				top: rect.top + (parseFloat(style.borderTopWidth) || 0),
			};
		}
		node = node.parentElement;
	}
	return { left: 0, top: 0 };
}

function getCaretPosition(editable: HTMLElement) {
	const sel = window.getSelection();
	if (!sel || sel.rangeCount === 0 || !sel.focusNode) return null;
	if (!editable.contains(sel.focusNode)) return null;

	const rect = caretClientRect(sel.focusNode, sel.focusOffset);
	if (!rect) return null;

	const origin = fixedContainingOrigin(editable);
	return {
		top: rect.top - origin.top,
		left: rect.left - origin.left,
	};
}

function getIndexRelative(
	relativeTo: HTMLElement,
	initPos: number,
	initNode: Node,
) {
	let pos = initPos;
	let currentNode = initNode;
	while (true) {
		if (currentNode.previousSibling) {
			currentNode = currentNode.previousSibling;
			switch (currentNode.nodeType) {
				case 3:
					pos += (currentNode.nodeValue ?? "").length;
					break;
				case 1:
				default:
					pos += (currentNode as Element).outerHTML.length;
					break;
			}
		} else if (
			currentNode.parentNode &&
			currentNode.parentNode !== relativeTo
		) {
			currentNode = currentNode.parentNode;
			const element = currentNode as Element;
			const outer = element.outerHTML;
			pos += outer.indexOf(element.innerHTML);
		} else break;
	}
	return pos;
}

function modifySelection(input: HTMLElement, tag: string) {
	const sel = window.getSelection();
	if (!sel || !sel.anchorNode || !sel.focusNode) return;

	let startPos = getIndexRelative(input, sel.anchorOffset, sel.anchorNode);
	let endPos = sel.isCollapsed
		? startPos
		: getIndexRelative(input, sel.focusOffset, sel.focusNode);

	if (endPos < startPos) {
		const temp = startPos;
		startPos = endPos;
		endPos = temp;
	}

	let inner = input.innerHTML;
	const prior = inner.slice(0, startPos);
	const selected = inner.slice(startPos, endPos);
	const after = inner.slice(endPos);

	let newSelected = `<${tag}>${selected}</${tag}>`;
	input.innerHTML = `${prior}${newSelected}${after}`;
}

interface ContentEditableProps extends React.ComponentPropsWithoutRef<"p"> {
	value: string;
	onUpdate: (str: string) => void;
}

const ContentEditable = ({
	value,
	onUpdate,
	...rest
}: ContentEditableProps) => {
	const display = useMotionValue("none");
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const isMobile = useContext(MobileContext);

	const contentEditableRef = useRef<HTMLParagraphElement>(null);

	useEffect(() => {
		if (!contentEditableRef.current) return;
		contentEditableRef.current.innerHTML = value;
		onUpdate(contentEditableRef.current.textContent ?? "");
	}, []);

	useEffect(() => {
		const update = () => {
			const editable = contentEditableRef.current;
			if (!editable) return;
			const pos = getCaretPosition(editable);
			if (!pos) return;
			x.set(pos.left);
			y.set(pos.top);
		};
		document.addEventListener("selectionchange", update);
		document.addEventListener("scroll", update, true);
		window.addEventListener("resize", update);
		return () => {
			document.removeEventListener("selectionchange", update);
			document.removeEventListener("scroll", update, true);
			window.removeEventListener("resize", update);
		};
	}, [x, y]);

	useEffect(() => {
		const editable = contentEditableRef.current;
		if (!editable || isMobile) return;

		let armed = false;

		const onPointerDown = (event: PointerEvent) => {
			if (!editable.contains(event.target as Node)) return;
			armed = true;
			display.set("none");
		};

		const onPointerUp = () => {
			if (!armed) return;
			armed = false;
			const pos = getCaretPosition(editable);
			if (!pos) return;
			x.set(pos.left);
			y.set(pos.top);
			display.set("block");
		};

		const onPointerCancel = () => {
			armed = false;
		};

		document.addEventListener("pointerdown", onPointerDown);
		document.addEventListener("pointerup", onPointerUp);
		document.addEventListener("pointercancel", onPointerCancel);
		return () => {
			document.removeEventListener("pointerdown", onPointerDown);
			document.removeEventListener("pointerup", onPointerUp);
			document.removeEventListener("pointercancel", onPointerCancel);
		};
	}, [display, isMobile, x, y]);

	return (
		<>
			{!isMobile && (
				<motion.div
					className="fixed top-0 left-0 z-10"
					style={{ display, x, y }}
					onMouseDown={e => e.preventDefault()}
					onBlur={() => display.set("none")}
				>
					<motion.div className="-translate-x-1/2 translate-y-[calc(-100%-12px)] divide-x-2 divide-white-primary border-2 bg-black-primary">
						<button
							className="w-8 py-1 text-center font-bold transition ease-steps-2 hover:bg-white-primary hover:text-black-primary focus-visible:bg-white-primary focus-visible:text-black-primary"
							type="button"
							aria-label="Bold"
							onClick={e => {
								if (!contentEditableRef.current) return;
								e.preventDefault();
								modifySelection(
									contentEditableRef.current,
									"b",
								);
								display.set("none");
							}}
						>
							B
						</button>
						<button
							className="w-8 py-1 text-center underline transition ease-steps-2 hover:bg-white-primary hover:text-black-primary focus-visible:bg-white-primary focus-visible:text-black-primary"
							type="button"
							aria-label="Underline"
							onClick={e => {
								if (!contentEditableRef.current) return;
								e.preventDefault();
								modifySelection(
									contentEditableRef.current,
									"u",
								);
								display.set("none");
							}}
						>
							U
						</button>
						<button
							className="w-8 py-1 text-center italic transition ease-steps-2 hover:bg-white-primary hover:text-black-primary focus-visible:bg-white-primary focus-visible:text-black-primary"
							type="button"
							aria-label="Italic"
							onClick={e => {
								if (!contentEditableRef.current) return;
								e.preventDefault();
								modifySelection(
									contentEditableRef.current,
									"i",
								);
								display.set("none");
							}}
						>
							I
						</button>
					</motion.div>
				</motion.div>
			)}
			<p
				{...rest}
				contentEditable
				ref={contentEditableRef}
				onInput={e =>
					onUpdate(
						(e.target as HTMLParagraphElement).textContent ?? "",
					)
				}
				onBlur={() => display.set("none")}
			/>
		</>
	);
};

export default ContentEditable;
