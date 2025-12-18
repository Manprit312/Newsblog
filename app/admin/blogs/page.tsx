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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-secondary-blue">All Blogs</h1>
        <Link
          href="/admin/blogs/new"
          className="bg-secondary-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary-blue-dark transition-colors"
        >
          + New Blog
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-xl mb-4">No blogs found.</p>
          <Link
            href="/admin/blogs/new"
            className="inline-block bg-secondary-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary-blue-dark transition-colors"
          >
            Create Your First Blog
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary-blue text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Image</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Views</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {blogs.map((blog: Blog) => (
                <tr key={blog._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {blog.featuredImage ? (
                      <div className="relative w-16 h-16 rounded overflow-hidden">
                        <Image
                          src={blog.featuredImage}
                          alt={blog.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-secondary-blue">
                      {blog.title}
                    </div>
                    <div className="text-sm text-gray-500 line-clamp-1">
                      {blog.excerpt}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-primary-yellow text-secondary-blue px-2 py-1 rounded text-xs font-semibold">
                      {blog.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          blog.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                      {blog.featured && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {blog.views}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/blogs/${blog._id}/edit`}
                        className="bg-primary-yellow text-secondary-blue px-3 py-1 rounded text-sm font-semibold hover:bg-primary-yellow-dark transition-colors"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/blog/${blog.slug}`}
                        target="_blank"
                        className="bg-secondary-blue-light text-white px-3 py-1 rounded text-sm font-semibold hover:bg-secondary-blue transition-colors"
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
      )}
    </div>
  );
}

