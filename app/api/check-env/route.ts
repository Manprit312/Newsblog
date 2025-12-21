import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  // This is a server-side route, so we can access all environment variables
  // Check all possible environment variable names
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  
  const envCheck = {
    cloudinary: {
      cloudName: cloudName ? '✅ Set' : '❌ Missing',
      apiKey: apiKey ? '✅ Set' : '❌ Missing',
      apiSecret: apiSecret ? '✅ Set' : '❌ Missing',
      // Show which env var names are being used
      usingCloudName: cloudName ? (process.env.CLOUDINARY_CLOUD_NAME ? 'CLOUDINARY_CLOUD_NAME' : 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME') : 'None',
      usingApiKey: apiKey ? (process.env.CLOUDINARY_API_KEY ? 'CLOUDINARY_API_KEY' : 'CLOUDINARY_API') : 'None',
    },
    database: {
      url: process.env.DATABASE_URL ? '✅ Set' : '❌ Missing',
    },
    nodeEnv: process.env.NODE_ENV || 'Not set',
    vercel: {
      env: process.env.VERCEL_ENV || 'Not on Vercel',
      url: process.env.VERCEL_URL || 'Not set',
    },
    // Check all possible env var names
    allEnvVars: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing',
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing',
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing',
      CLOUDINARY_API: process.env.CLOUDINARY_API ? '✅ Set' : '❌ Missing',
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing',
    },
  };

  // Log to server console (visible in terminal/server logs)
  console.log('=== Environment Variables Check ===');
  console.log('NODE_ENV:', process.env.NODE_ENV || 'Not set');
  console.log('VERCEL_ENV:', process.env.VERCEL_ENV || 'Not on Vercel');
  console.log('Cloudinary Cloud Name (CLOUDINARY_CLOUD_NAME):', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing');
  console.log('Cloudinary Cloud Name (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME):', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing');
  console.log('Cloudinary API Key (CLOUDINARY_API_KEY):', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing');
  console.log('Cloudinary API Key (CLOUDINARY_API):', process.env.CLOUDINARY_API ? '✅ Set' : '❌ Missing');
  console.log('Cloudinary API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing');
  console.log('Database URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing');
  console.log('Final values being used:');
  console.log('  - Cloud Name:', cloudName || 'MISSING');
  console.log('  - API Key:', apiKey ? 'SET' : 'MISSING');
  console.log('  - API Secret:', apiSecret ? 'SET' : 'MISSING');
  console.log('===================================');

  // Return safe response (don't expose actual values)
  return NextResponse.json({
    success: true,
    message: 'Check server console/logs for detailed environment variable status',
    envCheck,
    // Only show if values exist, not the actual values for security
    hasCloudinary: !!(cloudName && apiKey && apiSecret),
    hasDatabase: !!process.env.DATABASE_URL,
    // Show which values are being used (without exposing secrets)
    usingValues: {
      cloudName: cloudName || null,
      hasApiKey: !!apiKey,
      hasApiSecret: !!apiSecret,
    },
  });
}

