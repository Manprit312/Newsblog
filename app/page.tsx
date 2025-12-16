import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import BlogCard from '@/components/BlogCard';
import { getBlogs } from '@/lib/api';
import { Clock, Eye, TrendingUp, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';

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

export default async function Home() {
  // Fetch all published blogs
  const allBlogs = await getBlogs({ published: true }) as Blog[];

  // Get featured blog for hero section
  const featuredBlog = allBlogs.find((blog: Blog) => blog.featured) || allBlogs[0];

  // Get trending blogs (by views, top 5)
  const trendingBlogs = [...allBlogs]
    .sort((a: Blog, b: Blog) => b.views - a.views)
    .slice(0, 5);

  // Get latest blogs (excluding featured)
  const latestBlogs = allBlogs
    .filter((blog: Blog) => blog.slug !== featuredBlog?.slug)
    .slice(0, 6);

  // Group blogs by main categories
  const categoryBlogs = {
    India: allBlogs.filter((blog: Blog) => blog.category === 'India').slice(0, 4),
    World: allBlogs.filter((blog: Blog) => blog.category === 'World').slice(0, 4),
    Sports: allBlogs.filter((blog: Blog) => blog.category === 'Sports').slice(0, 4),
    Entertainment: allBlogs.filter((blog: Blog) => blog.category === 'Entertainment').slice(0, 4),
    Technology: allBlogs.filter((blog: Blog) => blog.category === 'Technology').slice(0, 4),
    Business: allBlogs.filter((blog: Blog) => blog.category === 'Business').slice(0, 4),
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Trending Section */}
        {trendingBlogs.length > 0 && (
          <div className="mb-6 flex flex-col items-stretch gap-4 border-b border-gray-200 bg-white py-3 md:flex-row md:items-center">
            <div className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2">
              <TrendingUp className="w-4 h-4" />
              <span className="font-bold text-sm uppercase">TRENDING</span>
                      </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                <Link href={`/blog/${trendingBlogs[0].slug}`} className="group flex items-center gap-4">
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-yellow-600 transition-colors line-clamp-1">
                    {trendingBlogs[0].title}
                            </h3>
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {format(new Date(trendingBlogs[0].createdAt), 'MMM dd, yyyy')}
                  </span>
                      </Link>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured News Section */}
            {latestBlogs.length > 0 && (
              <section className="bg-white">
                <div className="mb-6 pb-3 border-b-2 border-yellow-600">
                  <h2 className="text-2xl font-bold text-yellow-600 uppercase">FEATURED NEWS</h2>
                </div>
                <div className="space-y-6">
                  {latestBlogs.slice(0, 4).map((blog: Blog) => (
                    <Link key={blog._id} href={`/blog/${blog.slug}`} className="block group">
                      <article className="flex gap-4 pb-6 border-b border-gray-200 last:border-0">
                        <div className="relative h-32 w-full flex-shrink-0 overflow-hidden sm:w-32">
                          <Image
                            src={blog.featuredImage}
                            alt={blog.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="mb-2">
                            <span className="bg-black text-white px-2 py-1 text-xs font-bold uppercase">
                              {blog.category}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors line-clamp-2">
                            {blog.title}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                            <span>by News Line</span>
                            <span className="uppercase">{format(new Date(blog.createdAt), 'MMM dd, yyyy').toUpperCase()}</span>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              <span>0</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span>{blog.views}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{blog.excerpt}</p>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Category Sections - Grid Layout */}
            {Object.entries(categoryBlogs).map(([category, blogs]) => {
              if (blogs.length === 0) return null;
              return (
                <section key={category} className="bg-white">
                  <div className="mb-6 pb-3 border-b-2 border-yellow-600">
                    <h2 className="text-2xl font-bold text-yellow-600 uppercase">{category} NEWS</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {blogs.map((blog: Blog) => (
                      <BlogCard key={blog._id} blog={blog} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Sidebar with Tabs */}
            <div className="bg-white border border-gray-200">
              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                <button className="flex-1 px-4 py-3 text-sm font-bold text-gray-900 border-b-2 border-yellow-600">
                  Trending
                </button>
                <button className="flex-1 px-4 py-3 text-sm font-bold text-gray-500 hover:text-gray-900">
                  Comments
                </button>
                <button className="flex-1 px-4 py-3 text-sm font-bold text-gray-500 hover:text-gray-900">
                  Latest
                </button>
                </div>

              {/* Tab Content */}
              <div className="p-4 space-y-4">
                {trendingBlogs.slice(0, 5).map((blog, index) => (
                    <Link
                      key={blog._id}
                      href={`/blog/${blog.slug}`}
                      className="block group"
                    >
                      <div className="flex gap-3">
                      <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden">
                          <Image
                            src={blog.featuredImage}
                            alt={blog.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                          <span className="text-yellow-600 font-bold text-lg">{index + 1}</span>
                          <h3 className="text-sm font-bold text-gray-900 group-hover:text-yellow-600 transition-colors line-clamp-2">
                            {blog.title}
                          </h3>
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">0 SHARES</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Popular Stories with Numbers */}
            {trendingBlogs.length > 0 && (
              <div className="bg-white border border-gray-200 p-6">
                <div className="mb-6 pb-3 border-b-2 border-yellow-600">
                  <h2 className="text-xl font-bold text-yellow-600 uppercase">POPULAR STORIES</h2>
                </div>
                <div className="space-y-4">
                  {trendingBlogs.slice(0, 5).map((blog, index) => (
                    <Link
                      key={blog._id}
                      href={`/blog/${blog.slug}`}
                      className="block group"
                    >
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-xl font-bold text-yellow-600">{index + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-gray-900 group-hover:text-yellow-600 transition-colors line-clamp-2 mb-1">
                            {blog.title}
                          </h3>
                          <div className="text-xs text-gray-400">0 SHARES</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Empty State */}
        {allBlogs.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-xl mb-4">No blogs found.</p>
            <Link
              href="/admin/blogs/new"
              className="inline-block bg-secondary-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary-blue-dark transition-colors"
            >
              Create Your First Blog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
