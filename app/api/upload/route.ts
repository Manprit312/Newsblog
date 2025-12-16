import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getCurrentUser } from '@/lib/auth';

// Configure Cloudinary
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

export const runtime = 'nodejs';
export const maxDuration = 30; // Vercel max duration for Pro plan
export const dynamic = 'force-dynamic'; // Ensure this is a dynamic route

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    let user;
    try {
      user = await getCurrentUser();
    } catch (authError: any) {
      console.error('Auth check error:', authError);
      return NextResponse.json(
        { success: false, error: 'Authentication failed' },
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check Cloudinary configuration
    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Cloudinary configuration missing:', {
        cloudName: cloudName || 'MISSING',
        apiKey: apiKey ? 'SET' : 'MISSING',
        apiSecret: apiSecret ? 'SET' : 'MISSING',
        envVars: {
          CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'MISSING',
          CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING',
          CLOUDINARY_API: process.env.CLOUDINARY_API ? 'SET' : 'MISSING',
          CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING',
        }
      });
      return NextResponse.json(
        { success: false, error: 'Image upload service is not configured. Please check environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API or CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).' },
        { status: 500 }
      );
    }

    // Ensure Cloudinary is configured
    if (!cloudinary.config().cloud_name) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
    }

    let formData;
    try {
      formData = await request.formData();
    } catch (formError: any) {
      console.error('FormData parsing error:', formError);
      return NextResponse.json(
        { success: false, error: 'Invalid form data' },
        { status: 400 }
      );
    }

    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type || !file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    let bytes;
    try {
      bytes = await file.arrayBuffer();
    } catch (bufferError: any) {
      console.error('File buffer error:', bufferError);
      return NextResponse.json(
        { success: false, error: 'Failed to read file' },
        { status: 500 }
      );
    }

    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'newsblogs',
          resource_type: 'image',
          timeout: 60000, // 60 second timeout
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      
      uploadStream.end(buffer);
    });

    const uploadResult = result as any;
    if (!uploadResult || !uploadResult.secure_url) {
      return NextResponse.json(
        { success: false, error: 'Upload failed: Invalid response from image service' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    // Always return JSON, never HTML
    return NextResponse.json(
      { 
        success: false, 
        error: error?.message || error?.toString() || 'Failed to upload image. Please try again.' 
      },
      { status: 500 }
    );
  }
}












