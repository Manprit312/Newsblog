import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Get blog stats
    const totalBlogs = await prisma.blog.count();
    const publishedBlogs = await prisma.blog.count({
      where: { published: true },
    });
    const featuredBlogs = await prisma.blog.count({
      where: { featured: true },
    });
    
    const blogsWithViews = await prisma.blog.aggregate({
      _sum: {
        views: true,
      },
    });
    const totalViews = blogsWithViews._sum.views || 0;

    // Get category counts
    const categoryCounts = await prisma.$queryRaw`
      SELECT 
        c.name as category,
        COUNT(b.id)::int as count
      FROM categories c
      LEFT JOIN news_blogs b ON b.category_id = c.id AND b.published = true
      GROUP BY c.id, c.name
      ORDER BY count DESC
    ` as any[];

    // Get category stats
    const totalCategories = await prisma.category.count();
    const activeCategories = await prisma.category.count({
      where: { active: true },
    });

    const stats = {
      blogs: {
        total: totalBlogs,
        published: publishedBlogs,
        featured: featuredBlogs,
        totalViews: totalViews,
        categoryCounts: categoryCounts.map((cat: any) => ({
          category: cat.category || "Uncategorized",
          count: parseInt(cat.count) || 0,
        })),
      },
      categories: {
        total: totalCategories,
        active: activeCategories,
      },
    };

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch dashboard stats", error: error.message },
      { status: 500 }
    );
  }
}

