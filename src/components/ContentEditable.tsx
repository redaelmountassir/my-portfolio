import { motion, useMotionValue } from "framer-motion";
import React, { memo, useContext, useEffect, useRef } from "react";
import { MobileContext } from "./OS";

function getCaretPosition() {
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    return { top: rect.top, left: rect.left };
  }
  return null;
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

interface ContentEditableProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  > {
  value: string;
  onUpdate: (str: string) => void;
}

const ContentEditable: React.FC<ContentEditableProps> = memo((props) => {
  const { value, onUpdate, ...rest } = props;
  const display = useMotionValue("none");
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const isMobile = useContext(MobileContext);

  const contentEditableRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!contentEditableRef.current) return;
    contentEditableRef.current.innerHTML = props.value;
    onUpdate(contentEditableRef.current.textContent ?? "");
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", () => {
      const pos = getCaretPosition();
      if (!pos) return;
      x.set(pos.left);
      y.set(pos.top);
    });
  }, []);

  return (
    <>
      {!isMobile && (
        <motion.div
          className="fixed left-0 top-0 z-50"
          style={{ display, x, y }}
          onFocus={() => display.set("block")}
          onBlur={() => display.set("none")}
        >
          <motion.div className="-translate-x-1/2 translate-y-[-300%] divide-x-2 divide-white-primary border-2 border-white-primary bg-black-primary">
            <button
              className="w-8 py-1 text-center font-bold transition ease-steps2 hover:bg-white-primary hover:text-black-primary"
              type="button"
              onClick={(e) => {
                if (!contentEditableRef.current) return;
                e.preventDefault();
                modifySelection(contentEditableRef.current, "b");
                display.set("none");
              }}
            >
              B
            </button>
            <button
              className="w-8 py-1 text-center underline transition ease-steps2 hover:bg-white-primary hover:text-black-primary"
              type="button"
              onClick={(e) => {
                if (!contentEditableRef.current) return;
                e.preventDefault();
                modifySelection(contentEditableRef.current, "u");
                display.set("none");
              }}
            >
              U
            </button>
            <button
              className="w-8 py-1 text-center italic transition ease-steps2 hover:bg-white-primary hover:text-black-primary"
              type="button"
              onClick={(e) => {
                if (!contentEditableRef.current) return;
                e.preventDefault();
                modifySelection(contentEditableRef.current, "i");
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
        onInput={(e) =>
          onUpdate((e.target as HTMLParagraphElement).textContent ?? "")
        }
        onFocus={() => display.set("block")}
        onBlur={() => display.set("none")}
      />
    </>
  );
});

export default ContentEditable;
