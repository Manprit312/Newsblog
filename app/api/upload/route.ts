import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getCurrentUser } from '@/lib/auth';
import '@/lib/suppress-warnings';

// Configure Cloudinary
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

// Console log to check environment variables (server-side only)
console.log('=== Cloudinary Environment Check ===');
console.log('CLOUDINARY_CLOUD_NAME:', cloudName ? '✅ Set' : '❌ Missing');
console.log('CLOUDINARY_API_KEY:', apiKey ? '✅ Set' : '❌ Missing');
console.log('CLOUDINARY_API_SECRET:', apiSecret ? '✅ Set' : '❌ Missing');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing');
console.log('NODE_ENV:', process.env.NODE_ENV || 'Not set');
console.log('===================================');

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
  console.log('✅ Cloudinary configured successfully');
} else {
  console.error('❌ Cloudinary configuration incomplete. Missing:', {
    cloudName: !cloudName,
    apiKey: !apiKey,
    apiSecret: !apiSecret,
  });
}

export const runtime = 'nodejs';
export const maxDuration = 30; // Vercel max duration for Pro plan
export const dynamic = 'force-dynamic'; // Ensure this is a dynamic route

export async function POST(request: NextRequest) {
  // Ensure we always return JSON, even on unexpected errors
  // Wrap everything in try-catch to prevent Vercel from returning HTML error pages
  try {
    // Check authentication - wrap in try-catch to prevent HTML error pages
    let user = null;
    let authErrorOccurred = false;
    
    try {
      // Use Promise.resolve to catch any synchronous errors
      user = await Promise.resolve(getCurrentUser()).catch((err) => {
        authErrorOccurred = true;
        console.error('Auth check promise error:', err?.message || err);
        return null;
      });
    } catch (authError: any) {
      // Log but don't throw - return JSON error instead
      authErrorOccurred = true;
      console.error('Auth check error:', authError?.message || authError);
    }

    // If auth check failed or user is null, return JSON error
    if (authErrorOccurred || !user) {
      return NextResponse.json(
        { 
          success: false, 
          error: authErrorOccurred 
            ? 'Authentication check failed. Please log in again.' 
            : 'Unauthorized. Please log in.',
          code: authErrorOccurred ? 'AUTH_ERROR' : 'UNAUTHORIZED'
        },
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          }
        }
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
        { 
          success: false, 
          error: 'Image upload service is not configured. Please check environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API or CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).',
          code: 'CONFIG_ERROR'
        },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          }
        }
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
        { 
          success: false, 
          error: 'Image upload service configuration error. Please check environment variables.',
          code: 'CONFIG_ERROR'
        },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    let formData;
    try {
      formData = await request.formData();
    } catch (formError: any) {
      console.error('FormData parsing error:', formError?.message || formError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid form data',
          code: 'FORM_DATA_ERROR'
        },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No file provided',
          code: 'NO_FILE'
        },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    // Validate file type
    if (!file.type || !file.type.startsWith('image/')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'File must be an image',
          code: 'INVALID_FILE_TYPE'
        },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    // Validate file size (4.5MB limit for Vercel - they have 4.5MB limit on Hobby plan)
    // Vercel Pro plan allows up to 4.5MB for serverless functions
    const maxSize = 4.5 * 1024 * 1024; // 4.5MB (Vercel's limit)
    if (file.size > maxSize) {
      return NextResponse.json(
        { 
          success: false, 
          error: `File size must be less than 4.5MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB. Please compress the image or use a smaller file.`,
          code: 'FILE_TOO_LARGE',
          fileSize: file.size,
          maxSize: maxSize
        },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    let bytes;
    try {
      bytes = await file.arrayBuffer();
    } catch (bufferError: any) {
      console.error('File buffer error:', bufferError?.message || bufferError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to read file',
          code: 'FILE_READ_ERROR'
        },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          }
        }
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
        { 
          success: false, 
          error: 'Upload failed: Invalid response from image service',
          code: 'INVALID_RESPONSE'
        },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error: any) {
    // Log full error details for debugging
    const errorDetails = {
      message: error?.message,
      name: error?.name,
      http_code: error?.http_code,
    };
    console.error('Upload error:', errorDetails);
    
    // Always return JSON, never HTML - this is critical for Vercel
    let errorMessage = error?.message || error?.toString() || 'Failed to upload image. Please try again.';
    let statusCode = 500;
    let errorCode = 'UPLOAD_ERROR';
    
    // Handle specific error cases
    if (errorMessage.includes('413') || errorMessage.includes('Payload Too Large') || errorMessage.includes('Request Entity Too Large')) {
      errorMessage = 'File size is too large. Vercel has a 4.5MB limit. Please compress your image or use a smaller file.';
      statusCode = 413;
      errorCode = 'PAYLOAD_TOO_LARGE';
    } else if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
      errorMessage = 'Upload timed out. Please try again with a smaller file.';
      statusCode = 408;
      errorCode = 'TIMEOUT';
    }
    
    // Sanitize error message to avoid exposing sensitive info
    const safeErrorMessage = errorMessage.includes('<!DOCTYPE') 
      ? 'Server error: Invalid response format. Please check server logs.'
      : errorMessage;
    
    return NextResponse.json(
      { 
        success: false, 
        error: safeErrorMessage,
        code: errorCode,
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { 
        status: statusCode,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        }
      }
    );
  }
}












