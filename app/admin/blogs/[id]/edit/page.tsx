import { notFound } from 'next/navigation';
import { getBlogById } from '@/lib/api';
import BlogForm from '@/components/BlogForm';

export default async function EditBlogPage({
  params,
}: {
  params: { id: string };
}) {
  const blog = await getBlogById(params.id);

  if (!blog) {
    notFound();
  }

  const blogData: {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    photos?: string[];
    category?: string | null;
    categoryId?: number | null;
    subcategoryId?: number | null;
    tags: string[];
    author: string;
    published: boolean;
    featured: boolean;
  } = {
    _id: String(blog._id || blog.id || ''),
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    content: blog.content,
    featuredImage: blog.featuredImage,
    photos: (blog as any).photos || [],
    category: blog.category || null,
    categoryId: (blog as any).categoryId || null,
    subcategoryId: (blog as any).subcategoryId || null,
    tags: blog.tags || [],
    author: blog.author || 'Admin',
    published: blog.published,
    featured: blog.featured,
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4 sm:mb-6">Edit Blog</h1>
      <BlogForm initialData={blogData} />
    </div>
  );
}

