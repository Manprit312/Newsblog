import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - Get single setting
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    try {
      const result = await prisma.$queryRaw`
        SELECT id, setting_key, setting_value, setting_type, description, created_at, updated_at
        FROM site_settings
        WHERE id = ${parseInt(id)}
      ` as any[];

      if (result.length === 0) {
        return NextResponse.json(
          { success: false, message: "Setting not found" },
          { status: 404 }
        );
      }

      const setting = result[0];
      return NextResponse.json({
        success: true,
        setting: {
          id: setting.id,
          setting_key: setting.setting_key,
          setting_value: setting.setting_value,
          setting_type: setting.setting_type,
          description: setting.description,
          createdAt: setting.created_at,
          updatedAt: setting.updated_at,
        },
      });
    } catch (error: any) {
      if (error.code === "42P01") {
        return NextResponse.json(
          { success: false, message: "Settings table does not exist" },
          { status: 404 }
        );
      }
      throw error;
    }
  } catch (error: any) {
    console.error("Error fetching setting:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch setting", error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update setting
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    try {
      const result = await prisma.$queryRaw`
        UPDATE site_settings
        SET 
          setting_value = COALESCE(${body.setting_value}, setting_value),
          description = COALESCE(${body.description}, description),
          updated_at = NOW()
        WHERE id = ${parseInt(id)}
        RETURNING id, setting_key, setting_value, setting_type, description, created_at, updated_at
      ` as any[];

      if (result.length === 0) {
        return NextResponse.json(
          { success: false, message: "Setting not found" },
          { status: 404 }
        );
      }

      const setting = result[0];
      return NextResponse.json({
        success: true,
        setting: {
          id: setting.id,
          setting_key: setting.setting_key,
          setting_value: setting.setting_value,
          setting_type: setting.setting_type,
          description: setting.description,
          createdAt: setting.created_at,
          updatedAt: setting.updated_at,
        },
      });
    } catch (error: any) {
      if (error.code === "42P01") {
        return NextResponse.json(
          { success: false, message: "Settings table does not exist" },
          { status: 404 }
        );
      }
      throw error;
    }
  } catch (error: any) {
    console.error("Error updating setting:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update setting", error: error.message },
      { status: 400 }
    );
  }
}

// DELETE - Delete setting
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    try {
      const result = await prisma.$queryRaw`
        DELETE FROM site_settings
        WHERE id = ${parseInt(id)}
        RETURNING id
      ` as any[];

      if (result.length === 0) {
        return NextResponse.json(
          { success: false, message: "Setting not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Setting deleted successfully",
      });
    } catch (error: any) {
      if (error.code === "42P01") {
        return NextResponse.json(
          { success: false, message: "Settings table does not exist" },
          { status: 404 }
        );
      }
      throw error;
    }
  } catch (error: any) {
    console.error("Error deleting setting:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete setting", error: error.message },
      { status: 500 }
    );
  }
}



