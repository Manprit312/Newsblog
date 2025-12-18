import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Increment views
    await prisma.blog.update({
      where: { slug: params.slug },
      data: { views: { increment: 1 } },
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to increment views:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
