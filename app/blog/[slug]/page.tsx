import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { getBlogBySlug, getBlogs } from '@/lib/api';
import BlogCard from '@/components/BlogCard';

export async function generateStaticParams() {
  const blogs = await getBlogs({ published: true });
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const blog = await getBlogBySlug(params.slug);

  if (!blog) {
    notFound();
  }

  const relatedBlogs = await getBlogs({
    published: true,
    category: blog.category,
    limit: 3,
  });

  const filteredRelated = relatedBlogs.filter(
    (b) => b.slug !== blog.slug
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-primary-yellow text-secondary-blue px-3 py-1 rounded-full text-sm font-semibold">
              {blog.category}
            </span>
            {blog.featured && (
              <span className="bg-secondary-blue text-white px-3 py-1 rounded-full text-sm font-semibold">
                Featured
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-blue mb-4">
            {blog.title}
          </h1>
          <div className="flex items-center gap-4 text-gray-600">
            <span>By {blog.author}</span>
            <span>•</span>
            <span>{format(new Date(blog.createdAt), 'MMMM dd, yyyy')}</span>
            <span>•</span>
            <span>{blog.views} views</span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={blog.featuredImage}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none mb-12 prose-headings:text-secondary-blue prose-a:text-secondary-blue prose-strong:text-secondary-blue prose-img:rounded-lg prose-img:shadow-lg"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-secondary-blue-light text-white px-3 py-1 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* Related Blogs */}
      {filteredRelated.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 w-16 bg-primary-yellow"></div>
            <h2 className="text-3xl font-bold text-secondary-blue">Related News</h2>
            <div className="h-1 flex-1 bg-primary-yellow"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredRelated.slice(0, 3).map((relatedBlog) => (
              <BlogCard key={relatedBlog._id} blog={relatedBlog} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

