import { query } from './db';

interface GetBlogsOptions {
  published?: boolean;
  featured?: boolean;
  category?: string;
  limit?: number;
  skip?: number;
}

// Type for database blog row
type BlogRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  author: string;
  published: boolean;
  featured: boolean;
  views: number;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export async function getBlogs(options: GetBlogsOptions = {}) {
  try {
    let sql = 'SELECT * FROM "Blog" WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (options.published !== undefined) {
      sql += ` AND published = $${paramIndex}`;
      params.push(options.published);
      paramIndex++;
    }
    if (options.featured !== undefined) {
      sql += ` AND featured = $${paramIndex}`;
      params.push(options.featured);
      paramIndex++;
    }
    if (options.category) {
      sql += ` AND category = $${paramIndex}`;
      params.push(options.category);
      paramIndex++;
    }

    sql += ' ORDER BY';
    if (options.featured !== undefined && options.featured) {
      sql += ' featured DESC,';
    }
    sql += ' "createdAt" DESC';

    if (options.limit) {
      sql += ` LIMIT $${paramIndex}`;
      params.push(options.limit);
      paramIndex++;
    }
    if (options.skip) {
      sql += ` OFFSET $${paramIndex}`;
      params.push(options.skip);
    }

    const result = await query(sql, params);
    const blogs = result.rows;

    return blogs.map((blog: BlogRow) => {
      const formatDate = (date: Date | string): string => {
        if (date instanceof Date) {
          return date.toISOString();
        }
        if (typeof date === 'string') {
          return date;
        }
        return new Date(date).toISOString();
      };

      return {
        ...blog,
        _id: blog.id,
        createdAt: formatDate(blog.createdAt),
        updatedAt: formatDate(blog.updatedAt),
      };
    });
  } catch (error) {
    console.error('Failed to load blogs from database, returning empty list.', error);
    return [];
  }
}

export async function getBlogBySlug(slug: string, incrementViews: boolean = false) {
  try {
    const result = await query('SELECT * FROM "Blog" WHERE slug = $1', [slug]);
    
    if (result.rows.length === 0) return null;

    const blog = result.rows[0] as BlogRow;

    // Only increment views at runtime, not during static generation
    if (incrementViews) {
      await query('UPDATE "Blog" SET views = views + 1 WHERE slug = $1', [slug]);
    }

    const formatDate = (date: Date | string): string => {
      if (date instanceof Date) {
        return date.toISOString();
      }
      if (typeof date === 'string') {
        return date;
      }
      return new Date(date).toISOString();
    };

    return {
      ...blog,
      _id: blog.id,
      createdAt: formatDate(blog.createdAt),
      updatedAt: formatDate(blog.updatedAt),
    };
  } catch (error) {
    console.error('Failed to load blog by slug from database.', error);
    return null;
  }
}

export async function getBlogById(id: string) {
  try {
    const result = await query('SELECT * FROM "Blog" WHERE id = $1', [id]);
    
    if (result.rows.length === 0) return null;

    const blog = result.rows[0] as BlogRow;

    const formatDate = (date: Date | string): string => {
      if (date instanceof Date) {
        return date.toISOString();
      }
      if (typeof date === 'string') {
        return date;
      }
      return new Date(date).toISOString();
    };

    return {
      ...blog,
      _id: blog.id,
      createdAt: formatDate(blog.createdAt),
      updatedAt: formatDate(blog.updatedAt),
    };
  } catch (error) {
    console.error('Failed to load blog by id from database.', error);
    return null;
  }
}

export async function createBlog(data: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category?: string;
  tags?: string[];
  author?: string;
  published?: boolean;
  featured?: boolean;
}) {
  try {
    const now = new Date();
    const sql = `
      INSERT INTO "Blog" (
        id, title, slug, excerpt, content, "featuredImage", 
        category, tags, author, published, featured, views, 
        "createdAt", "updatedAt"
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 0, $11, $11
      ) RETURNING *
    `;
    
    const params = [
      data.title,
      data.slug,
      data.excerpt,
      data.content,
      data.featuredImage,
      data.category || 'General',
      data.tags || [],
      data.author || 'Admin',
      data.published || false,
      data.featured || false,
      now,
    ];

    const result = await query(sql, params);
    const blog = result.rows[0];

    return {
      ...blog,
      _id: blog.id,
      createdAt: blog.createdAt?.toISOString() || new Date(blog.createdAt).toISOString(),
      updatedAt: blog.updatedAt?.toISOString() || new Date(blog.updatedAt).toISOString(),
    };
  } catch (error) {
    console.error('Failed to create blog in database.', error);
    throw new Error('Database is currently unavailable. Please try again later.');
  }
}

export async function updateBlog(id: string, data: {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  category?: string;
  tags?: string[];
  author?: string;
  published?: boolean;
  featured?: boolean;
}) {
  try {
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (data.title !== undefined) {
      updates.push(`title = $${paramIndex++}`);
      params.push(data.title);
    }
    if (data.slug !== undefined) {
      updates.push(`slug = $${paramIndex++}`);
      params.push(data.slug);
    }
    if (data.excerpt !== undefined) {
      updates.push(`excerpt = $${paramIndex++}`);
      params.push(data.excerpt);
    }
    if (data.content !== undefined) {
      updates.push(`content = $${paramIndex++}`);
      params.push(data.content);
    }
    if (data.featuredImage !== undefined) {
      updates.push(`"featuredImage" = $${paramIndex++}`);
      params.push(data.featuredImage);
    }
    if (data.category !== undefined) {
      updates.push(`category = $${paramIndex++}`);
      params.push(data.category);
    }
    if (data.tags !== undefined) {
      updates.push(`tags = $${paramIndex++}`);
      params.push(data.tags);
    }
    if (data.author !== undefined) {
      updates.push(`author = $${paramIndex++}`);
      params.push(data.author);
    }
    if (data.published !== undefined) {
      updates.push(`published = $${paramIndex++}`);
      params.push(data.published);
    }
    if (data.featured !== undefined) {
      updates.push(`featured = $${paramIndex++}`);
      params.push(data.featured);
    }

    if (updates.length === 0) {
      // No updates, just return the existing blog
      return await getBlogById(id);
    }

    updates.push(`"updatedAt" = $${paramIndex++}`);
    params.push(new Date());
    params.push(id); // For WHERE clause

    const sql = `UPDATE "Blog" SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    const result = await query(sql, params);
    
    if (result.rows.length === 0) {
      throw new Error('Blog not found');
    }

    const blog = result.rows[0];

    return {
      ...blog,
      _id: blog.id,
      createdAt: blog.createdAt?.toISOString() || new Date(blog.createdAt).toISOString(),
      updatedAt: blog.updatedAt?.toISOString() || new Date(blog.updatedAt).toISOString(),
    };
  } catch (error) {
    console.error('Failed to update blog in database.', error);
    throw new Error('Database is currently unavailable. Please try again later.');
  }
}

export async function deleteBlog(id: string) {
  try {
    const result = await query('DELETE FROM "Blog" WHERE id = $1 RETURNING id', [id]);
    return result.rows.length > 0;
  } catch (error) {
    console.error('Failed to delete blog in database.', error);
    throw new Error('Database is currently unavailable. Please try again later.');
  }
}
