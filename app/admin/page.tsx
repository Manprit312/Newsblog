import { getBlogs } from '@/lib/api';
import Link from 'next/link';

type Blog = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  published: boolean;
  featured: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  author?: string;
  tags?: string[];
};

export default async function AdminDashboard() {
  const allBlogs = await getBlogs() as Blog[];
  const publishedBlogs = allBlogs.filter((blog: Blog) => blog.published);
  const draftBlogs = allBlogs.filter((blog: Blog) => !blog.published);
  const featuredBlogs = allBlogs.filter((blog: Blog) => blog.featured);

  const stats = [
    {
      title: 'Total Blogs',
      count: allBlogs.length,
      color: 'bg-secondary-blue',
      icon: '📝',
    },
    {
      title: 'Published',
      count: publishedBlogs.length,
      color: 'bg-green-500',
      icon: '✅',
    },
    {
      title: 'Drafts',
      count: draftBlogs.length,
      color: 'bg-yellow-500',
      icon: '📄',
    },
    {
      title: 'Featured',
      count: featuredBlogs.length,
      color: 'bg-primary-yellow',
      icon: '⭐',
    },
  ];

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
          Overview
        </p>
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Admin dashboard
        </h1>
        <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          Monitor your published, draft, and featured stories at a glance, and jump straight into creating or managing content.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {stat.title}
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-50">
                  {stat.count}
                </p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
            <div className="pointer-events-none absolute inset-x-4 bottom-2 h-6 rounded-full bg-gradient-to-r from-secondary-blue/10 via-primary-yellow/10 to-secondary-blue/10 dark:from-secondary-blue/20 dark:via-primary-yellow/20 dark:to-secondary-blue/20" />
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-6 dark:border-slate-700 dark:bg-slate-900/60">
        <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-slate-50">
          Quick actions
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Start a new story or open the blogs table to edit, publish, or feature existing posts.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center gap-2 rounded-full bg-secondary-blue px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-secondary-blue-dark"
          >
            Create new blog
          </Link>
          <Link
            href="/admin/blogs"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-slate-50 dark:bg-slate-950 dark:text-slate-100 dark:ring-slate-700 dark:hover:bg-slate-900"
          >
            Manage all blogs
          </Link>
        </div>
      </section>
    </div>
  );
}







