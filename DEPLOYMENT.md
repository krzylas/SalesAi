# Sales Gym - Deployment Guide

## Overview
This guide will help you deploy the Sales Gym app with secure API key management using Render.

## Architecture
- **Frontend**: Static web app (React Native Web)
- **Backend**: Node.js API server that securely stores and serves the Deepgram API key
- **Hosting**: Render.com (both frontend and backend)

---

## Step 1: Deploy the API Backend (Secure API Key Storage)

### 1.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up or log in with GitHub

### 1.2 Deploy API Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `sales-gym-api`
   - **Environment**: `Node`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or paid for better performance)

### 1.3 Add Environment Variable (CRITICAL - API Key Security)
1. In the Render dashboard, go to your API service
2. Click **"Environment"** tab
3. Add environment variable:
   - **Key**: `DEEPGRAM_API_KEY`
   - **Value**: `your-actual-deepgram-api-key-here`
4. Click **"Save Changes"

**IMPORTANT**: Never commit your API key to Git. It's only stored in Render's secure environment.

### 1.4 Note Your API URL
After deployment, Render will provide a URL like:
```
https://sales-gym-api.onrender.com
```
**Save this URL** - you'll need it for the frontend.

---

## Step 2: Deploy the Frontend (Static Site)

### 2.1 Update Environment Configuration
1. Create a `.env` file in your project root:
   ```bash
   EXPO_PUBLIC_API_URL=https://sales-gym-api.onrender.com
   ```
   Replace with your actual API URL from Step 1.4

2. **DO NOT** commit `.env` to Git (it's already in `.gitignore`)

### 2.2 Build the Static Site
```bash
npm run build:static
```

### 2.3 Deploy to Render
1. Click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `sales-gym`
   - **Build Command**: `npm run build:static`
   - **Publish Directory**: `dist`

### 2.4 Add Environment Variable for Frontend
1. In the static site settings, go to **"Environment"**
2. Add:
   - **Key**: `EXPO_PUBLIC_API_URL`
   - **Value**: `https://sales-gym-api.onrender.com` (your API URL)

---

## Step 3: Keep-Alive Configuration (Prevent Cold Starts)

Render's free tier puts services to sleep after 15 minutes of inactivity. The app includes automatic keep-alive pinging, but you can also use external services:

### Option 1: Built-in Keep-Alive (Already Configured)
The app automatically pings your API every 5 minutes to keep it awake.

### Option 2: External Monitoring (Recommended for Production)
Use a free service like [UptimeRobot](https://uptimerobot.com):
1. Create a free account
2. Add a new monitor:
   - **Monitor Type**: HTTP(s)
   - **URL**: `https://sales-gym-api.onrender.com/health`
   - **Monitoring Interval**: 5 minutes
3. This will ping your API regularly to prevent cold starts

---

## Step 4: Testing

### 4.1 Test API Endpoint
Visit: `https://sales-gym-api.onrender.com/health`

You should see:
```json
{"status":"ok","timestamp":"2025-12-28T..."}
```

### 4.2 Test Frontend
1. Visit your Render static site URL
2. Click the microphone button
3. Grant microphone permissions
4. The app should connect and start the sales practice session

---

## Security Best Practices

✅ **DO**:
- Store API keys only in Render environment variables
- Use HTTPS for all API calls
- Keep `.env` files in `.gitignore`
- Rotate API keys regularly

❌ **DON'T**:
- Commit API keys to Git
- Share API keys in chat/email
- Store keys in frontend code
- Use the same key for dev and production

---

## Troubleshooting

### API Key Not Working
1. Check Render environment variables are set correctly
2. Verify the API service is running (check logs)
3. Ensure frontend has correct `EXPO_PUBLIC_API_URL`

### Cold Start Issues
1. Enable UptimeRobot monitoring
2. Consider upgrading to a paid Render plan
3. Check keep-alive pings in browser console

### CORS Errors
The API is configured with CORS enabled. If you still see errors:
1. Check the API URL is correct
2. Verify the API service is deployed and running
3. Check browser console for specific error messages

---

## Local Development

### Run API Server Locally
```bash
cd server
npm install
$env:DEEPGRAM_API_KEY="your-test-key"; npm start
```

### Run Frontend Locally
```bash
EXPO_PUBLIC_API_URL=http://localhost:3001 npm start
```

---

## Production Checklist

- [ ] API service deployed to Render
- [ ] DEEPGRAM_API_KEY environment variable set in Render
- [ ] API URL noted and saved
- [ ] Frontend environment variable configured
- [ ] Static site built and deployed
- [ ] Keep-alive monitoring configured
- [ ] Microphone permissions tested
- [ ] Sales call functionality tested
- [ ] API key security verified (not in Git)

---

## Support

For issues or questions:
1. Check Render logs for errors
2. Verify environment variables are set
3. Test API endpoint directly
4. Check browser console for frontend errors

---

**Your app is now deployed with secure API key management!** 🎉
