import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const subcategoryId = parseInt(params.id, 10);
    if (isNaN(subcategoryId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid subcategory ID' },
        { status: 400 }
      );
    }

    const subcategory = await prisma.subcategory.findUnique({
      where: { id: subcategoryId },
      include: {
        category: true,
      },
    });

    if (!subcategory) {
      return NextResponse.json(
        { success: false, error: 'Subcategory not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, subcategory });
  } catch (error: any) {
    console.error('GET /api/subcategories/[id] error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch subcategory' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const subcategoryId = parseInt(params.id, 10);
    if (isNaN(subcategoryId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid subcategory ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updates: any = {};

    if (body.name !== undefined) updates.name = body.name;
    if (body.slug !== undefined) updates.slug = body.slug;
    if (body.description !== undefined) updates.description = body.description;
    if (body.orderIndex !== undefined) updates.orderIndex = body.orderIndex;
    if (body.active !== undefined) updates.active = body.active;
    if (body.categoryId !== undefined) updates.categoryId = parseInt(body.categoryId, 10);

    const subcategory = await prisma.subcategory.update({
      where: { id: subcategoryId },
      data: updates,
      include: {
        category: true,
      },
    });

    return NextResponse.json({ success: true, subcategory });
  } catch (error: any) {
    console.error('PUT /api/subcategories/[id] error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Subcategory not found' },
        { status: 404 }
      );
    }
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Subcategory with this slug already exists in this category' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update subcategory' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const subcategoryId = parseInt(params.id, 10);
    if (isNaN(subcategoryId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid subcategory ID' },
        { status: 400 }
      );
    }

    await prisma.subcategory.delete({
      where: { id: subcategoryId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE /api/subcategories/[id] error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Subcategory not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete subcategory' },
      { status: 500 }
    );
  }
}


