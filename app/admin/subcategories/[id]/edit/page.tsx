'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditSubcategoryPage() {
  const router = useRouter();
  const params = useParams();
  const subcategoryId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    orderIndex: 0,
    active: true,
    categoryId: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch subcategory
        const subResponse = await fetch(`/api/subcategories/${subcategoryId}`);
        const subData = await subResponse.json();
        
        // Fetch all categories
        const catResponse = await fetch('/api/categories');
        const catData = await catResponse.json();

        if (subData.success && subData.subcategory) {
          setFormData({
            name: subData.subcategory.name,
            slug: subData.subcategory.slug,
            description: subData.subcategory.description || '',
            orderIndex: subData.subcategory.orderIndex,
            active: subData.subcategory.active,
            categoryId: subData.subcategory.categoryId,
          });
        }

        if (catData.success && catData.categories) {
          setCategories(catData.categories);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        alert('Failed to load subcategory');
      } finally {
        setLoadingData(false);
      }
    };

    if (subcategoryId) {
      fetchData();
    }
  }, [subcategoryId]);

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
      const response = await fetch(`/api/subcategories/${subcategoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin/categories');
      } else {
        alert(data.error || 'Failed to update subcategory');
      }
    } catch (error) {
      console.error('Failed to update subcategory:', error);
      alert('Failed to update subcategory');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading subcategory...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/categories"
          className="text-secondary-blue hover:text-secondary-blue-dark mb-4 inline-block"
        >
          ← Back to Categories
        </Link>
        <h1 className="text-3xl font-bold text-secondary-blue">Edit Subcategory</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-blue"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-blue"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-blue"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-blue"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-blue"
            />
            <p className="text-xs text-gray-500 mt-1">Lower numbers appear first in the dropdown</p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 text-secondary-blue border-gray-300 rounded focus:ring-secondary-blue"
            />
            <label htmlFor="active" className="ml-2 text-sm font-semibold text-gray-700">
              Active (show in dropdown)
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-secondary-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary-blue-dark transition-colors disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Subcategory'}
            </button>
            <Link
              href="/admin/categories"
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}










