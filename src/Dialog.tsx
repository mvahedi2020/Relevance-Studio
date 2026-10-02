import { useEffect, useRef, type ReactNode } from "react";
export function Dialog({
  title,
  children,
  close,
  drawer = false,
}: {
  title: string;
  children: ReactNode;
  close: () => void;
  drawer?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const d = ref.current!;
    d.showModal();
    d.querySelector<HTMLButtonElement>("button")?.focus();
    return () => {
      d.close();
      if (previous?.isConnected) previous.focus();
      else document.querySelector<HTMLButtonElement>(".hero button")?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={drawer ? "drawer" : ""}
      aria-labelledby="dialog-title"
      onKeyDown={(e) => {
        if (e.key !== "Tab") return;
        const items = Array.from(
          ref.current!.querySelectorAll<HTMLElement>(
            'button, a[href], input, select, textarea, [tabindex="0"]',
          ),
        ).filter((el) => !el.hasAttribute("disabled"));
        const first = items[0],
          last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
    >
      <div className="dialog-top">
        <h2 id="dialog-title">{title}</h2>
        <button aria-label="Close dialog" onClick={close}>
          ×
        </button>
      </div>
      {children}
    </dialog>
  );
}
