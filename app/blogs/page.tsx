import { getBlogs } from '@/lib/api';
import BlogCard from '@/components/BlogCard';

interface BlogsPageProps {
  searchParams: { category?: string; subcategory?: string; search?: string };
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const category = searchParams.category;
  const subcategory = searchParams.subcategory;
  const search = searchParams.search;

  let blogs = await getBlogs({ published: true });

  // Filter by category if provided
  if (category) {
    blogs = blogs.filter((blog) => blog.category === category);
  }

  // Filter by subcategory if provided (check in tags)
  if (subcategory) {
    blogs = blogs.filter((blog) => 
      blog.tags.some((tag: string) => tag.toLowerCase() === subcategory.toLowerCase())
    );
  }

  // Filter by search query if provided
  if (search) {
    const searchLower = search.toLowerCase();
    blogs = blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchLower) ||
        blog.excerpt.toLowerCase().includes(searchLower) ||
        blog.content.toLowerCase().includes(searchLower) ||
        blog.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))
    );
  }

  const pageTitle = subcategory 
    ? `${category} - ${subcategory}`
    : category || (search ? `Search: ${search}` : 'All Blogs');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-1 w-16 bg-primary-yellow"></div>
          <h1 className="text-4xl font-bold text-secondary-blue">{pageTitle}</h1>
          <div className="h-1 flex-1 bg-primary-yellow"></div>
        </div>
        <p className="text-gray-600 text-lg">
          {category
            ? `Discover all ${category} articles`
            : search
            ? `Search results for "${search}"`
            : 'Discover all our latest news and blog posts'}
        </p>
        {(category || search) && (
          <div className="mt-4">
            <a
              href="/blogs"
              className="text-secondary-blue hover:text-primary-yellow underline"
            >
              ← View All Blogs
            </a>
          </div>
        )}
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-xl mb-4">
            {search ? `No results found for "${search}"` : 'No blogs found.'}
          </p>
          <a
            href="/blogs"
            className="text-secondary-blue hover:text-primary-yellow underline"
          >
            View All Blogs
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}

