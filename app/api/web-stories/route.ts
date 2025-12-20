import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const published = searchParams.get('published');
    const categoryId = searchParams.get('categoryId');
    const subcategoryId = searchParams.get('subcategoryId');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');

    let query = `
      SELECT 
        ws.id, ws.title, ws.slug, ws.excerpt, ws.cover_image as "coverImage",
        ws.pages, ws.author, ws.published, ws.featured, ws.views,
        ws.category_id as "categoryId", ws.subcategory_id as "subcategoryId",
        ws.tags, ws.created_at as "createdAt", ws.updated_at as "updatedAt",
        c.name as category_name, c.slug as category_slug,
        s.name as subcategory_name, s.slug as subcategory_slug
      FROM web_stories ws
      LEFT JOIN categories c ON c.id = ws.category_id
      LEFT JOIN subcategories s ON s.id = ws.subcategory_id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (published !== null) {
      query += ` AND ws.published = $${paramIndex}`;
      params.push(published === 'true');
      paramIndex++;
    }

    if (categoryId) {
      query += ` AND ws.category_id = $${paramIndex}`;
      params.push(parseInt(categoryId, 10));
      paramIndex++;
    }

    if (subcategoryId) {
      query += ` AND ws.subcategory_id = $${paramIndex}`;
      params.push(parseInt(subcategoryId, 10));
      paramIndex++;
    }

    if (featured === 'true') {
      query += ` AND ws.featured = true`;
    }

    query += ` ORDER BY ws.created_at DESC`;

    if (limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(parseInt(limit, 10));
    }

    const stories = await prisma.$queryRawUnsafe(query, ...params) as any[];

    // Format the response
    const formattedStories = stories.map((story: any) => ({
      _id: story.id.toString(),
      id: story.id,
      title: story.title,
      slug: story.slug,
      excerpt: story.excerpt,
      coverImage: story.coverImage,
      pages: typeof story.pages === 'string' ? JSON.parse(story.pages || '[]') : (story.pages || []),
      author: story.author,
      published: story.published,
      featured: story.featured,
      views: story.views || 0,
      categoryId: story.categoryId,
      subcategoryId: story.subcategoryId,
      category: story.category_name ? {
        id: story.categoryId,
        name: story.category_name,
        slug: story.category_slug,
      } : null,
      subcategory: story.subcategory_name ? {
        id: story.subcategoryId,
        name: story.subcategory_name,
        slug: story.subcategory_slug,
      } : null,
      tags: Array.isArray(story.tags) ? story.tags : (story.tags || []),
      createdAt: story.createdAt ? new Date(story.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: story.updatedAt ? new Date(story.updatedAt).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json({ success: true, stories: formattedStories });
  } catch (error: any) {
    console.error('GET /api/web-stories error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch web stories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      coverImage,
      pages,
      author,
      published,
      featured,
      categoryId,
      subcategoryId,
      tags,
    } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { success: false, error: 'Title and slug are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await prisma.$queryRawUnsafe(
      `SELECT id FROM web_stories WHERE slug = $1`,
      slug
    ) as any[];

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { success: false, error: 'A web story with this slug already exists' },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO web_stories (
        title, slug, excerpt, cover_image, pages, author, published, featured,
        category_id, subcategory_id, tags, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8, $9, $10, $11::text[], NOW(), NOW())
      RETURNING id, title, slug, excerpt, cover_image as "coverImage", pages, author, published, featured, views,
        category_id as "categoryId", subcategory_id as "subcategoryId", tags, created_at as "createdAt", updated_at as "updatedAt"
    `;

    const result = await prisma.$queryRawUnsafe(
      query,
      title,
      slug,
      excerpt || null,
      coverImage || null,
      JSON.stringify(pages || []),
      author || 'Admin',
      published !== undefined ? published : false,
      featured !== undefined ? featured : false,
      categoryId ? parseInt(categoryId, 10) : null,
      subcategoryId ? parseInt(subcategoryId, 10) : null,
      JSON.stringify(tags || [])
    ) as any[];

    const story = result[0];

    return NextResponse.json(
      {
        success: true,
        story: {
          _id: story.id.toString(),
          ...story,
          pages: typeof story.pages === 'string' ? JSON.parse(story.pages) : story.pages,
          tags: Array.isArray(story.tags) ? story.tags : (story.tags || []),
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('POST /api/web-stories error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create web story' },
      { status: 500 }
    );
  }
}
