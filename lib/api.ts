import { prisma } from './db';

interface GetBlogsOptions {
  published?: boolean;
  featured?: boolean;
  category?: string;
  categoryId?: number;
  subcategory?: string;
  subcategoryId?: number;
  limit?: number;
  skip?: number;
  search?: string;
}

// Type for Blog
type Blog = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  photos: string[];
  tags: string[];
  author: string;
  published: boolean;
  featured: boolean;
  views: number;
  categoryId: number | null;
  subcategoryId: number | null;
  category: { id: number; name: string; slug: string } | null;
  subcategory: { id: number; name: string; slug: string } | null;
  createdAt: Date;
  updatedAt: Date;
};

const formatBlog = (blog: Blog) => {
  return {
    ...blog,
    _id: blog.id.toString(),
    id: blog.id.toString(),
    featuredImage: blog.featuredImage || '',
    photos: blog.photos || [],
    category: blog.category?.name || null,
    subcategory: blog.subcategory?.name || null,
    createdAt: blog.createdAt.toISOString(),
    updatedAt: blog.updatedAt.toISOString(),
  };
};

// Function to fetch Geneveda blogs from blogs table
export async function getGenevedaBlogs(options: { published?: boolean; featured?: boolean; search?: string; limit?: number; skip?: number } = {}) {
  try {
    let query = `
      SELECT 
        b.id, b.title, b.slug, b.excerpt, b.content, b.image, b.images,
        b.tags, b.author, b.author_role as "authorRole", b.category, b.read_time as "readTime",
        b.published, b.featured, b.views, b.published_at as "publishedAt",
        b.created_at as "createdAt", b.updated_at as "updatedAt"
      FROM blogs b
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (options.published !== undefined) {
      query += ` AND b.published = $${paramIndex}`;
      params.push(options.published);
      paramIndex++;
    }
    if (options.featured !== undefined) {
      query += ` AND b.featured = $${paramIndex}`;
      params.push(options.featured);
      paramIndex++;
    }
    if (options.search) {
      query += ` AND (b.title ILIKE $${paramIndex} OR b.excerpt ILIKE $${paramIndex} OR b.content ILIKE $${paramIndex})`;
      const searchTerm = `%${options.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
      paramIndex += 3;
    }

    query += ` ORDER BY b.created_at DESC`;

    if (options.skip) {
      query += ` OFFSET $${paramIndex}`;
      params.push(options.skip);
      paramIndex++;
    }
    if (options.limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(options.limit);
    }

    const blogs = await prisma.$queryRawUnsafe(query, ...params) as any[];

    return blogs.map((blog: any) => {
      // Parse JSON fields
      const tags = typeof blog.tags === 'string' ? JSON.parse(blog.tags || '[]') : (blog.tags || []);
      const images = typeof blog.images === 'string' ? JSON.parse(blog.images || '[]') : (blog.images || []);
      
      return {
        _id: blog.id.toString(),
        id: blog.id.toString(),
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt,
        content: blog.content,
        featuredImage: blog.image || (images.length > 0 ? images[0] : ''),
        image: blog.image,
        images: images.length > 0 ? images : (blog.image ? [blog.image] : []),
        tags: Array.isArray(tags) ? tags : [],
        author: blog.author,
        authorRole: blog.authorRole || '',
        category: blog.category || 'Research',
        readTime: blog.readTime || '5 min read',
        published: blog.published,
        featured: blog.featured,
        views: blog.views,
        publishedAt: blog.publishedAt ? new Date(blog.publishedAt).toISOString() : new Date(blog.createdAt).toISOString(),
        createdAt: blog.createdAt ? new Date(blog.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : new Date().toISOString(),
        source: 'geneveda' // Mark as Geneveda blog
      };
    });
  } catch (error: any) {
    console.error('Error fetching Geneveda blogs:', error);
    return [];
  }
}

export async function getBlogs(options: GetBlogsOptions = {}) {
  try {
    const where: any = {};

    if (options.published !== undefined) {
      where.published = options.published;
    }
    if (options.featured !== undefined) {
      where.featured = options.featured;
    }
    let categoryId: number | null = null;
    
    if (options.categoryId) {
      categoryId = options.categoryId;
      where.categoryId = options.categoryId;
    } else if (options.category) {
      // Find category by slug
      const category = await prisma.category.findUnique({
        where: { slug: options.category },
      });
      if (category) {
        categoryId = category.id;
        where.categoryId = category.id;
      }
    }
    
    if (options.subcategoryId) {
      where.subcategoryId = options.subcategoryId;
    } else if (options.subcategory) {
      // Find subcategory by slug
      // If we have a categoryId, use it to find the correct subcategory
      // Otherwise, find first matching subcategory
      const subcategoryWhere: any = { slug: options.subcategory };
      if (categoryId) {
        subcategoryWhere.categoryId = categoryId;
      }
      
      const subcategory = await prisma.subcategory.findFirst({
        where: subcategoryWhere,
      });
      if (subcategory) {
        where.subcategoryId = subcategory.id;
      }
    }
    if (options.search) {
      where.OR = [
        { title: { contains: options.search, mode: 'insensitive' } },
        { excerpt: { contains: options.search, mode: 'insensitive' } },
        { content: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any[] = [];
    if (options.featured !== undefined && options.featured) {
      orderBy.push({ featured: 'desc' });
    }
    orderBy.push({ createdAt: 'desc' });

    const blogs = await prisma.blog.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy,
      skip: options.skip,
      take: options.limit,
    });

    return blogs.map(formatBlog);
  } catch (error: any) {
    console.error('Failed to load blogs from database, returning empty list.', error);
    return [];
  }
}

export async function getBlogBySlug(slug: string, incrementViews: boolean = false) {
  try {
    const blog = await prisma.blog.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
    
    if (!blog) return null;

    // Only increment views at runtime, not during static generation
    if (incrementViews) {
      await prisma.blog.update({
        where: { slug },
        data: { views: { increment: 1 } },
      });
      
      // Fetch updated blog with incremented views
      const updatedBlog = await prisma.blog.findUnique({
        where: { slug },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          subcategory: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });
      
      return updatedBlog ? formatBlog(updatedBlog) : formatBlog(blog);
    }

    return formatBlog(blog);
  } catch (error) {
    console.error('Failed to load blog by slug from database.', error);
    return null;
  }
}

export async function getBlogById(id: string) {
  try {
    const blogId = parseInt(id, 10);
    if (isNaN(blogId)) {
      return null;
    }

    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
    
    if (!blog) return null;

    return formatBlog(blog);
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
  photos?: string[];
  tags?: string[];
  author?: string;
  published?: boolean;
  featured?: boolean;
  categoryId?: number;
  subcategoryId?: number;
}) {
  try {
    const blog = await prisma.blog.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        featuredImage: data.featuredImage || null,
        photos: Array.isArray(data.photos) ? data.photos : [],
        tags: Array.isArray(data.tags) ? data.tags : [],
        author: data.author || 'Admin',
        published: data.published || false,
        featured: data.featured || false,
        views: 0,
        categoryId: data.categoryId || null,
        subcategoryId: data.subcategoryId || null,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return formatBlog(blog);
  } catch (error: any) {
    console.error('Failed to create blog in database.', error);
    // Return more specific error messages
    if (error.code === 'P2002') {
      // Unique constraint violation
      throw new Error(`A blog with slug "${data.slug}" already exists. Please use a different slug.`);
    }
    if (error.code === 'P2003') {
      // Foreign key constraint violation
      throw new Error('Invalid category or subcategory selected.');
    }
    // Return the actual error message for debugging
    throw new Error(error.message || 'Database is currently unavailable. Please try again later.');
  }
}

export async function updateBlog(id: string, data: {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  photos?: string[];
  tags?: string[];
  author?: string;
  published?: boolean;
  featured?: boolean;
  categoryId?: number;
  subcategoryId?: number;
}) {
  try {
    const blogId = parseInt(id, 10);
    if (isNaN(blogId)) {
      throw new Error('Invalid blog ID');
    }

    const updates: any = {};

    if (data.title !== undefined) updates.title = data.title;
    if (data.slug !== undefined) updates.slug = data.slug;
    if (data.excerpt !== undefined) updates.excerpt = data.excerpt;
    if (data.content !== undefined) updates.content = data.content;
    if (data.featuredImage !== undefined) updates.featuredImage = data.featuredImage;
    if (data.photos !== undefined) updates.photos = data.photos;
    if (data.tags !== undefined) updates.tags = data.tags;
    if (data.author !== undefined) updates.author = data.author;
    if (data.published !== undefined) updates.published = data.published;
    if (data.featured !== undefined) updates.featured = data.featured;
    if (data.categoryId !== undefined) updates.categoryId = data.categoryId;
    if (data.subcategoryId !== undefined) updates.subcategoryId = data.subcategoryId;

    if (Object.keys(updates).length === 0) {
      // No updates, just return the existing blog
      return await getBlogById(id);
    }

    const blog = await prisma.blog.update({
      where: { id: blogId },
      data: updates,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
    
    return formatBlog(blog);
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw new Error('Blog not found');
    }
    console.error('Failed to update blog in database.', error);
    throw new Error('Database is currently unavailable. Please try again later.');
  }
}

export async function deleteBlog(id: string) {
  try {
    const blogId = parseInt(id, 10);
    if (isNaN(blogId)) {
      return false;
    }

    await prisma.blog.delete({
      where: { id: blogId },
    });
    
    return true;
  } catch (error: any) {
    if (error.code === 'P2025') {
      return false;
    }
    console.error('Failed to delete blog in database.', error);
    throw new Error('Database is currently unavailable. Please try again later.');
  }
}
