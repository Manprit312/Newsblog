import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - Fetch all settings
export async function GET(req: NextRequest) {
  try {
    // Check if settings table exists by trying to query it
    // If it doesn't exist, return empty array
    try {
      const settings = await prisma.$queryRaw`
        SELECT id, setting_key, setting_value, setting_type, description, created_at, updated_at
        FROM site_settings
        ORDER BY setting_key ASC
      ` as any[];

      return NextResponse.json({
        success: true,
        settings: settings.map((s: any) => ({
          id: s.id,
          setting_key: s.setting_key,
          setting_value: s.setting_value,
          setting_type: s.setting_type || "text",
          description: s.description,
          createdAt: s.created_at,
          updatedAt: s.updated_at,
        })),
      });
    } catch (error: any) {
      // If table doesn't exist, return empty array
      if (error.code === "42P01") {
        return NextResponse.json({
          success: true,
          settings: [],
        });
      }
      throw error;
    }
  } catch (error: any) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch settings", error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new setting
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Check if settings table exists
    try {
      const result = await prisma.$queryRaw`
        INSERT INTO site_settings (setting_key, setting_value, setting_type, description, created_at, updated_at)
        VALUES (${body.setting_key}, ${body.setting_value || null}, ${body.setting_type || "text"}, ${body.description || null}, NOW(), NOW())
        RETURNING id, setting_key, setting_value, setting_type, description, created_at, updated_at
      ` as any[];

      const setting = result[0];

      return NextResponse.json(
        { 
          success: true, 
          setting: {
            id: setting.id,
            setting_key: setting.setting_key,
            setting_value: setting.setting_value,
            setting_type: setting.setting_type,
            description: setting.description,
            createdAt: setting.created_at,
            updatedAt: setting.updated_at,
          }
        },
        { status: 201 }
      );
    } catch (error: any) {
      if (error.code === "42P01") {
        return NextResponse.json(
          { success: false, message: "Settings table does not exist. Please create it first." },
          { status: 400 }
        );
      }
      throw error;
    }
  } catch (error: any) {
    console.error("Error creating setting:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create setting", error: error.message },
      { status: 400 }
    );
  }
}



