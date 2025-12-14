# Quick Fix Guide - "Cannot GET /api" and Login Errors

## Issues Fixed

### 1. "Cannot GET /api" Error
**Problem:** Backend was missing a route handler for `/api` endpoint.

**Fix Applied:**
- Added `/api` route handler that returns API information
- Added 404 handler for undefined API routes with helpful error messages

**File:** `backend/server.js`

### 2. Login Errors - "An error occurred. Please try again."
**Problem:** Generic error messages didn't help identify the actual issue (CORS, network, server errors).

**Fix Applied:**
- Improved error handling in all login/register components
- Added detailed error logging to console
- Better error messages that distinguish between:
  - Server errors (with status codes)
  - Network errors (connection issues)
  - Other errors

**Files:**
- `src/pages/Login/StudentLogin.jsx`
- `src/pages/Login/AdminLogin.jsx`
- `src/pages/Register.jsx`

## Testing Steps

### 1. Test Backend API Endpoints

Open these URLs in your browser to verify backend is working:

1. **Root API:** 
   ```
   https://gdc-elibrary-backend-z0cz.onrender.com/api
   ```
   Should return JSON with API information

2. **Health Check:**
   ```
   https://gdc-elibrary-backend-z0cz.onrender.com/api/health
   ```
   Should return: `{"status":"OK","message":"E-Library API is running"}`

3. **Test Registration (using browser console or Postman):**
   ```javascript
   fetch('https://gdc-elibrary-backend-z0cz.onrender.com/api/auth/register', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       name: 'Test User',
       email: 'test@example.com',
       password: 'test123',
       rollno: '12345',
       department: 'BCA',
       year: '1st Semester',
       mobile: '1234567890'
     })
   })
   .then(r => r.json())
   .then(console.log)
   .catch(console.error);
   ```

### 2. Check Frontend Configuration

1. **Verify Environment Variable:**
   - Open browser console on your Vercel site
   - Look for: `🔗 API Base URL: ...`
   - Should show: `https://gdc-elibrary-backend-z0cz.onrender.com/api`

2. **Check for CORS Errors:**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Try to login
   - Look for CORS errors (red messages)

### 3. Common Issues & Solutions

#### Issue: "Cannot connect to server"
**Possible Causes:**
- Backend is sleeping (free tier on Render)
- Wrong API URL in frontend
- Network connectivity issues

**Solutions:**
1. Wake up backend by visiting: `https://gdc-elibrary-backend-z0cz.onrender.com/api/health`
2. Wait 30-60 seconds for backend to start
3. Verify `VITE_API_URL` in Vercel environment variables
4. Check Render logs for errors

#### Issue: CORS Errors
**Error Message:** `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solutions:**
1. Verify `FRONTEND_URL` in Render matches your Vercel URL exactly
2. Check Render logs for CORS warnings
3. Ensure backend has restarted after environment variable changes

#### Issue: "Invalid token" or 401 errors
**Solutions:**
1. Clear browser localStorage and sessionStorage
2. Try logging in again
3. Check if JWT secrets are set in Render
4. Verify tokens are being stored after login

#### Issue: "Cannot GET /api" still appears
**Solutions:**
1. Verify backend code is deployed (check Render Events tab)
2. Check that `backend/server.js` has the `/api` route handler
3. Restart the backend service in Render
4. Clear browser cache and try again

## Debugging Checklist

- [ ] Backend is running (check Render dashboard)
- [ ] Backend health check works: `/api/health`
- [ ] Backend `/api` endpoint works: `/api`
- [ ] Frontend `VITE_API_URL` is set correctly in Vercel
- [ ] Frontend console shows correct API Base URL
- [ ] No CORS errors in browser console
- [ ] Network tab shows requests reaching backend
- [ ] Backend logs show incoming requests
- [ ] MongoDB connection is working (check Render logs)

## Next Steps

1. **Deploy Updated Code:**
   - Push changes to GitHub
   - Render will auto-deploy backend
   - Vercel will auto-deploy frontend

2. **Verify Environment Variables:**
   - **Render (Backend):**
     - `FRONTEND_URL` = Your Vercel URL
     - All other variables from previous setup
   
   - **Vercel (Frontend):**
     - `VITE_API_URL` = `https://gdc-elibrary-backend-z0cz.onrender.com/api`

3. **Test Again:**
   - Try accessing `/api` endpoint
   - Try registration
   - Try login
   - Check browser console for detailed error messages

## Still Having Issues?

1. **Check Browser Console:**
   - Open DevTools (F12)
   - Look at Console tab for errors
   - Look at Network tab for failed requests

2. **Check Render Logs:**
   - Go to Render dashboard
   - Click on your backend service
   - Go to "Logs" tab
   - Look for errors or warnings

3. **Test API Directly:**
   - Use Postman or curl to test endpoints
   - This bypasses frontend and helps isolate issues

4. **Verify URLs:**
   - Backend: `https://gdc-elibrary-backend-z0cz.onrender.com`
   - Frontend: Your Vercel URL
   - Make sure they match in environment variables

