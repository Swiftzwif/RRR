import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Submission not found.
        </h1>
        <p className="text-gray-600 mb-6">
          The submission you're looking for doesn't exist or has been removed.
        </p>
        <Link 
          href="/assess"
          className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800"
        >
          Take Assessment
        </Link>
      </div>
    </div>
  );
}

