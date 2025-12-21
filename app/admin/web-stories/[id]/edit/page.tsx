'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import WebStoryForm from '@/components/WebStoryForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function EditWebStoryPage() {
  const params = useParams();
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`/api/web-stories/${params.id}`);
        const data = await response.json();
        if (data.success) {
          setStory(data.story);
        }
      } catch (error) {
        console.error('Failed to fetch web story:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchStory();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading web story...</div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Web story not found.</p>
        <Link
          href="/admin/web-stories"
          className="text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          Back to Web Stories
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-4 sm:mb-6">
        <Link
          href="/admin/web-stories"
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
          Edit Web Story
        </h1>
      </div>
      <WebStoryForm initialData={story} />
    </div>
  );
}





