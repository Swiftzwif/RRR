interface DomainMeterProps {
  label: string;
  value: number;
  bandLabel: string;
}

export default function DomainMeter({ label, value, bandLabel }: DomainMeterProps) {
  const getColor = (score: number) => {
    if (score <= 3.1) return 'bg-red-500';
    if (score <= 4.1) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium capitalize">{label}</span>
        <span className="text-sm text-gray-600">{value.toFixed(1)}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full ${getColor(value)}`}
          style={{ width: `${(value / 5) * 100}%` }}
        ></div>
      </div>
      <span className="text-sm text-gray-600">{bandLabel}</span>
    </div>
  );
}

