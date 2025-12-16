import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Increment views
    await query(
      'blogs',
      async (collection) => {
        return await collection.updateOne(
          { slug: params.slug },
          { $inc: { views: 1 } }
        );
      }
    );
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to increment views:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

