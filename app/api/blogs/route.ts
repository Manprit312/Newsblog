import { NextRequest, NextResponse } from 'next/server';
import { getBlogs, createBlog } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const published = searchParams.get('published');
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    const skip = searchParams.get('skip');

    const blogs = await getBlogs({
      published: published ? published === 'true' : undefined,
      featured: featured ? featured === 'true' : undefined,
      category: category || undefined,
      subcategory: subcategory || undefined,
      search: search || undefined,
      limit: limit ? parseInt(limit) : undefined,
      skip: skip ? parseInt(skip) : undefined,
    });

    return NextResponse.json({ success: true, blogs });
  } catch (error: any) {
    console.error('GET /api/blogs error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, slug, and content are required' },
        { status: 400 }
      );
    }

    const blog = await createBlog(body);
    return NextResponse.json({ success: true, blog }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/blogs error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create blog' },
      { status: 500 }
    );
  }
}












