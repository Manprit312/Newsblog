import { NextRequest, NextResponse } from 'next/server';
import { getBlogs, createBlog } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const published = searchParams.get('published');
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');

    const blogs = await getBlogs({
      published: published ? published === 'true' : undefined,
      featured: featured ? featured === 'true' : undefined,
      category: category || undefined,
      limit: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json({ success: true, blogs });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const blog = await createBlog(body);
    return NextResponse.json({ success: true, blog }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}







