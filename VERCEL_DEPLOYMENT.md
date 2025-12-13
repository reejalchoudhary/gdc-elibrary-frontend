# Complete Frontend Deployment Guide - GitHub to Vercel

## 🚀 Step-by-Step: Push to GitHub → Deploy to Vercel

---

## STEP 1: Prepare Frontend for GitHub

### 1.1 Verify .gitignore
Make sure `.gitignore` includes:
```
node_modules/
.env
dist/
```

### 1.2 Check Current Status
```powershell
# In root directory (C:\gdc-e-library)
git status
```

---

## STEP 2: Push Frontend to GitHub

### 2.1 Initialize Git (if not already done)
```powershell
# In root directory
git init
```

### 2.2 Add All Files
```powershell
# Add all files (except .env which is ignored)
git add .
```

### 2.3 Commit Changes
```powershell
git commit -m "Frontend ready for Vercel deployment - Connected to Render backend"
```

### 2.4 Create GitHub Repository

**Option A: Via GitHub Website**
1. Go to [github.com](https://github.com) and login
2. Click **"+"** → **"New repository"**
3. Repository name: `gdc-elibrary-frontend` (or your preferred name)
4. Description: `GDC E-Library Frontend - React + Vite`
5. Choose **Public** or **Private**
6. **DO NOT** check "Initialize with README"
7. Click **"Create repository"**

### 2.5 Add Remote and Push
```powershell
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/gdc-elibrary-frontend.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

### 2.6 Verify on GitHub
- Go to your repository
- Verify all files are there
- **Confirm `.env` is NOT visible** (it's in .gitignore)

---

## STEP 3: Deploy to Vercel

### 3.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Sign up with **GitHub** (recommended for easy integration)
4. Authorize Vercel to access your repositories

### 3.2 Import Project

1. **Click "Add New..."** → **"Project"**

2. **Import Git Repository:**
   - Find `gdc-elibrary-frontend` in the list
   - Click **"Import"**

3. **Configure Project:**
   - **Project Name:** `gdc-elibrary-frontend` (or your choice)
   - **Framework Preset:** `Vite` (should auto-detect)
   - **Root Directory:** `./` (leave as is)
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** `dist` (auto-filled)
   - **Install Command:** `npm install` (auto-filled)

4. **Environment Variables:**
   Click **"Add"** and add:
   
   **Key:** `VITE_API_URL`  
   **Value:** `https://gdc-elibrary-backend-z0cz.onrender.com/api`
   
   Click **"Add"** again to save.

5. **Click "Deploy"**

### 3.3 Wait for Deployment
- Vercel will:
  1. Clone your repository
  2. Install dependencies (`npm install`)
  3. Build the project (`npm run build`)
  4. Deploy to production
- **Time:** 2-4 minutes
- Watch the build logs for progress

### 3.4 Get Your Frontend URL
Once deployed, you'll see:
- **Production URL:** `https://gdc-elibrary-frontend.vercel.app` (or similar)
- **Deployment Status:** Ready

---

## STEP 4: Update Backend CORS

After frontend is deployed, update backend CORS:

### 4.1 Go to Render Dashboard
1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click on your backend service: `gdc-elibrary-backend`

### 4.2 Update Environment Variable
1. Go to **"Environment"** tab
2. Find `FRONTEND_URL`
3. Click **"Edit"**
4. Update to your Vercel URL:
   ```
   https://gdc-elibrary-frontend.vercel.app
   ```
   (Replace with your actual Vercel URL)
5. Click **"Save Changes"**
6. Service will automatically redeploy

---

## STEP 5: Test the Application

### 5.1 Test Frontend
1. Visit your Vercel URL
2. Open browser console (F12)
3. Check Network tab
4. All API calls should go to: `https://gdc-elibrary-backend-z0cz.onrender.com/api`

### 5.2 Test Features
1. **Register:** Create a new student account
2. **Admin Login:** Login as admin
3. **Approve Student:** Approve the registered student
4. **Student Login:** Login as approved student
5. **Upload File:** Upload a book/note/PYQ
6. **View Content:** Check if content appears
7. **Discussion:** Post a message

---

## 📋 Complete Command Sequence

### Push to GitHub:
```powershell
# 1. Navigate to root directory
cd C:\gdc-e-library

# 2. Initialize git (if not done)
git init

# 3. Add files
git add .

# 4. Commit
git commit -m "Frontend ready for Vercel deployment"

# 5. Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/gdc-elibrary-frontend.git

# 6. Push
git branch -M main
git push -u origin main
```

### Deploy on Vercel:
1. Go to vercel.com
2. Import GitHub repository
3. Set environment variable: `VITE_API_URL=https://gdc-elibrary-backend-z0cz.onrender.com/api`
4. Deploy

---

## ✅ Verification Checklist

After deployment:

- [ ] Frontend URL is accessible
- [ ] Backend CORS updated with Vercel URL
- [ ] Environment variable set in Vercel
- [ ] API calls go to Render backend
- [ ] Registration works
- [ ] Login works
- [ ] File upload works
- [ ] Content displays correctly

---

## 🔄 Updating After Changes

### After Making Code Changes:
```powershell
git add .
git commit -m "Description of changes"
git push origin main
```

Vercel will **automatically redeploy** when you push to main branch.

---

## 🎉 Success!

Your frontend is now live on Vercel and connected to Render backend!

**Frontend URL:** `https://gdc-elibrary-frontend.vercel.app`  
**Backend URL:** `https://gdc-elibrary-backend-z0cz.onrender.com/api`

---

## 📝 Important Notes

1. **Environment Variable:**
   - Set `VITE_API_URL` in Vercel dashboard
   - Don't commit `.env` file (it's in .gitignore)

2. **Auto-Deploy:**
   - Vercel auto-deploys on push to main branch
   - Can be disabled in Vercel settings

3. **CORS:**
   - Update `FRONTEND_URL` in Render after Vercel deployment
   - Backend will redeploy automatically

4. **Build Errors:**
   - Check Vercel build logs
   - Verify all dependencies in package.json
   - Check Node.js version (Vercel uses 18.x by default)

---

## 🐛 Troubleshooting

### Build Fails on Vercel:
- Check build logs in Vercel dashboard
- Verify `package.json` has all dependencies
- Check for TypeScript errors (if any)

### API Calls Fail:
- Verify `VITE_API_URL` is set in Vercel
- Check backend CORS settings
- Verify backend is running on Render

### CORS Errors:
- Update `FRONTEND_URL` in Render
- Restart backend service
- Check browser console for specific errors

---

**Ready to deploy! Follow the steps above.** 🚀

