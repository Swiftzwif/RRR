"use client";

interface ShipProgressProps {
  current: number;
  total: number;
  label?: string;
}

export default function ShipProgress({ current, total, label }: ShipProgressProps) {
  const pct = Math.min(100, Math.max(0, (current / total) * 100));
  return (
    <div className="w-full mb-6">
      {label && (
        <div className="mb-2 text-sm text-neutral-700 text-center">{label}</div>
      )}
      {/* Bar + Rocket overlay */}
      <div className="relative">
        <div className="h-3 w-full rounded-full bg-neutral-200 overflow-hidden">
          <div className="h-full rounded-full bg-neutral-900" style={{ width: `${pct}%` }} />
        </div>
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 leading-none"
            style={{ left: `${pct}%` }}
          >
            <span className="text-base">🚀</span>
          </div>
        </div>
      </div>
      <div className="mt-1 text-right text-xs text-neutral-500">{Math.round(pct)}%</div>
    </div>
  );
}
