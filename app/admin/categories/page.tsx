'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  orderIndex: number;
  active: boolean;
  subcategories: Array<{
    id: number;
    name: string;
    slug: string;
    description: string | null;
    orderIndex: number;
    active: boolean;
  }>;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, isSubcategory: boolean = false) => {
    if (!confirm(`Are you sure you want to delete this ${isSubcategory ? 'Header drop-down Category' : 'Header Category'}?`)) {
      return;
    }

    setDeleting(id);
    try {
      const endpoint = isSubcategory ? `/api/subcategories/${id}` : `/api/categories/${id}`;
      const response = await fetch(endpoint, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCategories();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete');
      }
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  const toggleExpand = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading categories...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-secondary-blue">Header Categories</h1>
        <Link
          href="/admin/categories/new"
          className="bg-secondary-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary-blue-dark transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Category
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-xl mb-4">No categories found.</p>
          <Link
            href="/admin/categories/new"
            className="inline-block bg-secondary-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary-blue-dark transition-colors"
          >
            Create Your First Category
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {categories.map((category) => (
              <div key={category.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleExpand(category.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {expandedCategories.has(category.id) ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="font-semibold text-lg text-secondary-blue">
                        {category.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Slug: {category.slug} | Order: {category.orderIndex} | 
                        {category.active ? (
                          <span className="text-green-600 ml-2">Active</span>
                        ) : (
                          <span className="text-gray-400 ml-2">Inactive</span>
                        )}
                      </div>
                      {category.description && (
                        <div className="text-sm text-gray-600 mt-1">{category.description}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/categories/${category.id}/edit`}
                      className="bg-primary-yellow text-secondary-blue px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>
                    <Link
                      href={`/admin/categories/${category.id}/subcategories/new`}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Header drop-down Category
                    </Link>
                    <button
                      onClick={() => handleDelete(category.id, false)}
                      disabled={deleting === category.id}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>

                {expandedCategories.has(category.id) && category.subcategories.length > 0 && (
                  <div className="mt-4 ml-8 border-l-2 border-gray-200 pl-4 space-y-3">
                    {category.subcategories.map((subcategory) => (
                      <div
                        key={subcategory.id}
                        className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="font-semibold text-secondary-blue">
                            {subcategory.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Slug: {subcategory.slug} | Order: {subcategory.orderIndex} |
                            {subcategory.active ? (
                              <span className="text-green-600 ml-2">Active</span>
                            ) : (
                              <span className="text-gray-400 ml-2">Inactive</span>
                            )}
                          </div>
                          {subcategory.description && (
                            <div className="text-sm text-gray-600 mt-1">{subcategory.description}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/subcategories/${subcategory.id}/edit`}
                            className="bg-primary-yellow text-secondary-blue px-3 py-1.5 rounded font-semibold hover:bg-yellow-500 transition-colors flex items-center gap-1 text-sm"
                          >
                            <Edit className="w-3 h-3" />
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(subcategory.id, true)}
                            disabled={deleting === subcategory.id}
                            className="bg-red-600 text-white px-3 py-1.5 rounded font-semibold hover:bg-red-700 transition-colors flex items-center gap-1 text-sm disabled:opacity-50"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}






