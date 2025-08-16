import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

export function Button({
  className = "",
  variant = "default",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    default:
      "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg",
    secondary:
      "bg-green-100 text-green-900 hover:bg-green-200 shadow-sm hover:shadow",
    outline:
      "bg-white text-green-800 border border-green-300 hover:bg-green-50 shadow-sm",
    ghost:
      "bg-transparent text-green-800 hover:bg-green-50",
  };

  const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={[base, variants[variant], sizes[size], className].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}