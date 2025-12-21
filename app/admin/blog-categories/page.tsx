'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Plus } from 'lucide-react';

// Blog Categories (Editorial Categories - Level 3)
const BLOG_CATEGORIES = [
  'Trending News',
  'Breaking News',
  'Badi Khabre',
  'Rajya Khabre',
  'Desh Khabre',
  'Election Special',
  'Exclusive Report',
  'Ground Report',
  'Fact Check',
  'Explainers',
  'Analysis',
  'Opinion / Editorial',
  'Special Stories',
  'Viral News',
  'Good News',
];

interface BlogCategoryStats {
  category: string;
  count: number;
}

export default function BlogCategoriesPage() {
  const [stats, setStats] = useState<BlogCategoryStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState<string[]>(BLOG_CATEGORIES);

  useEffect(() => {
    fetchCategoryStats();
  }, []);

  const fetchCategoryStats = async () => {
    try {
      const response = await fetch('/api/blogs');
      const data = await response.json();
      
      if (data.success && data.blogs) {
        // Count blogs by category (stored in tags)
        const categoryCounts: Record<string, number> = {};
        
        categories.forEach((cat) => {
          categoryCounts[cat] = 0;
        });

        data.blogs.forEach((blog: any) => {
          if (blog.tags && Array.isArray(blog.tags)) {
            blog.tags.forEach((tag: string) => {
              if (categories.includes(tag)) {
                categoryCounts[tag] = (categoryCounts[tag] || 0) + 1;
              }
            });
          }
        });

        const statsArray: BlogCategoryStats[] = categories.map((cat) => ({
          category: cat,
          count: categoryCounts[cat] || 0,
        }));

        setStats(statsArray);
      }
    } catch (error) {
      console.error('Error fetching category stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
      // In a real app, you'd save this to a database or settings
      alert('Category added! (Note: This is a demo - save to database in production)');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading blog categories...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/blogs"
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-secondary-blue">
            Blog Categories
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage Blog Categories for NewsBlogs (Independent from Header Categories)
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-secondary-blue mb-2">
            Add New Blog Category
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              placeholder="Enter new blog category name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-blue focus:border-transparent"
            />
            <button
              onClick={handleAddCategory}
              className="bg-secondary-blue text-white px-6 py-2 rounded-lg font-semibold hover:bg-secondary-blue-dark transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Category
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Note: In production, save categories to database or settings
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-secondary-blue mb-2">
            Available Blog Categories
          </h2>
          <p className="text-sm text-gray-600">
            These categories are used for NewsBlogs content. They are independent from Header Categories.
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {categories.map((category) => {
            const stat = stats.find((s) => s.category === category);
            const count = stat?.count || 0;

            return (
              <div
                key={category}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary-blue/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-secondary-blue" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-blue">
                        {category}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-secondary-blue">
                        {count}
                      </div>
                      <div className="text-xs text-gray-500">
                        {count === 1 ? 'blog' : 'blogs'}
                      </div>
                    </div>
                    <Link
                      href={`/admin/blogs/new?blogCategory=${encodeURIComponent(category)}`}
                      className="bg-secondary-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-secondary-blue-dark transition-colors flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Create Blog
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">
          Note about Blog Categories
        </h3>
        <p className="text-sm text-blue-800">
          Blog Categories are independent from Header Categories and Header drop-down Categories. 
          They are used specifically for organizing NewsBlogs content by editorial type. 
          To create a new blog with a specific category, click "Create Blog" next to the category above.
        </p>
      </div>
    </div>
  );
}





