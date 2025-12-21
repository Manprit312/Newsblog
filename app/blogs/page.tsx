import { getBlogs } from '@/lib/api';
import BlogCard from '@/components/BlogCard';

type Blog = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
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

interface BlogsPageProps {
  searchParams: { category?: string; subcategory?: string; search?: string };
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
 
  const category = searchParams.category;
  const subcategory = searchParams.subcategory;
  const search = searchParams.search;

  let blogs = await getBlogs({ published: true }) as Blog[];
 
  // Filter by category if provided
  if (category) {
    blogs = blogs.filter((blog: Blog) => blog.category === category);
  }

  // Filter by subcategory if provided (check in tags - case insensitive and partial match)
  if (subcategory) {
    const subcategoryLower = subcategory.toLowerCase();
    blogs = blogs.filter((blog: Blog) => {
      if (!blog.tags || blog.tags.length === 0) return false;
      return blog.tags.some((tag: string) => {
        const tagLower = tag.toLowerCase();
        // Exact match or contains the subcategory
        return tagLower === subcategoryLower || tagLower.includes(subcategoryLower) || subcategoryLower.includes(tagLower);
      });
    });
  }

  // Filter by search query if provided
  if (search) {
    const searchLower = search.toLowerCase();
    blogs = blogs.filter(
      (blog: Blog) =>
        blog.title.toLowerCase().includes(searchLower) ||
        blog.excerpt.toLowerCase().includes(searchLower) ||
        blog.content.toLowerCase().includes(searchLower) ||
        blog.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower))
    );
  }

  const pageTitle = subcategory 
    ? `${category} - ${subcategory}`
    : category || (search ? `Search: ${search}` : 'All Blogs');

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-1 w-16 bg-primary-yellow"></div>
          <h1 className="text-4xl font-bold text-secondary-blue">{pageTitle}</h1>
          <div className="h-1 flex-1 bg-primary-yellow"></div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
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
          <p className="text-gray-500 dark:text-gray-400 text-xl mb-2">
            {search 
              ? `No results found for "${search}"`
              : subcategory
              ? `No blogs found for ${category ? category + ' - ' : ''}${subcategory}.`
              : category
              ? `No blogs found in ${category} category.`
              : 'No blogs found.'}
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">
            {subcategory && 'Try selecting a different subcategory or browse all blogs.'}
          </p>
          <a
            href={category ? `/blogs?category=${encodeURIComponent(category)}` : '/blogs'}
            className="text-secondary-blue hover:text-primary-yellow underline mr-4"
          >
            {category ? `View All ${category} Blogs` : 'View All Blogs'}
          </a>
          {category && (
            <a
              href="/blogs"
              className="text-secondary-blue hover:text-primary-yellow underline"
            >
              View All Categories
            </a>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog: Blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}

