'use client';

import { useEffect } from 'react';

interface ViewIncrementerProps {
  slug: string;
}

export default function ViewIncrementer({ slug }: ViewIncrementerProps) {
  useEffect(() => {
    // Increment views when page is viewed (client-side)
    fetch(`/api/blogs/slug/${slug}/view`, {
      method: 'POST',
    }).catch((error) => {
      // Silently fail - view incrementing is not critical
      console.error('Failed to increment views:', error);
    });
  }, [slug]);

  return null; // This component doesn't render anything
}


