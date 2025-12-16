import { NextRequest, NextResponse } from 'next/server';
import { getBlogBySlug } from '@/lib/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Don't increment views in API route - use the view endpoint instead
    const blog = await getBlogBySlug(params.slug, false);
    
    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, blog });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}














