# Quick Start Guide - Sales Gym

## 🚀 Deploy to Render in 10 Minutes

### Step 1: Deploy API Backend (3 minutes)

1. **Go to Render**: https://render.com
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure**:
   - Name: `sales-gym-api`
   - Environment: `Node`
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Add Environment Variable** (CRITICAL):
   - Key: `VAPI_API_KEY`
   - Value: `[YOUR_VAPI_KEY_HERE]`
6. **Deploy** and copy the URL (e.g., `https://sales-gym-api.onrender.com`)

### Step 2: Deploy Frontend (5 minutes)

1. **Click "New +" → "Static Site"**
2. **Connect same repository**
3. **Configure**:
   - Name: `sales-gym`
   - Build Command: `npm run build:static`
   - Publish Directory: `dist`
4. **Add Environment Variable**:
   - Key: `EXPO_PUBLIC_API_URL`
   - Value: `[YOUR_API_URL_FROM_STEP_1]`
5. **Deploy**

### Step 3: Keep Server Awake (2 minutes)

**Option A - Built-in (Already working)**
The app automatically pings every 5 minutes.

**Option B - UptimeRobot (Recommended)**
1. Go to https://uptimerobot.com
2. Create free account
3. Add monitor:
   - URL: `https://sales-gym-api.onrender.com/health`
   - Interval: 5 minutes

### ✅ Done!

Visit your Render static site URL and tap the microphone to start practicing!

---

## 🔒 Security Checklist

- [ ] VAPI API key added to Render (not in code)
- [ ] `.env` file NOT committed to Git
- [ ] API URL configured in frontend
- [ ] Both services deployed and running

---

## 🎯 How to Use

1. **Open the app** in your browser
2. **Tap the green microphone button**
3. **Allow microphone permissions**
4. **Start speaking** - practice your sales pitch
5. **AI responds** as a potential customer
6. **Tap red button** to end the call

---

## 🐛 Troubleshooting

**"Failed to load config"**
→ Check API service is running and URL is correct

**Microphone not working**
→ Grant browser permissions (check address bar icon)

**Cold start delay**
→ Set up UptimeRobot to keep server awake

**API key error**
→ Verify VAPI_API_KEY is set in Render environment

---

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
