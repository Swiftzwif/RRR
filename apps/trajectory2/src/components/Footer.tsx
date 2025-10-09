import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
        <div>
          <div className="font-bold text-white mb-4 text-xl">Trajectory</div>
          <p className="text-gray-300 leading-relaxed">Your trajectory determines your destiny</p>
        </div>
        <div>
          <div className="font-semibold text-white mb-4 text-lg">Quick Links</div>
          <div className="flex flex-col gap-3 text-gray-300">
            <Link href="/story" className="hover:text-blue-400 transition-colors duration-200">
              About
            </Link>
            <Link href="/course" className="hover:text-blue-400 transition-colors duration-200">
              Course
            </Link>
            <Link href="/coaching" className="hover:text-blue-400 transition-colors duration-200">
              Coaching
            </Link>
            <Link href="/privacy" className="hover:text-blue-400 transition-colors duration-200">
              Privacy Policy
            </Link>
          </div>
        </div>
        <div>
          <div className="font-semibold text-white mb-4 text-lg">Get the Weekly Trajectory Brief</div>
          <p className="text-gray-300 leading-relaxed">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-700 text-sm text-gray-400 flex flex-col md:flex-row items-center justify-between gap-4">
        <span>© 2025 Trajectory</span>
        <span className="font-semibold text-orange-400">Raise your floor</span>
      </div>
    </footer>
  );
}
