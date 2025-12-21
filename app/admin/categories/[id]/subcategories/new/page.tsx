'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function NewSubcategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = parseInt(params.id as string, 10);
  const [loading, setLoading] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [category, setCategory] = useState<{ id: number; name: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    orderIndex: 0,
    active: true,
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/categories/${categoryId}`);
        const data = await response.json();
        if (data.success && data.category) {
          setCategory({ id: data.category.id, name: data.category.name });
        }
      } catch (error) {
        console.error('Failed to fetch category:', error);
        alert('Failed to load category');
      } finally {
        setLoadingCategory(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: formData.slug || generateSlug(name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/subcategories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          categoryId: categoryId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin/categories');
      } else {
        alert(data.error || 'Failed to create subcategory');
      }
    } catch (error) {
      console.error('Failed to create subcategory:', error);
      alert('Failed to create subcategory');
    } finally {
      setLoading(false);
    }
  };

  if (loadingCategory) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading category...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/categories"
          className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-500 mb-4 inline-block"
        >
          ← Back to Categories
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
          New Subcategory {category && `for ${category.name}`}
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
              Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g., AI & ML"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Slug *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g., ai-ml"
            />
            <p className="text-xs text-gray-500 mt-1">URL-friendly version of the name</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Optional description for this subcategory"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Order Index
            </label>
            <input
              type="number"
              value={formData.orderIndex}
              onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-xs text-gray-500 mt-1">Lower numbers appear first in the dropdown</p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 text-emerald-600 dark:text-emerald-400 border-gray-300 dark:border-gray-600 rounded focus:ring-emerald-500"
            />
            <label htmlFor="active" className="ml-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              Active (show in dropdown)
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Subcategory'}
            </button>
            <Link
              href="/admin/categories"
              className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}










