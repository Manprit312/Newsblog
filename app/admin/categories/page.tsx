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
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">Header Categories</h1>
        <Link
          href="/admin/categories/new"
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>New Category</span>
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 sm:p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg sm:text-xl mb-4">No categories found.</p>
          <Link
            href="/admin/categories/new"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Create Your First Category
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {categories.map((category) => (
              <div key={category.id} className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => toggleExpand(category.id)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex-shrink-0 mt-1 sm:mt-0"
                    >
                      {expandedCategories.has(category.id) ? (
                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-base sm:text-lg text-emerald-600 dark:text-emerald-400">
                        {category.name}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <span className="break-all">Slug: {category.slug}</span> | Order: {category.orderIndex} | 
                        {category.active ? (
                          <span className="text-green-600 dark:text-green-400 ml-2">Active</span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500 ml-2">Inactive</span>
                        )}
                      </div>
                      {category.description && (
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">{category.description}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <Link
                      href={`/admin/categories/${category.id}/edit`}
                      className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold transition-colors flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                    >
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Edit</span>
                    </Link>
                    <Link
                      href={`/admin/categories/${category.id}/subcategories/new`}
                      className="bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-400 dark:hover:bg-emerald-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold transition-colors flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Add Header drop-down Category</span>
                      <span className="sm:hidden">Add Sub</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(category.id, false)}
                      disabled={deleting === category.id}
                      className="bg-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-1.5 sm:gap-2 disabled:opacity-50 text-xs sm:text-sm"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {expandedCategories.has(category.id) && category.subcategories.length > 0 && (
                  <div className="mt-4 ml-4 sm:ml-8 border-l-2 border-gray-200 dark:border-gray-700 pl-3 sm:pl-4 space-y-3">
                    {category.subcategories.map((subcategory) => (
                      <div
                        key={subcategory.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2 bg-gray-50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm sm:text-base">
                            {subcategory.name}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <span className="break-all">Slug: {subcategory.slug}</span> | Order: {subcategory.orderIndex} |
                            {subcategory.active ? (
                              <span className="text-green-600 dark:text-green-400 ml-2">Active</span>
                            ) : (
                              <span className="text-gray-400 dark:text-gray-500 ml-2">Inactive</span>
                            )}
                          </div>
                          {subcategory.description && (
                            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">{subcategory.description}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Link
                            href={`/admin/subcategories/${subcategory.id}/edit`}
                            className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-3 py-1.5 rounded font-semibold transition-colors flex items-center justify-center gap-1 text-xs sm:text-sm"
                          >
                            <Edit className="w-3 h-3" />
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(subcategory.id, true)}
                            disabled={deleting === subcategory.id}
                            className="flex-1 sm:flex-initial bg-red-600 text-white px-3 py-1.5 rounded font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-1 text-xs sm:text-sm disabled:opacity-50"
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






