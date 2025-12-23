'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Eye, Clock, Play } from 'lucide-react';

export default function WebStoriesPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('/api/web-stories?published=true');
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

    fetchStories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading web stories...</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        {/* Header */}
        <header className="mb-6 sm:mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-secondary-blue dark:text-yellow-600 mb-3 sm:mb-4">
            Web Stories
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            Immersive visual stories that bring news to life
          </p>
        </header>

        {/* Stories Grid */}
        {stories.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 sm:p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg sm:text-xl mb-4">
              No web stories available yet.
            </p>
            <Link
              href="/blogs"
              className="inline-block bg-secondary-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary-blue-dark transition-colors text-sm sm:text-base"
            >
              Browse Regular News
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {stories.map((story: any) => (
              <Link
                key={story._id || story.id}
                href={`/web-stories/${story.slug}`}
                className="group relative block"
              >
                <div className="relative aspect-[9/16] rounded-lg sm:rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  {story.coverImage && story.coverImage.trim() !== '' ? (
                    <Image
                      src={story.coverImage}
                      alt={story.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-secondary-blue to-blue-700 flex items-center justify-center">
                      <Play className="w-8 h-8 sm:w-12 sm:h-12 text-white opacity-80" />
                    </div>
                  )}
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Play Icon */}
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                    <div className="bg-white/90 dark:bg-gray-900/90 rounded-full p-1.5 sm:p-2">
                      <Play className="w-3 h-3 sm:w-4 sm:h-4 text-secondary-blue fill-secondary-blue" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4">
                    <h3 className="text-white font-bold text-xs sm:text-sm md:text-base line-clamp-2 sm:line-clamp-3 mb-1 sm:mb-2 drop-shadow-lg">
                      {story.title}
                    </h3>
                    
                    {/* Meta Info */}
                    <div className="flex items-center gap-2 sm:gap-3 text-white/90 text-[10px] sm:text-xs">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{story.views || 0}</span>
                      </div>
                      {story.createdAt && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">
                            {format(new Date(story.createdAt), 'MMM dd')}
                          </span>
                          <span className="sm:hidden">
                            {format(new Date(story.createdAt), 'MMM d')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Featured Badge */}
                  {story.featured && (
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                      <span className="bg-yellow-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded">
                        FEATURED
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Featured Stories Section */}
        {stories.filter((s: any) => s.featured).length > 0 && (
          <section className="mt-8 sm:mt-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-secondary-blue dark:text-yellow-600 mb-4 sm:mb-6 px-4 sm:px-0">
              Featured Stories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {stories
                .filter((s: any) => s.featured)
                .slice(0, 6)
                .map((story: any) => (
                  <Link
                    key={story._id || story.id}
                    href={`/web-stories/${story.slug}`}
                    className="group block bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative aspect-video sm:aspect-[4/3]">
                      {story.coverImage && story.coverImage.trim() !== '' ? (
                        <Image
                          src={story.coverImage}
                          alt={story.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-secondary-blue to-blue-700 flex items-center justify-center">
                          <Play className="w-12 h-12 text-white opacity-80" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-3 right-3">
                        <div className="bg-white/90 rounded-full p-2">
                          <Play className="w-5 h-5 text-secondary-blue fill-secondary-blue" />
                        </div>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-secondary-blue transition-colors">
                        {story.title}
                      </h3>
                      {story.excerpt && (
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                          {story.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{story.views || 0}</span>
                        </div>
                        {story.createdAt && (
                          <span>{format(new Date(story.createdAt), 'MMM dd, yyyy')}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
