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
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((likertValue) => (
        <button
          key={likertValue}
          onClick={() => onChange(likertValue)}
          className={`w-full p-4 text-left rounded-lg border transition-colors ${
            value === likertValue
              ? 'border-gray-900 bg-gray-900 text-white'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <span className="font-medium">{likertValue}</span>
          <span className="ml-2 text-sm opacity-75">
            {LIKERT_LABELS[likertValue as keyof typeof LIKERT_LABELS]}
          </span>
        </button>
      ))}
    </div>
  );
}

