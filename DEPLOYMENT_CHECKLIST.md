# Production Deployment Checklist

Use this checklist to ensure your application is properly configured for production.

## Pre-Deployment

### Backend (Render)

- [ ] **Environment Variables Set:**
  - [ ] `PORT=10000` (or Render's assigned port)
  - [ ] `NODE_ENV=production`
  - [ ] `MONGODB_URI` - Your MongoDB connection string
  - [ ] `JWT_SECRET` - Strong secret (32+ characters)
  - [ ] `JWT_REFRESH_SECRET` - Strong secret (32+ characters)
  - [ ] `JWT_EXPIRE=15m`
  - [ ] `JWT_REFRESH_EXPIRE=7d`
  - [ ] `FRONTEND_URL` - Your Vercel URL (e.g., `https://your-app.vercel.app`)
  - [ ] `ADMIN_EMAIL=admin@gdcnagrota.edu.in` (or your choice)
  - [ ] `ADMIN_PASSWORD=admin123` (CHANGE THIS AFTER FIRST LOGIN!)

- [ ] **Build Settings:**
  - [ ] Build Command: `cd backend && npm install`
  - [ ] Start Command: `cd backend && npm start`
  - [ ] Root Directory: `backend` (if deploying from monorepo)

### Frontend (Vercel)

- [ ] **Environment Variables Set:**
  - [ ] `VITE_API_URL` - Your Render backend URL + `/api` (e.g., `https://your-backend.onrender.com/api`)

- [ ] **Build Settings:**
  - [ ] Framework Preset: `Vite`
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `dist`
  - [ ] Install Command: `npm install`

## Post-Deployment

### Verify Backend

- [ ] **Check Server Logs:**
  - [ ] MongoDB connection successful
  - [ ] Admin user created (or already exists message)
  - [ ] Server running on correct port
  - [ ] No CORS errors

- [ ] **Test API Endpoints:**
  - [ ] Health check: `GET https://your-backend.onrender.com/api/health`
  - [ ] Should return: `{ status: 'OK', message: 'E-Library API is running' }`

### Verify Frontend

- [ ] **Check Browser Console:**
  - [ ] API Base URL is correct
  - [ ] No CORS errors
  - [ ] Environment variables loaded

- [ ] **Test Basic Navigation:**
  - [ ] Homepage loads
  - [ ] Can navigate to login pages
  - [ ] Can navigate to register page

### Test Authentication Flow

- [ ] **Registration:**
  - [ ] Go to `/register`
  - [ ] Fill form and submit
  - [ ] Success message appears
  - [ ] User created in MongoDB with `status: 'pending'`

- [ ] **Admin Login:**
  - [ ] Go to `/admin-login`
  - [ ] Login with default credentials
  - [ ] Redirects to `/admin-dashboard`
  - [ ] Can see pending students

- [ ] **Student Approval:**
  - [ ] As admin, approve a pending student
  - [ ] Student status changes to `approved`

- [ ] **Student Login:**
  - [ ] Go to `/student-login`
  - [ ] Login with approved student credentials
  - [ ] Redirects to `/home` (NOT back to login!)
  - [ ] Can access protected pages

- [ ] **Logout:**
  - [ ] Click logout
  - [ ] Redirects to `/login-selector`
  - [ ] Cannot access protected pages

## Security Checklist

- [ ] **Changed Default Admin Password:**
  - [ ] Logged in as admin
  - [ ] Changed password from `admin123`
  - [ ] Using strong password (12+ characters)

- [ ] **JWT Secrets:**
  - [ ] Using strong, random secrets (32+ characters)
  - [ ] Different secrets for access and refresh tokens
  - [ ] Secrets not committed to git

- [ ] **MongoDB Security:**
  - [ ] Strong database password
  - [ ] IP whitelist configured (if using MongoDB Atlas)
  - [ ] Network access restricted

- [ ] **Environment Variables:**
  - [ ] All sensitive values in environment variables
  - [ ] No secrets in code
  - [ ] `.env` files in `.gitignore`

## Monitoring

- [ ] **Set Up Log Monitoring:**
  - [ ] Check Render logs regularly
  - [ ] Set up error alerts (if available)
  - [ ] Monitor API response times

- [ ] **Set Up Database Monitoring:**
  - [ ] Monitor MongoDB connection
  - [ ] Check database size
  - [ ] Monitor query performance

## Troubleshooting

If something doesn't work:

1. **Check Logs:**
   - Render dashboard → Your service → Logs
   - Browser DevTools → Console

2. **Verify Environment Variables:**
   - All required variables are set
   - Values are correct (no typos)
   - URLs include correct protocol (https://)

3. **Test API Directly:**
   - Use Postman or curl to test endpoints
   - Check if backend is responding
   - Verify CORS headers

4. **Check Network:**
   - Verify backend URL is accessible
   - Check if MongoDB is accessible from Render
   - Verify DNS is resolving correctly

## Quick Reference

### Default Admin Credentials
- **Email:** `admin@gdcnagrota.edu.in`
- **Password:** `admin123` ⚠️ **CHANGE THIS!**

### Important URLs
- **Backend API:** `https://your-backend.onrender.com/api`
- **Frontend:** `https://your-app.vercel.app`
- **Health Check:** `https://your-backend.onrender.com/api/health`

### Key Endpoints
- **Register:** `POST /api/auth/register`
- **Student Login:** `POST /api/auth/login/student`
- **Admin Login:** `POST /api/auth/login/admin`
- **Get Current User:** `GET /api/auth/me`
- **Refresh Token:** `POST /api/auth/refresh`

## Support

If you encounter issues:
1. Check `PRODUCTION_FIXES.md` for detailed solutions
2. Check `ADMIN_CREDENTIALS.md` for admin-related issues
3. Review server logs and browser console
4. Verify all environment variables are set correctly

