# Production Authentication Fixes

This document outlines all the fixes applied to resolve authentication issues in production (Render + Vercel).

## Issues Fixed

### 1. CORS Configuration
**Problem:** Backend CORS was only allowing a single origin, causing requests from Vercel to fail.

**Solution:**
- Updated CORS to support multiple origins (localhost for dev, Vercel for production)
- Added dynamic origin checking that allows any Vercel deployment URL
- Added proper credentials support

**File:** `backend/server.js`

### 2. Axios Configuration
**Problem:** Frontend axios instance wasn't configured with `withCredentials`, which is needed for CORS with credentials.

**Solution:**
- Added `withCredentials: true` to axios instance
- Added timeout configuration (30s for regular requests, 60s for file uploads)
- Improved error logging for debugging

**File:** `src/services/api.js`

### 3. Admin Seeding
**Problem:** Admin user might not exist in production database.

**Solution:**
- Added automatic admin seeding on server startup
- Admin is created if it doesn't exist
- Uses environment variables for admin credentials

**File:** `backend/server.js`

### 4. Redirect Logic
**Problem:** After successful login, users were being redirected back to login page due to authentication check failures.

**Solution:**
- Improved authentication state management
- Added session storage check before backend verification
- Better error handling for network issues
- Fixed redirect logic to prevent loops

**File:** `src/App.jsx`

### 5. Error Handling
**Problem:** Poor error logging made debugging production issues difficult.

**Solution:**
- Added comprehensive error logging
- Added request logging for auth endpoints
- Better error messages for debugging

**Files:** `backend/middleware/errorHandler.js`, `backend/server.js`, `src/services/api.js`

## Environment Variables Required

### Backend (Render)
Set these in Render dashboard → Environment:

```env
PORT=10000
NODE_ENV=production

# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string
MONGO_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_chars
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Frontend URL (Your Vercel URL)
FRONTEND_URL=https://your-frontend.vercel.app

# Admin Credentials
ADMIN_EMAIL=admin@gdcnagrota.edu.in
ADMIN_PASSWORD=admin123
```

**Important:** 
- Change `ADMIN_PASSWORD` to a strong password after first login
- Use strong JWT secrets (32+ characters)
- Update `FRONTEND_URL` with your actual Vercel deployment URL

### Frontend (Vercel)
Set this in Vercel dashboard → Settings → Environment Variables:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

**Important:**
- Replace `your-backend.onrender.com` with your actual Render backend URL
- The URL must include `/api` at the end

## Admin Credentials

After deployment, the admin user is automatically created with:

- **Email:** `admin@gdcnagrota.edu.in` (or value from `ADMIN_EMAIL` env var)
- **Password:** `admin123` (or value from `ADMIN_PASSWORD` env var)

**⚠️ IMPORTANT:** Change the admin password immediately after first login!

## Testing Checklist

After deployment, test the following:

1. **Registration:**
   - [ ] Go to `/register`
   - [ ] Fill out registration form
   - [ ] Submit registration
   - [ ] Verify success message appears
   - [ ] Check MongoDB to verify user was created with `status: 'pending'`

2. **Admin Login:**
   - [ ] Go to `/admin-login`
   - [ ] Login with admin credentials
   - [ ] Verify redirect to `/admin-dashboard`
   - [ ] Verify admin can see pending students

3. **Student Approval:**
   - [ ] As admin, go to manage students
   - [ ] Find pending student
   - [ ] Approve the student
   - [ ] Verify status changes to `approved`

4. **Student Login:**
   - [ ] Go to `/student-login`
   - [ ] Login with approved student credentials
   - [ ] Verify redirect to `/home` (not back to login)
   - [ ] Verify student can access protected pages

5. **Token Refresh:**
   - [ ] Login as student
   - [ ] Wait 15 minutes (or modify JWT_EXPIRE for testing)
   - [ ] Make an API request
   - [ ] Verify token is automatically refreshed
   - [ ] Verify user stays logged in

6. **Logout:**
   - [ ] Click logout
   - [ ] Verify redirect to `/login-selector`
   - [ ] Verify tokens are cleared
   - [ ] Verify cannot access protected pages

## Common Issues & Solutions

### Issue: CORS Errors in Browser Console
**Solution:**
1. Verify `FRONTEND_URL` in Render matches your Vercel URL exactly
2. Check that CORS middleware is before routes in `server.js`
3. Ensure `withCredentials: true` is set in axios config

### Issue: "Invalid token" or "Token expired" errors
**Solution:**
1. Check JWT secrets are set correctly in Render
2. Verify tokens are being stored in localStorage
3. Check browser console for network errors
4. Verify token refresh endpoint is working

### Issue: Users redirected back to login after successful login
**Solution:**
1. Check browser console for API errors
2. Verify `getCurrentUser` endpoint is working
3. Check that tokens are being stored correctly
4. Verify CORS is allowing the request

### Issue: Admin user doesn't exist
**Solution:**
1. Check server logs for admin seeding errors
2. Manually run seed script: `npm run seed` in Render shell
3. Verify MongoDB connection is working
4. Check environment variables are set correctly

### Issue: Registration fails silently
**Solution:**
1. Check browser console for errors
2. Check Render logs for backend errors
3. Verify MongoDB connection
4. Check that all required fields are being sent

## Debugging Tips

### Backend Logs (Render)
1. Go to Render dashboard → Your service → Logs
2. Look for:
   - MongoDB connection messages
   - Admin seeding messages
   - CORS warnings
   - Error messages

### Frontend Logs (Browser)
1. Open browser DevTools (F12)
2. Check Console tab for:
   - API Base URL logs
   - Error messages
   - Network errors
3. Check Network tab for:
   - Failed requests (red)
   - CORS errors
   - 401/403 responses

### Network Debugging
1. Check request headers:
   - `Authorization: Bearer <token>` should be present
   - `Origin` header should match your Vercel URL
2. Check response headers:
   - `Access-Control-Allow-Origin` should include your Vercel URL
   - `Access-Control-Allow-Credentials: true` should be present

## Security Recommendations

1. **Change Default Admin Password:** Immediately after first login
2. **Use Strong JWT Secrets:** Minimum 32 characters, random strings
3. **Enable HTTPS:** Automatic on Render and Vercel
4. **MongoDB Security:** 
   - Use strong database password
   - Whitelist Render IPs in MongoDB Atlas
   - Enable MongoDB Atlas authentication
5. **Environment Variables:** Never commit `.env` files to git
6. **Rate Limiting:** Consider adding rate limiting for auth endpoints

## Next Steps

1. Deploy updated code to Render and Vercel
2. Set all environment variables
3. Verify admin user is created (check logs)
4. Test registration and login flows
5. Change admin password
6. Monitor logs for any errors

## Support

If issues persist:
1. Check Render logs for backend errors
2. Check browser console for frontend errors
3. Verify all environment variables are set
4. Test API endpoints directly using Postman/curl
5. Check MongoDB connection and data

