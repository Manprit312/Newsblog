'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  // Do not wrap the login route in AuthGuard to avoid redirect loops
  const isLoginPage = pathname === '/admin/login';

  const content = (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Top bar */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:bg-slate-900/80 dark:border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link
            href="/admin"
            className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
          >
            <span className="mr-1 rounded bg-secondary-blue px-2 py-1 text-xs font-bold uppercase tracking-widest text-white">
              Admin
            </span>
            <span className="font-display">NewsBlogs Console</span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-secondary-blue dark:text-slate-300 dark:hover:text-primary-yellow"
          >
            ← Back to site
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
        {/* Sidebar nav */}
        <nav className="sticky top-20 hidden w-56 flex-shrink-0 flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex">
          <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            Navigation
          </p>
          <Link
            href="/admin"
            className={`rounded-xl px-3 py-2 font-medium transition-colors ${
              isActive('/admin')
                ? 'bg-secondary-blue text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/blogs"
            className={`rounded-xl px-3 py-2 font-medium transition-colors ${
              isActive('/admin/blogs')
                ? 'bg-secondary-blue text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Manage blogs
          </Link>
          <Link
            href="/admin/blogs/new"
            className={`rounded-xl px-3 py-2 font-medium transition-colors ${
              isActive('/admin/blogs/new')
                ? 'bg-secondary-blue text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            New blog
          </Link>
        </nav>

        {/* Main content */}
        <main className="flex-1">
          <div className="mb-4 flex gap-2 md:hidden">
            <Link
              href="/admin"
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/admin')
                  ? 'bg-secondary-blue text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/blogs"
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/admin/blogs')
                  ? 'bg-secondary-blue text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Blogs
            </Link>
            <Link
              href="/admin/blogs/new"
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/admin/blogs/new')
                  ? 'bg-secondary-blue text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              New
            </Link>
          </div>

          <div className="space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );

  if (isLoginPage) {
    return content;
  }

  return <AuthGuard>{content}</AuthGuard>;
}






