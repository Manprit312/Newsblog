import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Clock, Eye, MessageCircle } from 'lucide-react';

interface BlogCardProps {
  blog: {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    featuredImage: string;
    category: string;
    featured: boolean;
    views: number;
    createdAt: string;
  };
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <Link href={`/blog/${blog.slug}`}>
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 dark:border-gray-700">
        <div className="relative h-48 w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
          {blog.featuredImage ? (
            <Image
              src={blog.featuredImage}
              alt={blog.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-600">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute top-3 left-3">
            <span className="bg-black text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide">
              {blog.category}
            </span>
          </div>
          {blog.featured && (
            <div className="absolute top-3 right-3">
              <span className="bg-secondary-blue text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                Featured
              </span>
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-yellow-600 transition-colors line-clamp-2 leading-snug">
            {blog.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <span>by News Line</span>
            <span className="uppercase">{format(new Date(blog.createdAt), 'MMM dd, yyyy').toUpperCase()}</span>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              <span>0</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{blog.views}</span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 leading-relaxed">
            {blog.excerpt}
          </p>
        </div>
      </article>
    </Link>
  );
}

