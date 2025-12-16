import { query } from './db';
import { ObjectId } from 'mongodb';

interface GetBlogsOptions {
  published?: boolean;
  featured?: boolean;
  category?: string;
  limit?: number;
  skip?: number;
}

// Type for MongoDB blog document
type BlogDocument = {
  _id?: ObjectId;
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

const formatDate = (date: Date | string | undefined): string => {
  if (!date) return new Date().toISOString();
  if (date instanceof Date) {
    return date.toISOString();
  }
  if (typeof date === 'string') {
    return date;
  }
  return new Date(date).toISOString();
};

const formatBlog = (blog: BlogDocument) => {
  return {
    ...blog,
    _id: blog._id?.toString() || blog._id,
    id: blog._id?.toString() || blog._id,
    createdAt: formatDate(blog.createdAt),
    updatedAt: formatDate(blog.updatedAt),
  };
};

export async function getBlogs(options: GetBlogsOptions = {}) {
  try {
    const filter: any = {};

    if (options.published !== undefined) {
      filter.published = options.published;
    }
    if (options.featured !== undefined) {
      filter.featured = options.featured;
    }
    if (options.category) {
      filter.category = options.category;
    }

    const sort: any = {};
    if (options.featured !== undefined && options.featured) {
      sort.featured = -1;
    }
    sort.createdAt = -1;

    const result = await query<BlogDocument>(
      'blogs',
      async (collection) => {
        let cursor = collection.find(filter).sort(sort);

        if (options.skip) {
          cursor = cursor.skip(options.skip);
        }
        if (options.limit) {
          cursor = cursor.limit(options.limit);
        }

        return await cursor.toArray();
      }
    );

    return result.map(formatBlog);
  } catch (error: any) {
    const isConnectionError = 
      error.code === 'ETIMEDOUT' || 
      error.message?.includes('timeout') ||
      error.message?.includes('Connection terminated') ||
      error.cause?.message?.includes('Connection terminated') ||
      error.code === 'ECONNREFUSED' ||
      error.code === 'ENOTFOUND';
    
    if (!isConnectionError) {
      console.error('Failed to load blogs from database, returning empty list.', error);
    }
    return [];
  }
}

export async function getBlogBySlug(slug: string, incrementViews: boolean = false) {
  try {
    const result = await query<BlogDocument>(
      'blogs',
      async (collection) => {
        return await collection.findOne({ slug });
      }
    );
    
    if (!result) return null;

    const blog = result as BlogDocument;

    // Only increment views at runtime, not during static generation
    if (incrementViews) {
      await query(
        'blogs',
        async (collection) => {
          return await collection.updateOne(
            { slug },
            { $inc: { views: 1 } }
          );
        }
      );
    }

    return formatBlog(blog);
  } catch (error) {
    console.error('Failed to load blog by slug from database.', error);
    return null;
  }
}

export async function getBlogById(id: string) {
  try {
    const result = await query<BlogDocument>(
      'blogs',
      async (collection) => {
        const objectId = ObjectId.isValid(id) ? new ObjectId(id) : id;
        return await collection.findOne({ _id: objectId });
      }
    );
    
    if (!result) return null;

    return formatBlog(result as BlogDocument);
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
    const blogData: BlogDocument = {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      featuredImage: data.featuredImage,
      category: data.category || 'General',
      tags: data.tags || [],
      author: data.author || 'Admin',
      published: data.published || false,
      featured: data.featured || false,
      views: 0,
      createdAt: now,
      updatedAt: now,
    };

    const result = await query<BlogDocument>(
      'blogs',
      async (collection) => {
        const insertResult = await collection.insertOne(blogData);
        return await collection.findOne({ _id: insertResult.insertedId });
      }
    );

    return formatBlog(result as BlogDocument);
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
    const updates: any = {
      updatedAt: new Date(),
    };

    if (data.title !== undefined) updates.title = data.title;
    if (data.slug !== undefined) updates.slug = data.slug;
    if (data.excerpt !== undefined) updates.excerpt = data.excerpt;
    if (data.content !== undefined) updates.content = data.content;
    if (data.featuredImage !== undefined) updates.featuredImage = data.featuredImage;
    if (data.category !== undefined) updates.category = data.category;
    if (data.tags !== undefined) updates.tags = data.tags;
    if (data.author !== undefined) updates.author = data.author;
    if (data.published !== undefined) updates.published = data.published;
    if (data.featured !== undefined) updates.featured = data.featured;

    if (Object.keys(updates).length === 1) {
      // Only updatedAt, just return the existing blog
      return await getBlogById(id);
    }

    const objectId = ObjectId.isValid(id) ? new ObjectId(id) : id;
    
    const result = await query<BlogDocument>(
      'blogs',
      async (collection) => {
        const updateResult = await collection.findOneAndUpdate(
          { _id: objectId },
          { $set: updates },
          { returnDocument: 'after' }
        );
        return updateResult;
      }
    );
    
    if (!result) {
      throw new Error('Blog not found');
    }

    return formatBlog(result as BlogDocument);
  } catch (error) {
    console.error('Failed to update blog in database.', error);
    throw new Error('Database is currently unavailable. Please try again later.');
  }
}

export async function deleteBlog(id: string) {
  try {
    const objectId = ObjectId.isValid(id) ? new ObjectId(id) : id;
    
    const result = await query(
      'blogs',
      async (collection) => {
        return await collection.deleteOne({ _id: objectId });
      }
    );
    
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Failed to delete blog in database.', error);
    throw new Error('Database is currently unavailable. Please try again later.');
  }
}
