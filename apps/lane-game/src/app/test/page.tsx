export default function TestPage() {
  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-sky-600 mb-4">
          Lane Game Test Page
        </h1>
        <p className="text-sky-500">
          If you can see this, the basic setup is working!
        </p>
        <div className="mt-8">
          <a 
            href="/" 
            className="bg-sky-400 text-white px-6 py-3 rounded-lg hover:bg-sky-500 transition-colors"
          >
            Go to Landing Page
          </a>
        </div>
      </div>
    </div>
  );
}
