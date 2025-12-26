# Fixing Cloudinary Upload Issues on Vercel

If image uploads work locally but fail on Vercel, follow these steps:

## 1. Check Cloudinary Security Settings

Cloudinary might be blocking requests from Vercel's IP addresses. Check these settings:

1. Go to https://console.cloudinary.com/
2. Navigate to **Settings → Security**
3. Check the following:

### Allowed HTTP referrers (URL signing)
- Leave this **empty** or add your Vercel domain: `*.vercel.app` and your custom domain
- If you have restrictions here, Vercel requests might be blocked

### Allowed fetch domains
- Add: `*.vercel.app` and your custom domain
- This allows Cloudinary to fetch resources from Vercel

### Restricted media types
- Make sure this doesn't block image uploads

### IP ranges
- If you have IP restrictions, you may need to allow Vercel's IP ranges
- Vercel uses dynamic IPs, so IP restrictions can cause issues

## 2. Verify Environment Variables on Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Ensure these are set (case-sensitive):
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY` (or `CLOUDINARY_API`)
   - `CLOUDINARY_API_SECRET`
3. Make sure they're set for **Production** environment
4. **Redeploy** after adding/updating variables

## 3. Test Your Configuration

Visit: `https://your-domain.vercel.app/api/check-env`

This will show which environment variables are available.

## 4. Check Vercel Logs

1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment
3. Click **View Function Logs** or **Runtime Logs**
4. Look for "Cloudinary upload error" messages
5. Check the error code:
   - **401**: Invalid credentials
   - **403**: Access forbidden (check security settings)
   - **500**: Server error (could be domain/IP blocking)

## 5. Common Solutions

### Solution A: Remove Domain Restrictions
In Cloudinary Settings → Security:
- Clear "Allowed HTTP referrers" (or add `*.vercel.app`)
- Clear IP restrictions if set

### Solution B: Use Base64 Upload (Automatic Fallback)
The code now automatically falls back to base64 upload if stream upload fails. This works better with serverless functions.

### Solution C: Check Cloudinary Account Status
- Ensure your Cloudinary account is active
- Check if you've hit any usage limits
- Verify your account isn't suspended

## 6. Test Upload

After making changes:
1. Redeploy on Vercel
2. Try uploading an image
3. Check Vercel logs for detailed error messages
4. The improved error messages will guide you to the specific issue

## Debugging

The upload route now includes:
- Automatic fallback to base64 upload
- Detailed error logging
- Vercel-specific error messages
- Environment variable checking

Check `/api/check-env` endpoint to verify environment variables are accessible on Vercel.




