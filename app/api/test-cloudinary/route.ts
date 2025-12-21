import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getCurrentUser } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get Cloudinary config
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({
        success: false,
        error: 'Cloudinary environment variables not set',
        missing: {
          cloudName: !cloudName,
          apiKey: !apiKey,
          apiSecret: !apiSecret,
        }
      }, { status: 500 });
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    // Test Cloudinary connection by getting account details
    // This will fail if credentials are invalid
    try {
      const pingResult = await cloudinary.api.ping();
      console.log('Cloudinary ping result:', pingResult);
      
      return NextResponse.json({
        success: true,
        message: 'Cloudinary credentials are valid',
        cloudName: cloudName,
        // Don't expose actual keys
        hasApiKey: !!apiKey,
        hasApiSecret: !!apiSecret,
        ping: pingResult,
      });
    } catch (pingError: any) {
      console.error('Cloudinary ping failed:', {
        message: pingError.message,
        http_code: pingError.http_code,
        name: pingError.name,
        error: pingError,
      });

      // Try to get more details
      let errorMessage = 'Cloudinary connection failed';
      if (pingError.http_code === 401) {
        errorMessage = 'Invalid Cloudinary credentials. Please check your API key and secret.';
      } else if (pingError.http_code === 403) {
        errorMessage = 'Cloudinary access forbidden. Please check your account permissions.';
      } else if (pingError.message?.includes('<!DOCTYPE')) {
        errorMessage = 'Cloudinary returned HTML error page. This usually means invalid credentials or account issues.';
      }

      return NextResponse.json({
        success: false,
        error: errorMessage,
        details: {
          http_code: pingError.http_code,
          message: pingError.message,
          name: pingError.name,
        },
        cloudName: cloudName,
        hasApiKey: !!apiKey,
        hasApiSecret: !!apiSecret,
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Test Cloudinary error:', error);
    return NextResponse.json({
      success: false,
      error: error?.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
    }, { status: 500 });
  }
}

