'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ArrowLeft, Eye, Clock, Share2 } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function WebStoryPage() {
  const params = useParams();
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`/api/web-stories?published=true`);
        const data = await response.json();
        if (data.success) {
          const foundStory = data.stories.find((s: any) => s.slug === params.slug);
          if (foundStory) {
            // Fetch full story details
            const fullResponse = await fetch(`/api/web-stories/${foundStory.id}`);
            const fullData = await fullResponse.json();
            if (fullData.success) {
              setStory(fullData.story);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch web story:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchStory();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading story...</div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Story not found.</p>
          <Link
            href="/web-stories"
            className="text-secondary-blue hover:underline"
          >
            Back to Web Stories
          </Link>
        </div>
      </div>
    );
  }

  const pages = Array.isArray(story.pages) ? story.pages : [];

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/web-stories"
              className="flex items-center gap-2 text-secondary-blue hover:text-secondary-blue-dark transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm sm:text-base font-medium">Back to Stories</span>
            </Link>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-1 sm:gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Eye className="w-4 h-4" />
                <span>{story.views || 0}</span>
              </div>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && navigator.share) {
                    navigator.share({
                      title: story.title,
                      text: story.excerpt,
                      url: window.location.href,
                    }).catch(() => {
                      // Fallback: copy to clipboard
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    });
                  } else if (typeof window !== 'undefined') {
                    // Fallback: copy to clipboard
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Share story"
              >
                <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Story Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        {/* Cover Image */}
        {story.coverImage && story.coverImage.trim() !== '' && (
          <div className="relative w-full aspect-video sm:aspect-[16/9] rounded-lg sm:rounded-xl overflow-hidden mb-6 sm:mb-8 shadow-lg">
            <Image
              src={story.coverImage}
              alt={story.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
        )}

        {/* Story Title and Meta */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
            {story.title}
          </h1>
          
          {story.excerpt && (
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
              {story.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <span className="font-medium">By {story.author || 'Admin'}</span>
            </div>
            {story.createdAt && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{format(new Date(story.createdAt), 'MMMM dd, yyyy')}</span>
              </div>
            )}
            {story.category && (
              <Link
                href={`/blogs?category=${story.category.slug}`}
                className="bg-secondary-blue/10 text-secondary-blue px-3 py-1 rounded-full text-xs sm:text-sm font-medium hover:bg-secondary-blue/20 transition-colors"
              >
                {story.category.name}
              </Link>
            )}
          </div>
        </div>

        {/* Story Pages */}
        {pages.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            {pages.map((page: any, index: number) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl overflow-hidden shadow-md"
              >
                {page.image && page.image.trim() !== '' && (
                  <div className="relative w-full aspect-video sm:aspect-[16/9]">
                    <Image
                      src={page.image}
                      alt={page.title || `Page ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                  </div>
                )}
                <div className="p-4 sm:p-6">
                  {page.title && (
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">
                      {page.title}
                    </h2>
                  )}
                  {page.text && (
                    <div
                      className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                      dangerouslySetInnerHTML={{ __html: page.text }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 sm:p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Story content is being prepared. Please check back soon.
            </p>
          </div>
        )}

        {/* Related Stories */}
        <div className="mt-8 sm:mt-12 pt-8 sm:pt-12 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
            More Stories
          </h2>
          <Link
            href="/web-stories"
            className="inline-block bg-secondary-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary-blue-dark transition-colors text-sm sm:text-base"
          >
            View All Web Stories
          </Link>
        </div>
      </main>
    </div>
  );
}

