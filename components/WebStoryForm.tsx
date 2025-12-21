'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUpload from './ImageUpload';
import { Plus, X, Trash2 } from 'lucide-react';

interface WebStoryFormProps {
  initialData?: {
    _id?: string;
    id?: number;
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string;
    pages: Array<{
      title?: string;
      text?: string;
      image?: string;
    }>;
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

export default function WebStoryForm({ initialData }: WebStoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    coverImage: initialData?.coverImage || '',
    pages: initialData?.pages || [{ title: '', text: '', image: '' }],
    categoryId: initialData?.categoryId || null,
    subcategoryId: initialData?.subcategoryId || null,
    tags: initialData?.tags?.join(', ') || '',
    author: initialData?.author || 'Admin',
    published: initialData?.published || false,
    featured: initialData?.featured || false,
  });

  useEffect(() => {
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

  const addPage = () => {
    setFormData({
      ...formData,
      pages: [...formData.pages, { title: '', text: '', image: '' }],
    });
  };

  const removePage = (index: number) => {
    if (formData.pages.length > 1) {
      setFormData({
        ...formData,
        pages: formData.pages.filter((_, i) => i !== index),
      });
    }
  };

  const updatePage = (index: number, field: string, value: string) => {
    const updatedPages = [...formData.pages];
    updatedPages[index] = { ...updatedPages[index], [field]: value };
    setFormData({ ...formData, pages: updatedPages });
  };

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
        pages: formData.pages.filter(page => page.title || page.text || page.image),
        subcategoryId: formData.categoryId ? formData.subcategoryId : null,
      };

      const url = initialData?._id || initialData?.id
        ? `/api/web-stories/${initialData.id || initialData._id}`
        : '/api/web-stories';
      const method = initialData?._id || initialData?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/web-stories');
        router.refresh();
      } else {
        const errorMsg = data.error || 'Failed to save web story. Please try again.';
        alert('Error: ' + errorMsg);
        console.error('Web story save error:', data);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-secondary-blue mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-blue focus:border-transparent text-sm sm:text-base"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-secondary-blue mb-2">
            Slug *
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-blue focus:border-transparent text-sm sm:text-base"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-secondary-blue mb-2">
            Excerpt
          </label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-blue focus:border-transparent text-sm sm:text-base"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-secondary-blue mb-2">
            Cover Image *
          </label>
          <ImageUpload
            value={formData.coverImage}
            onChange={(url) => setFormData({ ...formData, coverImage: url })}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-secondary-blue">
              Header Category
            </label>
            <Link
              href="/admin/categories"
              className="text-xs text-secondary-blue hover:underline"
            >
              Manage
            </Link>
          </div>
          {loadingCategories ? (
            <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-sm">
              Loading...
            </div>
          ) : (
            <select
              value={formData.categoryId || ''}
              onChange={(e) => {
                const categoryId = e.target.value ? parseInt(e.target.value) : null;
                setFormData({ 
                  ...formData, 
                  categoryId,
                  subcategoryId: null
                });
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-blue focus:border-transparent text-sm sm:text-base"
            >
              <option value="">Select a Header Category (optional)</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-secondary-blue mb-2">
            Header drop-down Category
          </label>
          <select
            value={formData.subcategoryId || ''}
            onChange={(e) => {
              const subcategoryId = e.target.value ? parseInt(e.target.value) : null;
              setFormData({ ...formData, subcategoryId });
            }}
            disabled={!formData.categoryId || availableSubcategories.length === 0}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-blue focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            <option value="">Select a Header drop-down Category (optional)</option>
            {availableSubcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-secondary-blue mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="e.g., breaking, trending, featured"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-blue focus:border-transparent text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-secondary-blue mb-2">
            Author
          </label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-blue focus:border-transparent text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Story Pages */}
      <div className="md:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-semibold text-secondary-blue">
            Story Pages *
          </label>
          <button
            type="button"
            onClick={addPage}
            className="bg-secondary-blue text-white px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-secondary-blue-dark transition-colors flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Page</span>
          </button>
        </div>
        <div className="space-y-4">
          {formData.pages.map((page, index) => (
            <div key={index} className="border border-gray-300 rounded-lg p-4 sm:p-6 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-secondary-blue text-sm sm:text-base">
                  Page {index + 1}
                </h3>
                {formData.pages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePage(index)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Page Title
                  </label>
                  <input
                    type="text"
                    value={page.title || ''}
                    onChange={(e) => updatePage(index, 'title', e.target.value)}
                    placeholder="Page title (optional)"
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-blue focus:border-transparent text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Page Image
                  </label>
                  <ImageUpload
                    value={page.image || ''}
                    onChange={(url) => updatePage(index, 'image', url)}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Page Text/Content
                  </label>
                  <textarea
                    value={page.text || ''}
                    onChange={(e) => updatePage(index, 'text', e.target.value)}
                    rows={4}
                    placeholder="Page content (HTML supported)"
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-blue focus:border-transparent text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
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

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-secondary-blue text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-secondary-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {loading ? 'Saving...' : initialData?._id || initialData?.id ? 'Update Web Story' : 'Create Web Story'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/web-stories')}
          className="w-full sm:w-auto bg-gray-300 text-gray-700 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors text-sm sm:text-base"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}





