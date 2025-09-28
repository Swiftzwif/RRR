import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Testimonials',
  description: 'Hear from men who have transformed their trajectory and shifted from the sidelines to the Fastlane.',
};

export default function TestimonialsPage() {
  const testimonials = [
    {
      name: "Marcus Chen",
      role: "Tech Entrepreneur",
      content: "Trajectory helped me realize I was stuck in the SlowLane, trading time for money. The assessment opened my eyes to the systems I needed to build. Now I'm running a 7-figure business and have the freedom I always wanted.",
      avatar: "MC"
    },
    {
      name: "David Rodriguez",
      role: "Investment Advisor",
      content: "The 'Kill the Boy' philosophy changed everything for me. I was always waiting for permission, following orders. Trajectory taught me to become the commander of my own life. The results speak for themselves.",
      avatar: "DR"
    },
    {
      name: "James Thompson",
      role: "Real Estate Developer",
      content: "I was drifting, no clear direction. The assessment showed me exactly where I was weak and gave me a roadmap to fix it. The course content is pure gold - practical, actionable, no fluff.",
      avatar: "JT"
    },
    {
      name: "Alex Kumar",
      role: "Consultant",
      content: "The coaching sessions were transformative. Having someone guide me through the process of redesigning my systems and mindset was invaluable. I went from reactive to proactive in every area of my life.",
      avatar: "AK"
    },
    {
      name: "Ryan Foster",
      role: "Business Owner",
      content: "Trajectory didn't just change my business - it changed my life. I learned to filter out the noise, focus on what matters, and build systems that work. The FastLane isn't just about money, it's about freedom.",
      avatar: "RF"
    },
    {
      name: "Michael Torres",
      role: "Executive",
      content: "The assessment was brutally honest about where I was. But that honesty was exactly what I needed. The 7-day and 30-day action plans gave me immediate wins and long-term direction. Game changer.",
      avatar: "MT"
    }
  ];

  return (
    <div className="min-h-screen bg-sky-50">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 text-sky-800">
            Testimonials
          </h1>
          <p className="text-xl text-sky-600 mb-8 leading-relaxed">
            Hear from men who have transformed their trajectory and shifted from the sidelines to the Fastlane.
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center text-sky-800 font-semibold text-lg mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sky-800">{testimonial.name}</h3>
                    <p className="text-sm text-sky-600">{testimonial.role}</p>
                  </div>
                </div>
                <blockquote className="text-sky-700 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-display font-bold mb-12 text-sky-800 text-center">
            The Results Speak for Themselves
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-sky-600 mb-2">87%</div>
              <p className="text-sky-700">Report increased clarity and direction</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-sky-600 mb-2">$2.3M</div>
              <p className="text-sky-700">Average increase in annual income</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-sky-600 mb-2">94%</div>
              <p className="text-sky-700">Would recommend to other high-value men</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-sky-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-display font-bold mb-6 text-white">
            Ready to Join Them?
          </h2>
          <p className="text-xl text-sky-200 mb-8">
            Take the first step in your transformation. Discover which lane you're currently in and how to shift to the Fastlane.
          </p>
          <a
            href="/assessment"
            className="inline-block bg-sky-400 hover:bg-sky-300 text-sky-800 font-semibold px-8 py-4 rounded-lg transition-colors"
          >
            Start Your Assessment
          </a>
        </div>
      </section>
    </div>
  );
}
