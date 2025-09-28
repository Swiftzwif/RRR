'use client';

export function SocialProof() {
  const testimonials = [
    {
      quote: "This assessment completely changed how I think about my trajectory. I finally have clarity on where to focus.",
      author: "Marcus T.",
      role: "Entrepreneur"
    },
    {
      quote: "The domain breakdown was eye-opening. I realized I was strong in areas I thought I was weak, and vice versa.",
      author: "David K.",
      role: "Executive"
    },
    {
      quote: "Best 10 minutes I've spent on self-assessment. The insights were spot-on and actionable.",
      author: "James R.",
      role: "Consultant"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Men Assessed" },
    { number: "94%", label: "Found It Valuable" },
    { number: "87%", label: "Took Action" }
  ];

  return (
    <section className="max-w-6xl mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-4xl font-bold text-ink mb-2">{stat.number}</div>
            <div className="text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white rounded-card border border-gray-200 p-6 shadow-elevation-2">
            <div className="text-gray-600 mb-4 italic">
              "{testimonial.quote}"
            </div>
            <div className="border-t border-gray-100 pt-4">
              <div className="font-semibold text-ink">{testimonial.author}</div>
              <div className="text-sm text-gray-500">{testimonial.role}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Indicators */}
      <div className="text-center mt-12">
        <p className="text-gray-500 text-sm mb-4">Trusted by men at:</p>
        <div className="flex justify-center items-center space-x-8 opacity-60">
          <div className="text-lg font-semibold">Fortune 500</div>
          <div className="text-lg font-semibold">Startups</div>
          <div className="text-lg font-semibold">Consulting</div>
          <div className="text-lg font-semibold">Finance</div>
        </div>
      </div>
    </section>
  );
}
