import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Free resources, tools, and curated content to help you on your trajectory journey.",
};

export default function ResourcesPage() {
  const resources = [
    {
      title: "50+ Curated Books",
      description:
        "A carefully selected library of books that inspired the Trajectory system. From mindset to money, relationships to systems.",
      category: "Reading List",
      status: "Available",
    },
    {
      title: "Lane Diagnostic Quiz",
      description:
        "Discover which financial lane you're currently in - Sidewalk, Slowlane, or Fastlane - based on MJ DeMarco's framework.",
      category: "Assessment",
      status: "Available",
    },
    {
      title: "Weekly Trajectory Brief",
      description:
        "Get insights, frameworks, and actionable content delivered to your inbox every week.",
      category: "Newsletter",
      status: "Available",
    },
    {
      title: "Systems Templates",
      description:
        "Ready-to-use templates for habit tracking, goal setting, and system building.",
      category: "Tools",
      status: "Coming Soon",
    },
    {
      title: "Mindset Mastery Guide",
      description:
        "A comprehensive guide to shifting from consumer to creator mindset.",
      category: "Guide",
      status: "Coming Soon",
    },
    {
      title: "Community Access",
      description:
        "Join a private community of like-minded men on their trajectory journey.",
      category: "Community",
      status: "Premium",
    },
  ];

  return (
    <div className="min-h-screen bg-sky-50">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 text-sky-800">
            Resources
          </h1>
          <p className="text-xl text-sky-600 mb-8 leading-relaxed">
            Free downloads, tools, and curated content to accelerate your
            trajectory journey.
          </p>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      resource.status === "Available"
                        ? "bg-green-100 text-green-800"
                        : resource.status === "Coming Soon"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-sky-100 text-sky-800"
                    }`}
                  >
                    {resource.status}
                  </span>
                  <span className="text-xs text-sky-600 font-medium">
                    {resource.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-sky-800 mb-3">
                  {resource.title}
                </h3>
                <p className="text-sky-700 leading-relaxed">
                  {resource.description}
                </p>
                {resource.status === "Available" && (
                  <a
                    href={
                      resource.title.includes("Books")
                        ? "/resources/books"
                        : resource.title.includes("Quiz")
                        ? "/lane-diagnostic/landing"
                        : resource.title.includes("Brief")
                        ? "/auth/signup"
                        : "#"
                    }
                    className="inline-block mt-4 text-sky-600 hover:text-sky-800 font-medium"
                  >
                    Access Now →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Assessment CTA */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-display font-bold mb-6 text-sky-800">
            Start with Our Free Assessment
          </h2>
          <p className="text-lg text-sky-700 mb-8">
            Before diving into resources, discover where you currently stand.
            Our assessment will show you exactly which lane you're in and what
            needs to change.
          </p>
          <a
            href="/assessment"
            className="inline-block bg-sky-600 hover:bg-sky-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
          >
            Take Free Assessment
          </a>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-6 bg-sky-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-display font-bold mb-6 text-white">
            Get the Weekly Trajectory Brief
          </h2>
          <p className="text-xl text-sky-200 mb-8">
            Join thousands of men receiving weekly insights, frameworks, and
            actionable content.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-sky-800"
            />
            <button className="bg-sky-400 hover:bg-sky-300 text-sky-800 font-semibold px-6 py-3 rounded-lg transition-colors">
              Subscribe
            </button>
          </div>
          <p className="text-sm text-sky-300 mt-4">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
}
