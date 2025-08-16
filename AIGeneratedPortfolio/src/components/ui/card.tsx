import React from "react";

export function Card({
  className = "",
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={["bg-white border border-green-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200", className].join(" ")}>
      {children}
    </div>
  );
}

export function CardHeader({
  className = "",
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return <div className={["p-4 border-b border-green-100", className].join(" ")}>{children}</div>;
}

export function CardTitle({
  className = "",
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return <h3 className={["text-lg font-semibold text-gray-900", className].join(" ")}>{children}</h3>;
}

export function CardDescription({
  className = "",
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return <p className={["text-sm text-gray-600", className].join(" ")}>{children}</p>;
}

export function CardContent({
  className = "",
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return <div className={["p-4", className].join(" ")}>{children}</div>;
}

export function CardFooter({
  className = "",
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return <div className={["p-4 border-t border-green-100", className].join(" ")}>{children}</div>;
}