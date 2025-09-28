'use client';

import { cn } from '@/lib/utils';

interface ResourceBook {
  title: string;
  author: string;
  description: string;
  keyQuote: string;
  category: 'identity' | 'energy' | 'finances' | 'relationships' | 'emotions' | 'focus';
}

interface ResourceBooksProps {
  className?: string;
}

const resourceBooks: ResourceBook[] = [
  {
    title: "The Millionaire Fastlane",
    author: "MJ DeMarco",
    description: "Transform from consumer to producer mindset",
    keyQuote: "The Fastlane is about leverage, multiplication, and systems.",
    category: "finances"
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    description: "Build systems for lasting change",
    keyQuote: "You do not rise to the level of your goals. You fall to the level of your systems.",
    category: "identity"
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    description: "Master the art of focused work",
    keyQuote: "Deep work is the superpower of the 21st century.",
    category: "focus"
  },
  {
    title: "The Way of the Superior Man",
    author: "David Deida",
    description: "Master masculine energy and purpose",
    keyQuote: "The superior man is not threatened by a superior woman.",
    category: "identity"
  },
  {
    title: "Peak Performance",
    author: "Brad Stulberg & Steve Magness",
    description: "Optimize energy and performance",
    keyQuote: "Stress + Rest = Growth",
    category: "energy"
  },
  {
    title: "Nonviolent Communication",
    author: "Marshall Rosenberg",
    description: "Transform relationships through empathy",
    keyQuote: "Connection before correction.",
    category: "relationships"
  }
];

export function ResourceBooks({ className = '' }: ResourceBooksProps) {
  return (
    <section className={cn('py-16', className)}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-h2 font-display font-bold text-ink mb-4">
            Recommended Reading
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Books that align with your trajectory transformation journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resourceBooks.map((book, index) => (
            <div 
              key={book.title}
              className="bg-white rounded-card border border-gray-200 p-6 shadow-elevation-2 hover:shadow-elevation-6 transition-all duration-normal group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Book Icon */}
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-normal">
                📚
              </div>

              {/* Book Info */}
              <h3 className="font-semibold text-ink mb-2">{book.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{book.author}</p>
              
              {/* Description */}
              <p className="text-sm text-gray-700 mb-4">{book.description}</p>
              
              {/* Key Quote */}
              <blockquote className="text-xs text-gray-500 italic border-l-2 border-accent/20 pl-3 mb-4">
                "{book.keyQuote}"
              </blockquote>

              {/* Category Badge */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                  {book.category}
                </span>
                <button className="text-accent hover:text-accent/80 text-sm font-medium transition-colors">
                  Learn More →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Ready to dive deeper into your transformation?
          </p>
          <button className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors font-medium">
            Get Personalized Recommendations
          </button>
        </div>
      </div>
    </section>
  );
}
