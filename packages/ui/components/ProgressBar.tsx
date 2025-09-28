interface ProgressBarProps {
  progress: number; // 0-100 percentage
  className?: string;
}

export default function ProgressBar({ progress, className = "" }: ProgressBarProps) {
  return (
    <div className={`w-full bg-sky-200 rounded-full h-2 overflow-hidden ${className}`}>
      <div
        className="h-2 rounded-full transition-all duration-300 bg-sky-400"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
}
