import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { getBlogBySlug, getBlogs } from '@/lib/api';
import BlogCard from '@/components/BlogCard';
import ViewIncrementer from '@/components/ViewIncrementer';

// Function to process HTML content and add target="_blank" to external links
function processBlogContent(content: string): string {
  // Use regex to find all anchor tags and process them
  return content.replace(/<a\s+([^>]*?)href=["']([^"']*?)["']([^>]*?)>/gi, (match, beforeHref, href, afterHref) => {
    // Check if it's an external link
    // External links: start with http://, https://, www., or mailto:
    // Not external: start with /, #, or are empty
    const isExternal = /^(https?:\/\/|www\.|mailto:)/i.test(href) || 
                       (href && !href.startsWith('/') && !href.startsWith('#') && !href.startsWith('?'));
    
    if (isExternal) {
      let processedHref = href;
      
      // If link starts with www. but doesn't have protocol, add https://
      if (/^www\./i.test(href)) {
        processedHref = 'https://' + href;
      }
      
      // Check if target="_blank" already exists
      const hasTarget = /target\s*=\s*["']_blank["']/i.test(match);
      // Check if rel already exists
      const hasRel = /rel\s*=/i.test(match);
      
      // Reconstruct the anchor tag with updated href
      let processedMatch = match;
      
      // Update href if it was modified (www. -> https://www.)
      if (processedHref !== href) {
        processedMatch = processedMatch.replace(
          /href=["']([^"']*?)["']/i,
          `href="${processedHref}"`
        );
      }
      
      // Add target="_blank" if not present
      if (!hasTarget) {
        processedMatch = processedMatch.replace(/>$/, ' target="_blank">');
      }
      
      // Add rel="noopener noreferrer" if not present
      if (!hasRel) {
        processedMatch = processedMatch.replace(/>$/, ' rel="noopener noreferrer">');
      }
      
      return processedMatch;
    }
    
    return match;
  });
}

type Blog = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  photos?: string[];
  category: string;
  published: boolean;
  featured: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  author?: string;
  tags?: string[];
};

// Force dynamic rendering to show fresh content immediately (no caching)
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0; // Disable caching completely

export async function generateStaticParams() {
  try {
    // Limit to first 100 blogs to avoid timeout during build
    // For larger sites, consider using ISR or dynamic rendering
    const blogs = await getBlogs({ published: true, limit: 100 }) as Blog[];
    return blogs.map((blog: Blog) => ({
      slug: blog.slug,
    }));
  } catch (error: any) {
    // Handle database connection timeouts and connection errors gracefully
    // Return empty array to allow dynamic rendering for pages
    const isConnectionError = 
      error.code === 'ETIMEDOUT' || 
      error.message?.includes('timeout') ||
      error.message?.includes('Connection terminated') ||
      error.cause?.message?.includes('Connection terminated') ||
      error.code === 'ECONNREFUSED' ||
      error.code === 'ENOTFOUND';
    
    if (isConnectionError) {
      console.warn('Database connection issue during static generation. Pages will be rendered dynamically.');
      return [];
    }
    console.error('Error generating static params:', error);
    // Return empty array to allow dynamic rendering for other pages
    return [];
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // Don't increment views during static generation
  const blog = await getBlogBySlug(params.slug, false);

  if (!blog) {
    notFound();
  }

  const relatedBlogs = await getBlogs({
    published: true,
    category: blog.category || undefined,
    limit: 3,
  }) as Blog[];

  const filteredRelated = relatedBlogs.filter(
    (b: Blog) => b.slug !== blog.slug
  );

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 min-h-screen">
      <ViewIncrementer slug={params.slug} />
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-yellow-600 text-secondary-blue px-3 py-1 rounded-full text-sm font-semibold">
              {blog.category}
            </span>
            {blog.featured && (
              <span className="bg-secondary-blue text-white px-3 py-1 rounded-full text-sm font-semibold">
                Featured
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-blue dark:text-blue-400 mb-4">
            {blog.title}
          </h1>
          <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
            <span>By {blog.author}</span>
            <span>•</span>
            <span>{format(new Date(blog.createdAt), 'MMMM dd, yyyy')}</span>
            <span>•</span>
            <span>{blog.views} views</span>
          </div>
        </div>

        {/* Featured Image */}
        {blog.featuredImage && blog.featuredImage.trim() !== '' && (
          <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden shadow-lg bg-gray-200 dark:bg-gray-700">
            <Image
              src={blog.featuredImage}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none mb-12 prose-headings:text-secondary-blue dark:prose-headings:text-blue-400 prose-a:text-secondary-blue dark:prose-a:text-blue-400 prose-strong:text-secondary-blue dark:prose-strong:text-blue-400 prose-img:rounded-lg prose-img:shadow-lg prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-li:text-gray-700 dark:prose-li:text-gray-300"
          dangerouslySetInnerHTML={{ __html: processBlogContent(blog.content) }}
        />

        {/* Additional Photos Gallery */}
        {blog.photos && blog.photos.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-16 bg-yellow-600"></div>
              <h2 className="text-2xl font-bold text-secondary-blue dark:text-blue-400">Photo Gallery</h2>
              <div className="h-1 flex-1 bg-yellow-600"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {blog.photos
                .filter((photo: string) => photo && photo.trim() !== '')
                .map((photo: string, index: number) => (
                  <div key={index} className="relative h-64 w-full rounded-lg overflow-hidden shadow-lg bg-gray-200 dark:bg-gray-700">
                    <Image
                      src={photo}
                      alt={`${blog.title} - Photo ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12">
            {blog.tags.map((tag: string, index: number) => (
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
            <div className="h-1 w-16 bg-yellow-600"></div>
            <h2 className="text-3xl font-bold text-secondary-blue dark:text-blue-400">Related News</h2>
            <div className="h-1 flex-1 bg-yellow-600"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredRelated.slice(0, 3).map((relatedBlog: Blog) => (
              <BlogCard key={relatedBlog._id} blog={relatedBlog} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

