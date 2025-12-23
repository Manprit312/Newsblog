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
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <Link
          href="/admin/blogs"
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
            Blog Categories
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage Blog Categories for NewsBlogs (Independent from Header Categories)
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-4 sm:mb-6">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-base sm:text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
            Add New Blog Category
          </h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              placeholder="Enter new blog category name"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
            />
            <button
              onClick={handleAddCategory}
              className="w-full sm:w-auto bg-[#1e3a8a] hover:bg-blue-700 dark:bg-[#1e3a8a] dark:hover:bg-blue-800 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Add Category</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Note: In production, save categories to database or settings
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-base sm:text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
            Available Blog Categories
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            These categories are used for NewsBlogs content. They are independent from Header Categories.
          </p>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {categories.map((category) => {
            const stat = stats.find((s) => s.category === category);
            const count = stat?.count || 0;

            return (
              <div
                key={category}
                className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-blue-600 dark:text-blue-400 truncate">
                        {category}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <div className="text-right">
                      <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {count}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {count === 1 ? 'blog' : 'blogs'}
                      </div>
                    </div>
                    <Link
                      href={`/admin/blogs/new?blogCategory=${encodeURIComponent(category)}`}
                      className="flex-1 sm:flex-initial bg-[#1e3a8a] hover:bg-blue-700 dark:bg-[#1e3a8a] dark:hover:bg-blue-800 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm"
                    >
                      <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Create Blog</span>
                      <span className="sm:hidden">Create</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 sm:mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-xs sm:text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
          Note about Blog Categories
        </h3>
        <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200">
          Blog Categories are independent from Header Categories and Header drop-down Categories. 
          They are used specifically for organizing NewsBlogs content by editorial type. 
          To create a new blog with a specific category, click "Create Blog" next to the category above.
        </p>
      </div>
    </div>
  );
}





