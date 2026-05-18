import { useLocation } from "react-router";

export default function NotFoundPage() {
  const pathname = useLocation().pathname;

  if (
    pathname.startsWith("/wp") ||
    pathname.startsWith("/wordpress") ||
    pathname.startsWith("/backup") ||
    pathname.startsWith("/new")
  ) {
    return new Response(null, { status: 404 });
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
      <p className="text-xl text-gray-400 mb-8">Page not found</p>
      <a href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Go Home
      </a>
    </div>
  );
}
