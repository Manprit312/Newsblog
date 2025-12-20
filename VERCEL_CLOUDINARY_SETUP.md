# Cloudinary Setup for Vercel

## Issue
Getting error: "Server return invalid JSON response. Status Code 500" when uploading images on Vercel.

## Solution

### 1. Verify Environment Variables in Vercel

Go to your Vercel project dashboard:
1. Navigate to **Settings** → **Environment Variables**
2. Add/verify these variables for **Production**, **Preview**, and **Development**:

```env
CLOUDINARY_CLOUD_NAME=dylwallze
CLOUDINARY_API=448792944728376
CLOUDINARY_API_SECRET=pNLvplH25u-YY86oVjcggrPjkdo
```

**Important Notes:**
- Variable names must match exactly (case-sensitive)
- Make sure there are no extra spaces
- Add them to all environments (Production, Preview, Development)
- **Redeploy** after adding/updating environment variables

### 2. Verify Cloudinary Account

1. Go to [Cloudinary Dashboard](https://console.cloudinary.com/)
2. Check your account status
3. Verify your API credentials match the environment variables
4. Check if your account has any usage limits

### 3. Test Upload Route

After deploying, test the upload endpoint:

```bash
curl -X POST https://your-app.vercel.app/api/upload \
  -H "Cookie: auth-token=your-token" \
  -F "file=@test-image.jpg"
```

### 4. Check Vercel Logs

If issues persist:
1. Go to Vercel Dashboard → Your Project → **Deployments**
2. Click on the latest deployment
3. Check **Function Logs** for detailed error messages
4. Look for Cloudinary-related errors

### 5. Common Issues

**Issue: "Invalid API key"**
- Solution: Verify `CLOUDINARY_API` matches your Cloudinary API Key (not API Secret)

**Issue: "Authentication failed"**
- Solution: Check `CLOUDINARY_API_SECRET` is correct

**Issue: "Account limit exceeded"**
- Solution: Check your Cloudinary plan limits

**Issue: "HTML instead of JSON response"**
- Solution: This means the route is crashing. Check Vercel function logs for the actual error.

### 6. Debugging Steps

1. **Check environment variables are loaded:**
   - Add temporary logging in the upload route
   - Check Vercel function logs

2. **Test locally first:**
   ```bash
   npm run dev
   # Test upload locally to verify it works
   ```

3. **Verify Cloudinary credentials:**
   - Test with Cloudinary SDK directly
   - Use Cloudinary's test upload tool

### 7. After Fixing

1. **Redeploy** your application on Vercel
2. **Clear browser cache** if needed
3. **Test upload** again
4. **Check logs** if issues persist

## Updated Code

The upload route has been updated with:
- Better error handling
- Promise timeout protection
- Stream error handling
- Always returns JSON (never HTML)
- Better logging for debugging

Make sure to redeploy after updating environment variables!



