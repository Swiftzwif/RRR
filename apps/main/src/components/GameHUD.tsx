"use client";

interface GameHUDProps {
  domain: string;
  section: string;
  // streak intentionally omitted from display per request
  score: number;
}

export default function GameHUD({ domain, section, score }: GameHUDProps) {
  return (
    <div className="mb-4 grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
      <div className="rounded-xl border border-neutral-200 bg-white p-3 shadow-sm">
        <div className="opacity-60">Section</div>
        <div className="font-semibold">{section}</div>
      </div>
      <div className="rounded-xl border border-neutral-200 bg-white p-3 shadow-sm">
        <div className="opacity-60">Domain</div>
        <div className="font-semibold capitalize">{domain}</div>
      </div>
      <div className="rounded-xl border border-neutral-200 bg-white p-3 shadow-sm">
        <div className="opacity-60">Score</div>
        <div className="font-semibold">{score.toLocaleString()}</div>
      </div>
    </div>
  );
}
