'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ImageUpload from './ImageUpload';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface BlogFormProps {
  initialData?: {
    _id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    category: string;
    tags: string[];
    author: string;
    published: boolean;
    featured: boolean;
  };
}

export default function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    featuredImage: initialData?.featuredImage || '',
    category: initialData?.category || 'General',
    tags: initialData?.tags?.join(', ') || '',
    author: initialData?.author || 'Admin',
    published: initialData?.published || false,
    featured: initialData?.featured || false,
  });

  useEffect(() => {
    if (formData.title && !initialData?.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title, initialData?.slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const payload = {
        ...formData,
        tags: tagsArray,
      };

      const url = initialData?._id
        ? `/api/blogs/${initialData._id}`
        : '/api/blogs';
      const method = initialData?._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
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
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div>
        <label className="block text-sm font-semibold text-secondary-blue mb-2">
          Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-blue focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-secondary-blue mb-2">
          Slug *
        </label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-blue focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-secondary-blue mb-2">
          Excerpt *
        </label>
        <textarea
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          required
          maxLength={200}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-blue focus:border-transparent"
        />
        <p className="text-sm text-gray-500 mt-1">
          {formData.excerpt.length}/200 characters
        </p>
      </div>

      <ImageUpload
        value={formData.featuredImage}
        onChange={(url) => setFormData({ ...formData, featuredImage: url })}
      />

      <div>
        <label className="block text-sm font-semibold text-secondary-blue mb-2">
          Content *
        </label>
        <ReactQuill
          theme="snow"
          value={formData.content}
          onChange={(value) => setFormData({ ...formData, content: value })}
          className="bg-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-secondary-blue mb-2">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-blue focus:border-transparent"
          >
            <option value="India">India</option>
            <option value="World">World</option>
            <option value="Sports">Sports</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Technology">Technology</option>
            <option value="Business">Business</option>
            <option value="Top News">Top News</option>
            <option value="Latest News">Latest News</option>
            <option value="Trending News">Trending News</option>
            <option value="Today News">Today News</option>
            <option value="General">General</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-secondary-blue mb-2">
            Author
          </label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-blue focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-secondary-blue mb-2">
          Subcategory / Tags (comma-separated)
        </label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="e.g., Politics, Cricket, Bollywood (use as subcategory or tags)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-blue focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          Add subcategory or tags separated by commas. Examples: Politics, Cricket, Bollywood, AI & ML
        </p>
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.published}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            className="w-5 h-5 text-secondary-blue focus:ring-secondary-blue"
          />
          <span className="text-sm font-semibold text-secondary-blue">Published</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-5 h-5 text-secondary-blue focus:ring-secondary-blue"
          />
          <span className="text-sm font-semibold text-secondary-blue">Featured</span>
        </label>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-secondary-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : initialData?._id ? 'Update Blog' : 'Create Blog'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/blogs')}
          className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

