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

  const blogData = {
    _id: blog._id,
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    content: blog.content,
    featuredImage: blog.featuredImage,
    category: blog.category,
    tags: blog.tags,
    author: blog.author,
    published: blog.published,
    featured: blog.featured,
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-secondary-blue mb-6">Edit Blog</h1>
      <BlogForm initialData={blogData} />
    </div>
  );
}

