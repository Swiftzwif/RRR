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

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case 'identity': return '🧭';
      case 'health': return '⚡';
      case 'finances': return '💰';
      case 'relationships': return '🤝';
      case 'emotions': return '🌊';
      case 'focus': return '🎯';
      default: return '📊';
    }
  };

  const getDomainLabel = (domain: string) => {
    switch (domain) {
      case 'identity': return 'Identity & Direction';
      case 'health': return 'Health & Energy';
      case 'finances': return 'Finances';
      case 'relationships': return 'Relationships';
      case 'emotions': return 'Emotions & State';
      case 'focus': return 'Focus & Attention';
      default: return domain;
    }
  };

  const getStatusLabel = (domain: string, score: number) => {
    if (score <= 3.1) {
      switch (domain) {
        case 'identity': return 'Lost (Noise)';
        case 'health': return 'Drained (Noise)';
        case 'finances': return 'Vulnerable (Noise)';
        case 'relationships': return 'Isolated (Noise)';
        case 'emotions': return 'Reactive (Noise)';
        case 'focus': return 'Scattered (Noise)';
        default: return 'Unacceptable';
      }
    } else if (score <= 4.1) {
      switch (domain) {
        case 'identity': return 'Drifting (Floor)';
        case 'health': return 'Surviving (Floor)';
        case 'finances': return 'Stable (Floor)';
        case 'relationships': return 'Neutral (Floor)';
        case 'emotions': return 'Unsteady (Floor)';
        case 'focus': return 'Distracted (Floor)';
        default: return 'Acceptable';
      }
    } else {
      switch (domain) {
        case 'identity': return 'Architect (Signal)';
        case 'health': return 'Energized (Signal)';
        case 'finances': return 'Secure (Signal)';
        case 'relationships': return 'Supported (Signal)';
        case 'emotions': return 'Calm (Signal)';
        case 'focus': return 'Laser-Focused (Signal)';
        default: return 'Desirable';
      }
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <span className="text-xl mr-2">{getDomainIcon(label)}</span>
          <span className="font-medium">{getDomainLabel(label)}</span>
        </div>
        <span className="text-sm text-gray-600">{value.toFixed(1)}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full ${getColor(value)}`}
          style={{ width: `${(value / 5) * 100}%` }}
        ></div>
      </div>
      <span className="text-sm text-gray-600">{getStatusLabel(label, value)}</span>
    </div>
  );
}

