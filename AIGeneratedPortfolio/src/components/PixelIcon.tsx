import React from "react";

function hashNameToColor(name: string) {
  const colors = [
    "bg-green-600",
    "bg-emerald-600",
    "bg-teal-600",
    "bg-lime-600",
    "bg-green-700",
    "bg-emerald-700",
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return colors[h % colors.length];
}

export function PixelIcon({ label, className = "" }: { label: string; className?: string }) {
  const color = hashNameToColor(label);
  const initial = label.charAt(0).toUpperCase();

  return (
    <div className={["relative inline-flex items-center justify-center", className].join(" ")}>
      <div className="relative">
        <div className="w-10 h-10 rounded-sm border-4 border-green-800 shadow-sm" />
        <div
          className={[
            "absolute inset-1 rounded-sm",
            color,
            "shadow-inner",
          ].join(" ")}
        />
        <span className="absolute inset-0 flex items-center justify-center text-white font-bold">
          {initial}
        </span>
      </div>
    </div>
  );
}