'use client';

import { content } from '@/lib/content';

export function DomainsPreview() {
  const domains = [
    { name: 'Identity', icon: '🎯', description: 'Who you are becoming' },
    { name: 'Energy', icon: '⚡', description: 'Your physical and mental fuel' },
    { name: 'Finances', icon: '💰', description: 'Your wealth-building systems' },
    { name: 'Relationships', icon: '🤝', description: 'Your support network' },
    { name: 'Emotions', icon: '🧘', description: 'Your emotional intelligence' },
    { name: 'Focus', icon: '🎯', description: 'Your attention and priorities' }
  ];

  return (
    <section className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-h2 font-display font-bold text-ink mb-4">
          {content.landing.preview.title}
        </h2>
        <p className="text-lg text-gray-600">
          {content.landing.preview.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {domains.map((domain, index) => (
          <div key={domain.name} className="bg-white rounded-card border border-gray-200 p-6 shadow-elevation-2 hover:shadow-elevation-6 transition-shadow">
            <div className="text-3xl mb-4">{domain.icon}</div>
            <h3 className="text-h5 font-semibold text-ink mb-2">{domain.name}</h3>
            <p className="text-gray-600 text-sm">{domain.description}</p>
            
            {/* Sample Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-full bg-accent rounded-full transition-all duration-normal"
                  style={{ width: `${(index + 1) * 15 + 20}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-600 mb-6">
          See your complete domain analysis in just 10 minutes
        </p>
        <button className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors font-medium">
          Start Assessment
        </button>
      </div>
    </section>
  );
}
