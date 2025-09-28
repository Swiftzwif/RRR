import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Trajectory and our mission to help high-value men transition to the Fastlane.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-sky-50">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 text-sky-800">
            About Trajectory
          </h1>
          <p className="text-xl text-sky-600 mb-8 leading-relaxed">
            Your trajectory determines your destiny. We help high-value men
            transition from the sidelines to the Fastlane.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-display font-bold mb-8 text-sky-800 text-center">
            Our Mission
          </h2>
          <div className="prose prose-lg max-w-none text-sky-700">
            <p className="text-lg leading-relaxed mb-6">
              Trajectory exists to help high-value men reclaim the driver's seat
              of their lives. We believe that most people are stuck in the wrong
              lane—SlowLane or SideLane—because they bought the lie of being
              "good little soldiers."
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Good little soldiers lack the knowledge, understanding, and
              applied wisdom to change their conditions. They follow orders
              instead of trusting their own judgment.
            </p>
            <p className="text-lg leading-relaxed">
              Through our assessment platform, premium course, and coaching
              programs, we help you:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>Reclaim the driver's seat</li>
              <li>Upgrade your engine</li>
              <li>Accelerate into the FastLane</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 px-6 bg-sky-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-display font-bold mb-8 text-sky-800 text-center">
            The Kill the Boy Philosophy
          </h2>
          <div className="prose prose-lg max-w-none text-sky-700">
            <p className="text-lg leading-relaxed mb-6">
              "Kill the boy" isn't about violence—it's about transformation. It
              means letting go of the parts of you that keep you small,
              reactive, average—so you can rise into discipline, presence, and
              responsibility.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-sky-800">
                  The Boy
                </h3>
                <ul className="space-y-2 text-sky-700">
                  <li>• Settles for less</li>
                  <li>• Tolerates mediocrity</li>
                  <li>• Complains and explains</li>
                  <li>• Reacts like a puppet</li>
                  <li>• Rushes without intention</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-sky-800">
                  The Man
                </h3>
                <ul className="space-y-2 text-sky-700">
                  <li>• Insists on excellence</li>
                  <li>• Demands high standards</li>
                  <li>• Acts with presence</li>
                  <li>• Chooses his response</li>
                  <li>• Moves with intention</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-sky-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-display font-bold mb-6 text-white">
            Ready to Shift Your Trajectory?
          </h2>
          <p className="text-xl text-sky-200 mb-8">
            Take our assessment to discover which lane you're currently in and
            how to transition to the Fastlane.
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
