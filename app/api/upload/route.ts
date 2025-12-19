import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getCurrentUser } from '@/lib/auth';
import '@/lib/suppress-warnings';

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

    // Ensure Cloudinary is configured (reconfigure to be safe)
    try {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
      
      // Verify configuration
      const config = cloudinary.config();
      if (!config.cloud_name || !config.api_key || !config.api_secret) {
        throw new Error('Cloudinary configuration failed');
      }
    } catch (configError: any) {
      console.error('Cloudinary configuration error:', configError);
      return NextResponse.json(
        { success: false, error: 'Image upload service configuration error. Please check environment variables.' },
        { status: 500 }
      );
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

    // Wrap upload in Promise with timeout and better error handling
    const result = await Promise.race([
      new Promise((resolve, reject) => {
        try {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'newsblogs',
              resource_type: 'image',
              timeout: 60000, // 60 second timeout
            },
            (error, result) => {
              if (error) {
                console.error('Cloudinary upload error:', {
                  message: error.message,
                  http_code: error.http_code,
                  name: error.name,
                });
                reject(new Error(`Cloudinary upload failed: ${error.message || 'Unknown error'}`));
              } else if (!result || !result.secure_url) {
                reject(new Error('Cloudinary returned invalid response'));
              } else {
                resolve(result);
              }
            }
          );
          
          // Handle stream errors
          uploadStream.on('error', (streamError: any) => {
            console.error('Upload stream error:', streamError);
            reject(new Error(`Upload stream error: ${streamError.message || 'Unknown error'}`));
          });
          
          uploadStream.end(buffer);
        } catch (streamError: any) {
          console.error('Failed to create upload stream:', streamError);
          reject(new Error(`Failed to create upload stream: ${streamError.message || 'Unknown error'}`));
        }
      }),
      new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Upload timeout: Request took too long'));
        }, 55000); // 55 second timeout (less than Cloudinary's 60s)
      }),
    ]).catch((error: any) => {
      // Ensure all errors are properly formatted
      throw new Error(error?.message || error?.toString() || 'Upload failed');
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
    // Log full error details for debugging
    console.error('Upload error:', {
      message: error?.message,
      name: error?.name,
      stack: error?.stack,
      http_code: error?.http_code,
    });
    
    // Always return JSON, never HTML
    const errorMessage = error?.message || error?.toString() || 'Failed to upload image. Please try again.';
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}












