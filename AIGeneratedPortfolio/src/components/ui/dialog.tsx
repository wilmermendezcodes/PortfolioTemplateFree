import React, { createContext, useContext, useEffect, useRef, useState } from "react";

type DialogContextType = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const DialogContext = createContext<DialogContextType | null>(null);

type DialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
};

export function Dialog({ open: openProp, onOpenChange, children }: DialogProps) {
  const [uncontrolled, setUncontrolled] = useState(false);
  const open = openProp ?? uncontrolled;

  const setOpen = (v: boolean) => {
    if (onOpenChange) onOpenChange(v);
    else setUncontrolled(v);
  };

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("Dialog components must be used within <Dialog>");
  return ctx;
}

export function DialogTrigger({
  asChild,
  children,
}: {
  asChild?: boolean;
  children: React.ReactNode;
}) {
  const { setOpen } = useDialog();
  const child = React.isValidElement(children) ? children : null;

  if (asChild && child) {
    return React.cloneElement(child as React.ReactElement, {
      onClick: (e: React.MouseEvent) => {
        child.props.onClick?.(e);
        setOpen(true);
      },
    });
  }

  return (
    <button
      className="text-green-800 hover:text-green-900 underline-offset-4 hover:underline transition-colors"
      onClick={() => setOpen(true)}
    >
      {children}
    </button>
  );
}

export function DialogOverlay() {
  const { open, setOpen } = useDialog();
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40"
      onClick={() => setOpen(false)}
      aria-hidden="true"
    />
  );
}

export function DialogContent({
  className = "",
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  const { open, setOpen } = useDialog();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={ref}
        className={[
          "pixel-border w-full max-w-2xl bg-white rounded-lg shadow-xl",
          className,
        ].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({
  className = "",
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return <div className={["p-4 border-b border-green-100", className].join(" ")}>{children}</div>;
}

export function DialogTitle({
  className = "",
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return <h4 className={["text-xl font-semibold text-gray-900", className].join(" ")}>{children}</h4>;
}

export function DialogDescription({
  className = "",
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return <p className={["text-sm text-gray-600", className].join(" ")}>{children}</p>;
}

export function DialogFooter({
  className = "",
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return <div className={["p-4 border-t border-green-100", className].join(" ")}>{children}</div>;
}

export function DialogClose({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  const { setOpen } = useDialog();
  return (
    <button
      onClick={() => setOpen(false)}
      className={[
        "px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors",
        className,
      ].join(" ")}
    >
      {children ?? "Close"}
    </button>
  );
}