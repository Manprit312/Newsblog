import { NextResponse } from 'next/server';

export async function GET() {
  // This is a server-side route, so we can access all environment variables
  const envCheck = {
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing',
      apiKey: process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing',
      apiSecret: process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing',
    },
    database: {
      url: process.env.DATABASE_URL ? '✅ Set' : '❌ Missing',
    },
    nodeEnv: process.env.NODE_ENV || 'Not set',
  };

  // Log to server console (visible in terminal/server logs)
  console.log('=== Environment Variables Check ===');
  console.log('Cloudinary Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing');
  console.log('Cloudinary API Key:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing');
  console.log('Cloudinary API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing');
  console.log('Database URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing');
  console.log('NODE_ENV:', process.env.NODE_ENV || 'Not set');
  console.log('===================================');

  // Return safe response (don't expose actual values)
  return NextResponse.json({
    success: true,
    message: 'Check server console/logs for detailed environment variable status',
    envCheck,
    // Only show if values exist, not the actual values for security
    hasCloudinary: !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ),
    hasDatabase: !!process.env.DATABASE_URL,
  });
}

