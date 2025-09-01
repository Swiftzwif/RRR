export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center px-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Welcome to KillTheBoy
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          This is not just a quiz — it's a mirror. In 10 minutes, you'll discover what's shaping your trajectory, where you're strong, and where the noise is holding you back.
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">The Story: Kill the Boy</h2>
          <p className="text-gray-700 mb-4">
            When I turned 25, my mentor told me something I'll never forget:
          </p>
          <blockquote className="text-2xl font-bold text-gray-900 mb-4">
            "Kill the boy."
          </blockquote>
          <p className="text-gray-700 mb-4">
            It wasn't about violence. It was about transformation.
          </p>
          <p className="text-gray-700 mb-4">
            It meant letting go of the parts of me that kept me small, reactive, average — so I could rise into discipline, presence, and responsibility.
          </p>
          <p className="text-lg font-semibold text-gray-900">
            Kill the boy so the man may rise.
          </p>
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">The Challenge</h3>
          <p className="text-gray-600 mb-6">
            This assessment is your first step. It's not about perfection. It's about honesty.
          </p>
          <p className="text-lg font-semibold text-gray-900 mb-6">
            So the real question is... Are you ready to kill the boy?
          </p>
        </div>
        
        <a 
          href="/assess"
          className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
        >
          Begin
        </a>
      </div>
    </div>
  );
}
