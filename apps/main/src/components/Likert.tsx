interface LikertProps {
  value: number | null;
  onChange: (value: number) => void;
}

const LIKERT_LABELS = {
  1: 'Never',
  2: 'Rarely', 
  3: 'Sometimes',
  4: 'Often',
  5: 'Always'
};

export default function Likert({ value, onChange }: LikertProps) {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((likertValue) => (
        <button
          key={likertValue}
          onClick={() => onChange(likertValue)}
          className={`w-full p-4 text-left rounded-xl border transition-all duration-200 ${
            value === likertValue
              ? 'border-neutral-900 bg-neutral-900 text-white'
              : 'border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-900'
          }`}
        >
          <span className="font-semibold">{likertValue}</span>
          <span className="ml-2 text-sm opacity-70">
            {LIKERT_LABELS[likertValue as keyof typeof LIKERT_LABELS]}
          </span>
        </button>
      ))}
    </div>
  );
}
