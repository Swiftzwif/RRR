interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export default function ProgressBar({ current, total, label }: ProgressBarProps) {
  const progress = (current / total) * 100;
  
  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm text-neutral-600 mb-2">
        <span>{label || `${current} of ${total} answered`}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full transition-all duration-300 bg-neutral-900"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
