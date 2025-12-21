"use client";

import { useEffect, useState } from "react";
import { FileText, Eye, Star, TrendingUp, FolderTree } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/dashboard/stats");
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Blogs",
      value: stats?.blogs?.total || 0,
      icon: FileText,
      color: "blue",
      href: "/admin/blogs",
    },
    {
      title: "Published Blogs",
      value: stats?.blogs?.published || 0,
      icon: Eye,
      color: "green",
      href: "/admin/blogs",
    },
    {
      title: "Featured Blogs",
      value: stats?.blogs?.featured || 0,
      icon: Star,
      color: "yellow",
      href: "/admin/blogs",
    },
    {
      title: "Total Views",
      value: stats?.blogs?.totalViews || 0,
      icon: TrendingUp,
      color: "purple",
      href: "/admin/blogs",
    },
    {
      title: "Categories",
      value: stats?.categories?.total || 0,
      icon: FolderTree,
      color: "emerald",
      href: "/admin/categories",
      subtitle: `${stats?.categories?.active || 0} active`,
    },
  ];

  return (
    <div className="w-full">
      <h1 className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-4 sm:mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
            green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
            yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
            purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
            emerald: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
            indigo: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
          };

          return (
            <Link
              key={index}
              href={stat.href}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              {stat.subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  {stat.subtitle}
                </p>
              )}
            </Link>
          );
        })}
      </div>

      {/* Blog Categories */}
      {stats?.blogs?.categoryCounts && stats.blogs.categoryCounts.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-3 sm:mb-4">
            Blogs by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {stats.blogs.categoryCounts.map((cat: any, index: number) => (
              <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {cat.count}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {cat.category}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 sm:mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-3 sm:mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <Link
            href="/admin/blogs/new"
            className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors text-center"
          >
            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="font-medium text-gray-700 dark:text-gray-300">
              Create New Blog
            </p>
          </Link>
          <Link
            href="/admin/categories/new"
            className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors text-center"
          >
            <FolderTree className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="font-medium text-gray-700 dark:text-gray-300">
              Add New Category
            </p>
          </Link>
          <Link
            href="/admin/settings"
            className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors text-center"
          >
            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="font-medium text-gray-700 dark:text-gray-300">
              Site Settings
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}









