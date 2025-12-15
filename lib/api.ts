import { prisma } from './prisma';

interface GetBlogsOptions {
  published?: boolean;
  featured?: boolean;
  category?: string;
  limit?: number;
  skip?: number;
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
    if (options.category) {
      where.category = options.category;
    }

    const blogs = await prisma.blog.findMany({
      where,
      orderBy: [
        ...(options.featured !== undefined && options.featured
          ? [{ featured: 'desc' as const }]
          : []),
        { createdAt: 'desc' as const },
      ],
      take: options.limit || 10,
      skip: options.skip || 0,
    });

    return blogs.map((blog) => ({
      ...blog,
      _id: blog.id,
      createdAt: blog.createdAt.toISOString(),
      updatedAt: blog.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error('Failed to load blogs from database, returning empty list.', error);
    return [];
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    const blog = await prisma.blog.findUnique({
      where: { slug },
    });

    if (!blog) return null;

    // Increment views
    await prisma.blog.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });

    return {
      ...blog,
      _id: blog.id,
      createdAt: blog.createdAt.toISOString(),
      updatedAt: blog.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('Failed to load blog by slug from database.', error);
    return null;
  }
}

export async function getBlogById(id: string) {
  try {
    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) return null;

    return {
      ...blog,
      _id: blog.id,
      createdAt: blog.createdAt.toISOString(),
      updatedAt: blog.updatedAt.toISOString(),
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
    const blog = await prisma.blog.create({
      data,
    });

    return {
      ...blog,
      _id: blog.id,
      createdAt: blog.createdAt.toISOString(),
      updatedAt: blog.updatedAt.toISOString(),
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
    const blog = await prisma.blog.update({
      where: { id },
      data,
    });

    return {
      ...blog,
      _id: blog.id,
      createdAt: blog.createdAt.toISOString(),
      updatedAt: blog.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('Failed to update blog in database.', error);
    throw new Error('Database is currently unavailable. Please try again later.');
  }
}

export async function deleteBlog(id: string) {
  try {
    await prisma.blog.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    console.error('Failed to delete blog in database.', error);
    throw new Error('Database is currently unavailable. Please try again later.');
  }
}
