import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('categoryId');
    const active = searchParams.get('active');

    const where: any = {};
    if (categoryId) {
      where.categoryId = parseInt(categoryId, 10);
    }
    if (active !== null) {
      where.active = active === 'true';
    }

    const subcategories = await prisma.subcategory.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { orderIndex: 'asc' },
    });

    return NextResponse.json({ success: true, subcategories });
  } catch (error: any) {
    console.error('GET /api/subcategories error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch subcategories' },
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
    if (!body.name || !body.slug || !body.categoryId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, slug, and categoryId are required' },
        { status: 400 }
      );
    }

    const subcategory = await prisma.subcategory.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        orderIndex: body.orderIndex || 0,
        active: body.active !== undefined ? body.active : true,
        categoryId: parseInt(body.categoryId, 10),
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ success: true, subcategory }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/subcategories error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Subcategory with this slug already exists in this category' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create subcategory' },
      { status: 500 }
    );
  }
}













