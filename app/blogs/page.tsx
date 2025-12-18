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

  // Use API to filter by category/subcategory/search
  const blogs = await getBlogs({
    published: true,
    category: category || undefined,
    subcategory: subcategory || undefined,
    search: search || undefined,
  }) as Blog[];

  // Format page title
  const pageTitle = subcategory 
    ? `${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}`
    : category 
    ? `${category.charAt(0).toUpperCase() + category.slice(1)}`
    : search 
    ? `Search: ${search}`
    : 'All Blogs';

  // Format breadcrumb
  const breadcrumb = subcategory && category
    ? `${category} > ${subcategory}`
    : category
    ? category
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-1 w-16 bg-primary-yellow"></div>
          <h1 className="text-4xl font-bold text-secondary-blue">{pageTitle}</h1>
          <div className="h-1 flex-1 bg-primary-yellow"></div>
        </div>
        {breadcrumb && (
          <p className="text-gray-500 text-sm mb-2">
            {breadcrumb}
          </p>
        )}
        <p className="text-gray-600 text-lg">
          {subcategory
            ? `Discover all ${subcategory} articles${category ? ` in ${category}` : ''}`
            : category
            ? `Discover all ${category} articles`
            : search
            ? `Search results for "${search}"`
            : 'Discover all our latest news and blog posts'}
        </p>
        {(category || subcategory || search) && (
          <div className="mt-4 flex gap-4">
            {subcategory && category && (
              <a
                href={`/blogs?category=${encodeURIComponent(category)}`}
                className="text-secondary-blue hover:text-primary-yellow underline"
              >
                ← View All {category} Blogs
              </a>
            )}
            {(category || subcategory) && (
              <a
                href="/blogs"
                className="text-secondary-blue hover:text-primary-yellow underline"
              >
                ← View All Blogs
              </a>
            )}
          </div>
        )}
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-xl mb-2">
            {search 
              ? `No results found for "${search}"`
              : subcategory
              ? `No blogs found for ${category ? category + ' - ' : ''}${subcategory}.`
              : category
              ? `No blogs found in ${category} category.`
              : 'No blogs found.'}
          </p>
          <p className="text-gray-400 text-sm mb-4">
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

