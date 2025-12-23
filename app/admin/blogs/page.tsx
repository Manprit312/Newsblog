import { getBlogs } from '@/lib/api';
import Link from 'next/link';
import { format } from 'date-fns';
import Image from 'next/image';

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

export default async function AdminBlogsPage() {
  const blogs = await getBlogs() as Blog[];

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">All Blogs</h1>
        <Link
          href="/admin/blogs/new"
          className="bg-[#1e3a8a] hover:bg-blue-700 dark:bg-[#1e3a8a] dark:hover:bg-blue-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base whitespace-nowrap"
        >
          + New Blog
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 sm:p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg sm:text-xl mb-4">No blogs found.</p>
          <Link
            href="/admin/blogs/new"
            className="inline-block bg-[#1e3a8a] hover:bg-blue-700 dark:bg-[#1e3a8a] dark:hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Create Your First Blog
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-250px)]">
            <table className="w-full min-w-[800px]">
            <thead className="bg-[#1e3a8a] dark:bg-blue-700 text-white sticky top-0 z-10">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Image</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Title</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Category</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Status</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Date</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Views</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {blogs.map((blog: Blog) => (
                <tr key={blog._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 sm:px-6 py-4">
                    {blog.featuredImage ? (
                      <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded overflow-hidden">
                        <Image
                          src={blog.featuredImage}
                          alt={blog.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 text-xs">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="font-semibold text-blue-600 dark:text-blue-400 text-sm sm:text-base">
                      {blog.title}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
                      {blog.excerpt}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs font-semibold">
                      {blog.category}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          blog.published
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                        }`}
                      >
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                      {blog.featured && (
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-xs font-semibold">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {blog.views}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link
                        href={`/admin/blogs/${blog._id}/edit`}
                        className="bg-[#1e3a8a] hover:bg-blue-700 dark:bg-[#1e3a8a] dark:hover:bg-blue-800 text-white px-3 py-1 rounded text-xs sm:text-sm font-semibold transition-colors text-center"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/blog/${blog.slug}`}
                        target="_blank"
                        className="bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white px-3 py-1 rounded text-xs sm:text-sm font-semibold transition-colors text-center"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}

