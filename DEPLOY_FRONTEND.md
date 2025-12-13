# Quick Frontend Deployment - GitHub to Vercel

## 🚀 Complete Steps

---

## PART 1: Push to GitHub

### Step 1: Initialize Git (if not done)
```powershell
# Make sure you're in root directory
cd C:\gdc-e-library

# Initialize git
git init
```

### Step 2: Add and Commit Files
```powershell
# Add all files (except .env which is ignored)
git add .

# Commit
git commit -m "Frontend ready for Vercel deployment"
```

### Step 3: Create GitHub Repository
1. Go to [github.com](https://github.com) → Login
2. Click **"+"** → **"New repository"**
3. Name: `gdc-elibrary-frontend`
4. **DO NOT** initialize with README
5. Click **"Create repository"**

### Step 4: Push to GitHub
```powershell
# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/gdc-elibrary-frontend.git

# Push
git branch -M main
git push -u origin main
```

---

## PART 2: Deploy to Vercel

### Step 1: Sign Up/Login to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with **GitHub** (recommended)

### Step 2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Find `gdc-elibrary-frontend` → Click **"Import"**

### Step 3: Configure Project
- **Framework:** Vite (auto-detected)
- **Root Directory:** `./` (default)
- **Build Command:** `npm run build` (auto)
- **Output Directory:** `dist` (auto)

### Step 4: Set Environment Variable
**IMPORTANT:** Before clicking Deploy, add environment variable:

1. Click **"Environment Variables"**
2. Click **"Add"**
3. **Key:** `VITE_API_URL`
4. **Value:** `https://gdc-elibrary-backend-z0cz.onrender.com/api`
5. Click **"Add"** to save

### Step 5: Deploy
1. Click **"Deploy"**
2. Wait 2-4 minutes
3. Get your frontend URL: `https://gdc-elibrary-frontend.vercel.app`

---

## PART 3: Update Backend CORS

### Step 1: Go to Render Dashboard
1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click on `gdc-elibrary-backend` service

### Step 2: Update FRONTEND_URL
1. Go to **"Environment"** tab
2. Find `FRONTEND_URL`
3. Click **"Edit"**
4. Update to: `https://gdc-elibrary-frontend.vercel.app`
   (Use your actual Vercel URL)
5. Click **"Save Changes"**
6. Backend will auto-redeploy

---

## ✅ Test

1. Visit your Vercel URL
2. Open browser console (F12)
3. Check Network tab
4. All API calls should go to Render backend
5. Test registration, login, upload

---

## 🎉 Done!

**Frontend:** `https://gdc-elibrary-frontend.vercel.app`  
**Backend:** `https://gdc-elibrary-backend-z0cz.onrender.com/api`

Both are live and connected! 🚀

