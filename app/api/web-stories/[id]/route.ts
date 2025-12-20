import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid web story ID' },
        { status: 400 }
      );
    }

    const stories = await prisma.$queryRawUnsafe(
      `SELECT 
        ws.id, ws.title, ws.slug, ws.excerpt, ws.cover_image as "coverImage",
        ws.pages, ws.author, ws.published, ws.featured, ws.views,
        ws.category_id as "categoryId", ws.subcategory_id as "subcategoryId",
        ws.tags, ws.created_at as "createdAt", ws.updated_at as "updatedAt",
        c.name as category_name, c.slug as category_slug,
        s.name as subcategory_name, s.slug as subcategory_slug
      FROM web_stories ws
      LEFT JOIN categories c ON c.id = ws.category_id
      LEFT JOIN subcategories s ON s.id = ws.subcategory_id
      WHERE ws.id = $1`,
      id
    ) as any[];

    if (!stories || stories.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Web story not found' },
        { status: 404 }
      );
    }

    const story = stories[0];

    // Increment views if published
    if (story.published) {
      await prisma.$executeRawUnsafe(
        `UPDATE web_stories SET views = views + 1 WHERE id = $1`,
        id
      );
      story.views = (story.views || 0) + 1;
    }

    return NextResponse.json({
      success: true,
      story: {
        _id: story.id.toString(),
        id: story.id,
        title: story.title,
        slug: story.slug,
        excerpt: story.excerpt,
        coverImage: story.coverImage,
        pages: typeof story.pages === 'string' ? JSON.parse(story.pages) : story.pages,
        author: story.author,
        published: story.published,
        featured: story.featured,
        views: story.views,
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
      },
    });
  } catch (error: any) {
    console.error('GET /api/web-stories/[id] error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch web story' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid web story ID' },
        { status: 400 }
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

    // Check if story exists
    const existing = await prisma.$queryRawUnsafe(
      `SELECT id FROM web_stories WHERE id = $1`,
      id
    ) as any[];

    if (!existing || existing.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Web story not found' },
        { status: 404 }
      );
    }

    // Check if slug is being changed and if new slug already exists
    if (slug) {
      const slugCheck = await prisma.$queryRawUnsafe(
        `SELECT id FROM web_stories WHERE slug = $1 AND id != $2`,
        slug,
        id
      ) as any[];

      if (slugCheck && slugCheck.length > 0) {
        return NextResponse.json(
          { success: false, error: 'A web story with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramIndex}`);
      values.push(title);
      paramIndex++;
    }
    if (slug !== undefined) {
      updates.push(`slug = $${paramIndex}`);
      values.push(slug);
      paramIndex++;
    }
    if (excerpt !== undefined) {
      updates.push(`excerpt = $${paramIndex}`);
      values.push(excerpt);
      paramIndex++;
    }
    if (coverImage !== undefined) {
      updates.push(`cover_image = $${paramIndex}`);
      values.push(coverImage);
      paramIndex++;
    }
    if (pages !== undefined) {
      updates.push(`pages = $${paramIndex}::jsonb`);
      values.push(JSON.stringify(pages));
      paramIndex++;
    }
    if (author !== undefined) {
      updates.push(`author = $${paramIndex}`);
      values.push(author);
      paramIndex++;
    }
    if (published !== undefined) {
      updates.push(`published = $${paramIndex}`);
      values.push(published);
      paramIndex++;
    }
    if (featured !== undefined) {
      updates.push(`featured = $${paramIndex}`);
      values.push(featured);
      paramIndex++;
    }
    if (categoryId !== undefined) {
      updates.push(`category_id = $${paramIndex}`);
      values.push(categoryId ? parseInt(categoryId, 10) : null);
      paramIndex++;
    }
    if (subcategoryId !== undefined) {
      updates.push(`subcategory_id = $${paramIndex}`);
      values.push(subcategoryId ? parseInt(subcategoryId, 10) : null);
      paramIndex++;
    }
    if (tags !== undefined) {
      updates.push(`tags = $${paramIndex}::text[]`);
      values.push(JSON.stringify(tags));
      paramIndex++;
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    if (updates.length === 1) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    const query = `
      UPDATE web_stories 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, title, slug, excerpt, cover_image as "coverImage", pages, author, published, featured, views,
        category_id as "categoryId", subcategory_id as "subcategoryId", tags, created_at as "createdAt", updated_at as "updatedAt"
    `;

    const result = await prisma.$queryRawUnsafe(query, ...values) as any[];
    const story = result[0];

    return NextResponse.json({
      success: true,
      story: {
        _id: story.id.toString(),
        ...story,
        pages: typeof story.pages === 'string' ? JSON.parse(story.pages) : story.pages,
        tags: Array.isArray(story.tags) ? story.tags : (story.tags || []),
      },
    });
  } catch (error: any) {
    console.error('PUT /api/web-stories/[id] error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update web story' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid web story ID' },
        { status: 400 }
      );
    }

    await prisma.$executeRawUnsafe(
      `DELETE FROM web_stories WHERE id = $1`,
      id
    );

    return NextResponse.json({ success: true, message: 'Web story deleted successfully' });
  } catch (error: any) {
    console.error('DELETE /api/web-stories/[id] error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete web story' },
      { status: 500 }
    );
  }
}
