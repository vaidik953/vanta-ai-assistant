# 🚀 Vanta AI Assistant - Vercel Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)
- Git installed on your computer

## Step-by-Step Deployment Process

### 1. 📁 Prepare Your Repository

#### Option A: Initialize Git Repository Locally
```bash
# Navigate to your project directory
cd c:\Users\vaidi\OneDrive\Desktop\Qoder\AI\ai-assistant

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Vanta AI Assistant"
```

#### Option B: Upload to GitHub
1. Go to https://github.com and create a new repository
2. Name it `vanta-ai-assistant` or your preferred name
3. Choose "Public" or "Private" based on your preference
4. Don't initialize with README (since you have existing code)

### 2. 🔗 Connect Repository to GitHub

```bash
# Add GitHub remote (replace with your GitHub username and repo name)
git remote add origin https://github.com/YOUR_USERNAME/vanta-ai-assistant.git

# Push code to GitHub
git branch -M main
git push -u origin main
```

### 3. 🌐 Deploy on Vercel

#### Method 1: Vercel Dashboard (Recommended)
1. **Go to Vercel Dashboard**: Visit https://vercel.com/dashboard
2. **Import Project**: Click "Add New..." → "Project"
3. **Import Git Repository**: 
   - Select "Import Git Repository"
   - Choose your GitHub repository
   - Click "Import"

4. **Configure Project**:
   - **Project Name**: `vanta-ai-assistant`
   - **Framework Preset**: Next.js (should be auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

#### Method 2: Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd c:\Users\vaidi\OneDrive\Desktop\Qoder\AI\ai-assistant
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (Select your account)
# - Link to existing project? N
# - Project name: vanta-ai-assistant
# - Directory: ./
# - Override settings? N
```

### 4. 🔐 Configure Environment Variables

**CRITICAL**: You need to add your Gemini API key securely:

1. **In Vercel Dashboard**:
   - Go to your project dashboard
   - Click "Settings" → "Environment Variables"
   - Add the following variables:

```
GEMINI_API_KEY = AIzaSyBQxSwZCYVUQd_hfEan9BTt9y-qxqNpYmk
NEXT_PUBLIC_APP_NAME = Vanta
NEXT_PUBLIC_APP_VERSION = 1.0.0
```

2. **Variable Settings**:
   - Environment: Production, Preview, Development
   - Click "Save" for each variable

### 5. 🔄 Redeploy with Environment Variables

After adding environment variables:
1. Go to "Deployments" tab
2. Click the three dots (...) on the latest deployment
3. Select "Redeploy"
4. Choose "Use existing Build Cache" and click "Redeploy"

### 6. 🎯 Custom Domain (Optional)

1. **In Vercel Dashboard**:
   - Go to "Settings" → "Domains"
   - Add your custom domain (e.g., `vanta.yourdomain.com`)
   - Follow DNS configuration instructions

### 7. ✅ Verify Deployment

1. **Check Build Logs**:
   - Go to "Deployments" tab
   - Click on the latest deployment
   - Review build logs for any errors

2. **Test Your Application**:
   - Visit your Vercel URL (e.g., `https://vanta-ai-assistant.vercel.app`)
   - Test all features:
     - Chat functionality
     - Math rendering
     - History management
     - Mobile responsiveness

### 8. 🔧 Troubleshooting Common Issues

#### Build Failures
- Check the build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Fix any TypeScript errors

#### Environment Variables Not Working
- Verify variable names are correct
- Ensure they're added to all environments (Production, Preview, Development)
- Redeploy after adding variables

#### API Key Issues
- Double-check your Gemini API key is valid
- Ensure it's added as `GEMINI_API_KEY` in environment variables
- Check API quotas and billing in Google Cloud Console

### 9. 📱 Performance Optimization

Your app includes several optimizations:
- ✅ Next.js App Router for optimal performance
- ✅ Tailwind CSS for small bundle size
- ✅ Framer Motion for smooth animations
- ✅ Responsive design for all devices
- ✅ Error boundaries for graceful error handling

### 10. 🚀 Continuous Deployment

Once connected:
- Every push to `main` branch triggers automatic deployment
- Preview deployments for pull requests
- Rollback capability through Vercel dashboard

## 📋 Quick Checklist

- [ ] Code pushed to GitHub repository
- [ ] Project imported to Vercel
- [ ] Environment variables configured
- [ ] Build successful
- [ ] Application accessible via Vercel URL
- [ ] All features working correctly
- [ ] Custom domain configured (if desired)

## 🎉 Success!

Your Vanta AI Assistant is now live on Vercel! Share your deployed URL with others to showcase your beautiful glassmorphic AI interface.

**Pro Tips**:
- Monitor usage through Vercel Analytics
- Set up custom error pages if needed
- Consider upgrading to Vercel Pro for advanced features
- Use Vercel's edge functions for enhanced performance

## 📞 Support

If you encounter issues:
1. Check Vercel documentation: https://vercel.com/docs
2. Review build logs in your Vercel dashboard
3. Ensure your GitHub repository is accessible
4. Verify environment variables are correctly set