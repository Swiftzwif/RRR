'use client';

import { cn } from '@/lib/utils';

interface QuestionCardProps {
  question: string;
  domain: string;
  value: number;
  onChange: (value: number) => void;
  microcopy?: string;
}

export function QuestionCard({
  question,
  domain,
  value,
  onChange,
  microcopy
}: QuestionCardProps) {
  const likertScale = [
    { value: 1, label: 'Never' },
    { value: 2, label: 'Rarely' },
    { value: 3, label: 'Sometimes' },
    { value: 4, label: 'Often' },
    { value: 5, label: 'Always' }
  ];

  return (
    <div className="bg-white rounded-card border border-gray-200 p-8 shadow-elevation-2">
      {/* Domain Badge */}
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
        {domain.charAt(0).toUpperCase() + domain.slice(1)}
      </div>

      {/* Question */}
      <h2 className="text-h3 font-display font-semibold text-ink mb-8 leading-relaxed">
        {question}
      </h2>

      {/* Likert Scale */}
      <div className="space-y-4">
        {likertScale.map((item) => (
          <label
            key={item.value}
            className={cn(
              'flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-fast hover:bg-gray-50',
              value === item.value
                ? 'border-accent bg-accent/5'
                : 'border-gray-200'
            )}
          >
            <input
              type="radio"
              name="likert"
              value={item.value}
              checked={value === item.value}
              onChange={() => onChange(item.value)}
              className="sr-only"
            />
            <div className={cn(
              'w-5 h-5 rounded-full border-2 mr-4 transition-all duration-fast',
              value === item.value
                ? 'border-accent bg-accent'
                : 'border-gray-300'
            )}>
              {value === item.value && (
                <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
              )}
            </div>
            <div className="flex-1">
              <div className="font-medium text-ink">{item.label}</div>
            </div>
          </label>
        ))}
      </div>

      {/* Microcopy */}
      {microcopy && (
        <p className="text-sm text-gray-500 mt-6 text-center italic">
          {microcopy}
        </p>
      )}
    </div>
  );
}
