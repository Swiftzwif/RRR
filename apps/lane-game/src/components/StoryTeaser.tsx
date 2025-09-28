'use client';

import { content } from '@/lib/content';

export function StoryTeaser() {
  return (
    <section className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-h2 font-display font-bold text-ink mb-4">
          {content.landing.story.title}
        </h2>
        <p className="text-lg text-gray-600">
          {content.landing.story.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {content.landing.story.bullets.map((bullet, index) => (
          <div key={index} className="text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">
                {index === 0 ? '🔄' : index === 1 ? '🏗️' : '⚡'}
              </span>
            </div>
            <h3 className="font-semibold text-ink mb-2">{bullet}</h3>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-600 mb-6">
          "The boy dies, but the man lives. Kill the boy and let the man be born."
        </p>
        <button className="text-accent hover:text-accent/80 font-medium transition-colors">
          Read the full story →
        </button>
      </div>
    </section>
  );
}
