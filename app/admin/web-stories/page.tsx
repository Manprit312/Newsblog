'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Plus, Edit, Trash2, Eye, Search, Filter } from 'lucide-react';

type WebStory = {
  _id: string;
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  author: string;
  published: boolean;
  featured: boolean;
  views: number;
  createdAt: string;
  category?: { name: string; slug: string } | null;
};

export default function AdminWebStoriesPage() {
  const [stories, setStories] = useState<WebStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPublished, setFilterPublished] = useState<string>('all');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/web-stories');
      const data = await response.json();
      if (data.success) {
        setStories(data.stories);
      }
    } catch (error) {
      console.error('Failed to fetch web stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this web story?')) {
      return;
    }

    setDeleting(id);
    try {
      const response = await fetch(`/api/web-stories/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchStories();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete web story');
      }
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Failed to delete web story');
    } finally {
      setDeleting(null);
    }
  };

  const filteredStories = stories.filter((story) => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterPublished === 'all' ||
      (filterPublished === 'published' && story.published) ||
      (filterPublished === 'draft' && !story.published);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading web stories...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">Web Stories</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your web stories</p>
        </div>
        <Link
          href="/admin/web-stories/new"
          className="w-full sm:w-auto bg-[#1e3a8a] hover:bg-blue-700 dark:bg-[#1e3a8a] dark:hover:bg-blue-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>New Web Story</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search web stories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterPublished}
              onChange={(e) => setFilterPublished(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stories List */}
      {filteredStories.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 sm:p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg sm:text-xl mb-4">
            {searchTerm || filterPublished !== 'all' ? 'No web stories match your filters.' : 'No web stories found.'}
          </p>
          <Link
            href="/admin/web-stories/new"
            className="inline-block bg-[#1e3a8a] hover:bg-blue-700 dark:bg-[#1e3a8a] dark:hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Create Your First Web Story
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto overflow-y-auto max-h-[calc(100vh-300px)]">
            <table className="w-full min-w-[800px]">
              <thead className="bg-[#1e3a8a] dark:bg-blue-700 text-white sticky top-0 z-10">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Cover</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Title</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Category</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Status</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Views</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Date</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredStories.map((story) => (
                  <tr key={story._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 sm:px-6 py-4">
                      {story.coverImage ? (
                        <div className="relative w-16 h-24 rounded overflow-hidden">
                          <Image
                            src={story.coverImage}
                            alt={story.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-24 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="font-semibold text-blue-600 dark:text-blue-400 text-sm sm:text-base">
                        {story.title}
                      </div>
                      {story.excerpt && (
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
                          {story.excerpt}
                        </div>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      {story.category ? (
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs font-semibold">
                          {story.category.name}
                        </span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold w-fit ${
                            story.published
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {story.published ? 'Published' : 'Draft'}
                        </span>
                        {story.featured && (
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-purple-100 text-purple-800 w-fit">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Eye className="w-4 h-4" />
                        <span>{story.views || 0}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-500">
                      {story.createdAt && format(new Date(story.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/web-stories/${story.id}/edit`}
                          className="bg-[#1e3a8a] hover:bg-blue-700 dark:bg-[#1e3a8a] dark:hover:bg-blue-800 text-white px-3 py-1.5 rounded text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Edit</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(story.id.toString())}
                          disabled={deleting === story.id.toString()}
                          className="bg-red-600 text-white px-3 py-1.5 rounded text-xs sm:text-sm font-semibold hover:bg-red-700 transition-colors flex items-center gap-1 disabled:opacity-50"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
            {filteredStories.map((story) => (
              <div key={story._id} className="p-4">
                <div className="flex gap-4">
                  {story.coverImage ? (
                    <div className="relative w-20 h-28 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={story.coverImage}
                        alt={story.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-28 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs flex-shrink-0">
                      No Image
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-blue-600 dark:text-blue-400 text-sm mb-1 line-clamp-2">
                      {story.title}
                    </h3>
                    {story.excerpt && (
                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                        {story.excerpt}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          story.published
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {story.published ? 'Published' : 'Draft'}
                      </span>
                      {story.featured && (
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-purple-100 text-purple-800">
                          Featured
                        </span>
                      )}
                      {story.category && (
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs font-semibold">
                          {story.category.name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{story.views || 0}</span>
                      </div>
                      {story.createdAt && (
                        <span>{format(new Date(story.createdAt), 'MMM dd')}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/web-stories/${story.id}/edit`}
                        className="flex-1 bg-[#1e3a8a] hover:bg-blue-700 dark:bg-[#1e3a8a] dark:hover:bg-blue-800 text-white px-3 py-2 rounded text-xs font-semibold transition-colors text-center"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(story.id.toString())}
                        disabled={deleting === story.id.toString()}
                        className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-xs font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}





