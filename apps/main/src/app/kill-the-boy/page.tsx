import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kill the Boy',
  description: 'The philosophy behind Trajectory - transforming from boy to man through discipline, presence, and responsibility.',
};

export default function KillTheBoyPage() {
  return (
    <div className="min-h-screen bg-sky-50">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 text-sky-800">
            Kill the Boy
          </h1>
          <p className="text-xl text-sky-600 mb-8 leading-relaxed">
            "Kill the boy so the man may rise."
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-display font-bold mb-8 text-sky-800 text-center">
            The Story
          </h2>
          <div className="prose prose-lg max-w-none text-sky-700">
            <p className="text-lg leading-relaxed mb-6">
              When I turned 25, my mentor told me something I'll never forget:
            </p>
            <blockquote className="text-2xl font-semibold text-sky-800 text-center my-8 p-6 bg-sky-50 rounded-lg">
              "Kill the boy."
            </blockquote>
            <p className="text-lg leading-relaxed mb-6">
              It wasn't about violence. It was about transformation.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              It meant letting go of the parts of me that kept me small, reactive, average—so I could rise into discipline, presence, and responsibility.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 px-6 bg-sky-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-display font-bold mb-12 text-sky-800 text-center">
            The Boy vs. The Man
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* The Boy */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-display font-bold mb-6 text-red-600 text-center">
                The Boy
              </h3>
              <ul className="space-y-4 text-sky-700">
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">•</span>
                  <span>The <strong>boy</strong> settles. The <strong>man</strong> insists.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">•</span>
                  <span>The <strong>boy</strong> tolerates mediocrity. The <strong>man</strong> demands excellence.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">•</span>
                  <span>The <strong>boy</strong> complains. The <strong>man</strong> is silent, steady, grounded.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">•</span>
                  <span>The <strong>boy</strong> explains himself. The <strong>man</strong> doesn't need to—his presence speaks.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">•</span>
                  <span>The <strong>boy</strong> reacts, pulled like a puppet. The <strong>man</strong> observes, cuts the strings, and chooses his response.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">•</span>
                  <span>The <strong>boy</strong> rushes. The <strong>man</strong> moves with intention.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">•</span>
                  <span>The <strong>boy</strong> asks: "What can the world offer me?"</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">•</span>
                  <span>The <strong>man</strong> asks: "What can I offer the world?"</span>
                </li>
              </ul>
            </div>

            {/* The Man */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-display font-bold mb-6 text-green-600 text-center">
                The Man
              </h3>
              <ul className="space-y-4 text-sky-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">•</span>
                  <span>Commands his attention—no algorithm hijacks it</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">•</span>
                  <span>Commands his energy—directed, focused, unstoppable</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">•</span>
                  <span>Commands his money—a tool, never a master</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">•</span>
                  <span>Shapes his reality through conscious choice</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">•</span>
                  <span>Moves from good little soldier to commander of his life</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">•</span>
                  <span>Belongs in the FastLane</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">•</span>
                  <span>Rises into his full potential</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Transformation Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-display font-bold mb-8 text-sky-800">
            The Transformation
          </h2>
          <div className="prose prose-lg max-w-none text-sky-700">
            <p className="text-lg leading-relaxed mb-6">
              To kill the <strong>boy</strong> is not to reject your youth, but to lay it to rest—the <strong>man</strong> decided to put away childish things—so <strong>he</strong> can rise.
            </p>
            <p className="text-lg leading-relaxed mb-8">
              This is the mission of <strong>Trajectory</strong>: to guide men from good little soldiers to commanders of their life and mind.
            </p>
            <blockquote className="text-xl font-semibold text-sky-800 my-8 p-6 bg-sky-50 rounded-lg">
              Because when you kill the boy, you awaken the man who rules his own destiny.
            </blockquote>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-sky-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-display font-bold mb-6 text-white">
            Are You Ready to Kill the Boy?
          </h2>
          <p className="text-xl text-sky-200 mb-8">
            Take our assessment to discover where you stand and begin your transformation.
          </p>
          <a
            href="/assessment"
            className="inline-block bg-sky-400 hover:bg-sky-300 text-sky-800 font-semibold px-8 py-4 rounded-lg transition-colors"
          >
            Begin Your Transformation
          </a>
        </div>
      </section>
    </div>
  );
}
