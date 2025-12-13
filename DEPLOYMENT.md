# Deployment Guide

This guide will help you deploy the GDC E-Library application to production.

## 🚀 Deployment Architecture

- **Backend**: Render (Node.js + Express + MongoDB)
- **Frontend**: Vercel (React + Vite)
- **Database**: MongoDB Atlas (Cloud)
- **File Storage**: Cloudinary

---

## 📦 Backend Deployment (Render)

### Step 1: Prepare Backend

1. **Push backend to GitHub:**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial backend commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Create MongoDB Atlas Database:**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get connection string
   - Add your IP to network access

### Step 2: Deploy to Render

1. **Go to [render.com](https://render.com)** and sign up/login

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository with your backend

3. **Configure Service:**
   - **Name**: `gdc-elibrary-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: `backend`

4. **Set Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gdc-elibrary
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-characters
   JWT_EXPIRE=15m
   JWT_REFRESH_EXPIRE=7d
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   FRONTEND_URL=https://your-frontend.vercel.app
   ADMIN_EMAIL=admin@gdcnagrota.edu.in
   ADMIN_PASSWORD=admin123
   ```

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL: `https://gdc-elibrary-backend.onrender.com`

6. **Seed Admin User:**
   - Once deployed, run the seed script:
   ```bash
   # SSH into Render or use Render Shell
   cd backend
   npm run seed
   ```

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. **Update Environment Variables:**
   - Create `.env.production` file:
   ```env
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

2. **Update CORS in Backend:**
   - Make sure `FRONTEND_URL` in backend includes your Vercel URL

### Step 2: Deploy to Vercel

1. **Install Vercel CLI (optional):**
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Vercel Dashboard:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `./` (root)
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

3. **Set Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     VITE_API_URL=https://your-backend.onrender.com/api
     ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live at: `https://your-project.vercel.app`

### Alternative: Deploy via CLI

```bash
# In project root
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? gdc-elibrary
# - Directory? ./
# - Override settings? No

# For production:
vercel --prod
```

---

## 🔧 Post-Deployment Setup

### 1. Update Backend CORS

After frontend is deployed, update backend `FRONTEND_URL`:
```
FRONTEND_URL=https://your-frontend.vercel.app
```

### 2. Test the Application

1. **Test Registration:**
   - Register a new student
   - Verify it appears in admin panel

2. **Test Admin Login:**
   - Login as admin
   - Approve a student
   - Verify student can login

3. **Test File Upload:**
   - Upload a book/note/PYQ
   - Verify it appears in listings

4. **Test Discussions:**
   - Post a message
   - Verify it appears for all users

### 3. Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secrets (32+ characters)
- [ ] Enable HTTPS (automatic on Render/Vercel)
- [ ] Set up MongoDB Atlas IP whitelist
- [ ] Review Cloudinary security settings
- [ ] Set up error monitoring (optional)

---

## 🔄 Continuous Deployment

Both Render and Vercel support automatic deployments:

- **Render**: Auto-deploys on push to `main` branch
- **Vercel**: Auto-deploys on push to `main` branch

To disable auto-deploy:
- Render: Settings → Auto-Deploy → Disable
- Vercel: Settings → Git → Disable

---

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Failed:**
- Check MongoDB Atlas network access
- Verify connection string
- Check username/password

**Build Failed:**
- Check Node.js version (should be 16+)
- Verify all dependencies in package.json
- Check build logs in Render dashboard

**CORS Errors:**
- Verify `FRONTEND_URL` matches your Vercel URL
- Check CORS settings in backend

### Frontend Issues

**API Calls Failing:**
- Verify `VITE_API_URL` is set correctly
- Check browser console for errors
- Verify backend is running

**Build Errors:**
- Check Node.js version
- Clear `node_modules` and reinstall
- Check Vercel build logs

---

## 📊 Monitoring

### Render Monitoring

- View logs: Dashboard → Your Service → Logs
- View metrics: Dashboard → Metrics
- Set up alerts: Settings → Alerts

### Vercel Monitoring

- View analytics: Dashboard → Analytics
- View logs: Dashboard → Deployments → View Logs
- Set up monitoring: Settings → Monitoring

---

## 🔐 Environment Variables Summary

### Backend (Render)
```
NODE_ENV=production
PORT=10000
MONGODB_URI=...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
FRONTEND_URL=...
ADMIN_EMAIL=...
ADMIN_PASSWORD=...
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 🎉 Success!

Once deployed, your application will be live at:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-backend.onrender.com/api`

Share the frontend URL with your users!

---

## 📞 Support

If you encounter issues:
1. Check deployment logs
2. Verify environment variables
3. Test API endpoints directly
4. Check browser console for errors

