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
    category?: string | null;
    subcategory?: string | null;
    categoryId?: number | null;
    subcategoryId?: number | null;
    tags: string[];
    author: string;
    published: boolean;
    featured: boolean;
  };
}

interface Category {
  id: number;
  name: string;
  slug: string;
  subcategories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

export default function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    featuredImage: initialData?.featuredImage || '',
    categoryId: initialData?.categoryId || null,
    subcategoryId: initialData?.subcategoryId || null,
    tags: initialData?.tags?.join(', ') || '',
    author: initialData?.author || 'Admin',
    published: initialData?.published || false,
    featured: initialData?.featured || false,
  });

  useEffect(() => {
    // Fetch categories and subcategories
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories?active=true');
        const data = await response.json();
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (formData.title && !initialData?.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title, initialData?.slug]);

  const selectedCategory = categories.find(cat => cat.id === formData.categoryId);
  const availableSubcategories = selectedCategory?.subcategories || [];

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
        // Clear subcategory if category is changed
        subcategoryId: formData.categoryId ? formData.subcategoryId : null,
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
            Category
          </label>
          {loadingCategories ? (
            <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100">
              Loading categories...
            </div>
          ) : (
            <select
              value={formData.categoryId || ''}
              onChange={(e) => {
                const categoryId = e.target.value ? parseInt(e.target.value) : null;
                setFormData({ 
                  ...formData, 
                  categoryId,
                  subcategoryId: null // Reset subcategory when category changes
                });
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-blue focus:border-transparent"
            >
              <option value="">Select a category (optional)</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Categories appear in the website header navigation
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-secondary-blue mb-2">
            Subcategory
          </label>
          <select
            value={formData.subcategoryId || ''}
            onChange={(e) => {
              const subcategoryId = e.target.value ? parseInt(e.target.value) : null;
              setFormData({ ...formData, subcategoryId });
            }}
            disabled={!formData.categoryId || availableSubcategories.length === 0}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-blue focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select a subcategory (optional)</option>
            {availableSubcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Subcategories appear as dropdown items in the header
          </p>
          {formData.categoryId && availableSubcategories.length === 0 && (
            <p className="text-xs text-yellow-600 mt-1">
              No subcategories available for this category. Add them in Categories management.
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div>
          <label className="block text-sm font-semibold text-secondary-blue mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="e.g., breaking, trending, featured"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-blue focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Additional tags for filtering and search
          </p>
        </div>
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
