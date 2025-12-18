'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteBlogPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/blogs/${params.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/blogs');
        router.refresh();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-secondary-blue mb-4">Delete Blog</h2>
      <p className="text-gray-600 mb-6">
        Are you sure you want to delete this blog? This action cannot be undone.
      </p>
      <div className="flex gap-4">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Deleting...' : 'Delete'}
        </button>
        <button
          onClick={() => router.push('/admin/blogs')}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}















