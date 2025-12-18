import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-secondary-blue mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="inline-block bg-secondary-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary-blue-dark transition-colors"
      >
        Go Back Home
      </Link>
    </div>
  );
}















