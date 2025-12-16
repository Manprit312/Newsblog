import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Increment views
    await query('UPDATE "Blog" SET views = views + 1 WHERE slug = $1', [params.slug]);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to increment views:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

