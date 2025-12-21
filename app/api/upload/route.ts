import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getCurrentUser } from '@/lib/auth';
import '@/lib/suppress-warnings';

// Configure Cloudinary
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

// Console log to check environment variables (server-side only)
// This runs when the module loads, so it will show in Vercel logs
console.log('=== Cloudinary Environment Check (Module Load) ===');
console.log('NODE_ENV:', process.env.NODE_ENV || 'Not set');
console.log('VERCEL_ENV:', process.env.VERCEL_ENV || 'Not on Vercel');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing');
console.log('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing');
console.log('CLOUDINARY_API:', process.env.CLOUDINARY_API ? '✅ Set' : '❌ Missing');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing');
console.log('Final values:');
console.log('  - Cloud Name:', cloudName || 'MISSING');
console.log('  - API Key:', apiKey ? 'SET' : 'MISSING');
console.log('  - API Secret:', apiSecret ? 'SET' : 'MISSING');
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
  // Log environment check on each request (for Vercel debugging)
  console.log('=== Upload Request Environment Check ===');
  console.log('VERCEL_ENV:', process.env.VERCEL_ENV || 'Not on Vercel');
  console.log('Cloud Name available:', !!cloudName);
  console.log('API Key available:', !!apiKey);
  console.log('API Secret available:', !!apiSecret);
  console.log('========================================');
  
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

    // Log upload attempt details for Vercel debugging
    console.log('Starting Cloudinary upload:', {
      fileSize: buffer.length,
      fileType: file.type,
      fileName: file.name,
      isVercel: !!process.env.VERCEL,
      vercelEnv: process.env.VERCEL_ENV,
    });

    // Wrap upload in Promise with timeout and better error handling
    // Use base64 upload method for better compatibility with serverless functions
    const result = await Promise.race([
      new Promise(async (resolve, reject) => {
        try {
          // Try using upload_stream first (more efficient)
          // If that fails, fall back to base64 upload
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'newsblogs',
              resource_type: 'image',
              timeout: 60000, // 60 second timeout
              // Add Vercel-specific settings
              use_filename: true,
              unique_filename: true,
              overwrite: false,
              // Disable eager transformations for faster uploads
              eager: undefined,
            },
            (error, result) => {
              if (error) {
                // Log full error details for debugging
                console.error('Cloudinary upload_stream error:', {
                  message: error.message,
                  http_code: error.http_code,
                  name: error.name,
                  isVercel: !!process.env.VERCEL,
                  vercelEnv: process.env.VERCEL_ENV,
                  error: error,
                  // Try to extract more details if available
                  ...(error.response && { response: error.response }),
                  ...(error.statusCode && { statusCode: error.statusCode }),
                });
                
                // If upload_stream fails, try base64 upload as fallback
                // This sometimes works better with serverless functions
                console.log('Attempting fallback to base64 upload...');
                const base64String = buffer.toString('base64');
                const dataUri = `data:${file.type};base64,${base64String}`;
                
                cloudinary.uploader.upload(
                  dataUri,
                  {
                    folder: 'newsblogs',
                    resource_type: 'image',
                    use_filename: true,
                    unique_filename: true,
                    overwrite: false,
                  },
                  (fallbackError, fallbackResult) => {
                    if (fallbackError) {
                      console.error('Cloudinary base64 upload also failed:', {
                        message: fallbackError.message,
                        http_code: fallbackError.http_code,
                        name: fallbackError.name,
                      });
                      
                      // Check if it's an authentication/configuration error
                      let errorMessage = fallbackError.message || error.message || 'Unknown error';
                      if (fallbackError.http_code === 401 || error.http_code === 401 || errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
                        errorMessage = 'Cloudinary authentication failed. Please check your API credentials and Cloudinary account settings.';
                      } else if (fallbackError.http_code === 400 || error.http_code === 400 || errorMessage.includes('400')) {
                        errorMessage = 'Invalid request to Cloudinary. Please check your file format and size.';
                      } else if (fallbackError.http_code === 500 || error.http_code === 500 || errorMessage.includes('500') || errorMessage.includes('<!DOCTYPE')) {
                        errorMessage = 'Cloudinary server error (500). This may indicate: 1) Invalid credentials, 2) Account restrictions, 3) Domain/IP blocking. Check Cloudinary dashboard Settings → Security for allowed domains/IPs.';
                      } else if (errorMessage.includes('timeout') || errorMessage.includes('ETIMEDOUT')) {
                        errorMessage = 'Cloudinary upload timed out. This can happen on Vercel. Try with a smaller image or check your Cloudinary account limits.';
                      }
                      
                      reject(new Error(`Cloudinary upload failed: ${errorMessage}`));
                    } else if (!fallbackResult || !fallbackResult.secure_url) {
                      reject(new Error('Cloudinary returned invalid response'));
                    } else {
                      console.log('✅ Cloudinary base64 upload successful (fallback method)');
                      resolve(fallbackResult);
                    }
                  }
                );
              } else if (!result || !result.secure_url) {
                console.error('Cloudinary returned invalid result:', result);
                // Try base64 fallback
                const base64String = buffer.toString('base64');
                const dataUri = `data:${file.type};base64,${base64String}`;
                cloudinary.uploader.upload(
                  dataUri,
                  {
                    folder: 'newsblogs',
                    resource_type: 'image',
                    use_filename: true,
                    unique_filename: true,
                  },
                  (fallbackError, fallbackResult) => {
                    if (fallbackError || !fallbackResult?.secure_url) {
                      reject(new Error('Cloudinary returned invalid response'));
                    } else {
                      console.log('✅ Cloudinary base64 upload successful (fallback)');
                      resolve(fallbackResult);
                    }
                  }
                );
              } else {
                console.log('✅ Cloudinary upload_stream successful:', {
                  public_id: result.public_id,
                  format: result.format,
                  bytes: result.bytes,
                });
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












