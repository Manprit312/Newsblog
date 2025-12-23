'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import Link from 'next/link';

export default function BlogDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/blogs/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBlog(data.blog);
        }
        setLoading(false);
      });
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/blogs/${params.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/blogs');
        router.refresh();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Blog not found.</p>
        <Link
          href="/admin/blogs"
          className="text-secondary-blue hover:underline mt-4 inline-block"
        >
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-secondary-blue">Blog Details</h1>
        <div className="flex gap-2">
          <Link
            href={`/admin/blogs/${params.id}/edit`}
            className="bg-yellow-600 text-secondary-blue px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600-dark transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="relative h-96 w-full mb-6 rounded-lg overflow-hidden">
          <Image
            src={blog.featuredImage}
            alt={blog.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-secondary-blue mb-2">{blog.title}</h2>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-yellow-600 text-secondary-blue px-3 py-1 rounded-full text-sm font-semibold">
                {blog.category}
              </span>
              {blog.featured && (
                <span className="bg-secondary-blue text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Featured
                </span>
              )}
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  blog.published
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {blog.published ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>

          <div>
            <p className="text-gray-600 text-lg">{blog.excerpt}</p>
          </div>

          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Additional Photos Gallery */}
          {blog.photos && blog.photos.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-bold text-secondary-blue mb-4">Additional Photos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {blog.photos.map((photo: string, index: number) => (
                  <div key={index} className="relative h-48 w-full rounded-lg overflow-hidden border-2 border-gray-300">
                    <Image
                      src={photo}
                      alt={`${blog.title} - Photo ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
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

          <div className="border-t pt-4 mt-4">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-semibold">Author:</span> {blog.author}
              </div>
              <div>
                <span className="font-semibold">Views:</span> {blog.views}
              </div>
              <div>
                <span className="font-semibold">Created:</span>{' '}
                {format(new Date(blog.createdAt), 'MMMM dd, yyyy')}
              </div>
              <div>
                <span className="font-semibold">Updated:</span>{' '}
                {format(new Date(blog.updatedAt), 'MMMM dd, yyyy')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}















