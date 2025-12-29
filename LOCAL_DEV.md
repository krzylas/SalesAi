# Local Development Setup

## ✅ Quick Start

Your app runs with:
- **API Server**: http://localhost:3001
- **Expo Dev Server**: Running (check terminal for QR code)

## 🔄 To Run Again Later

### Terminal 1 - API Server
```powershell
cd server
$env:DEEPGRAM_API_KEY="your-deepgram-key-here"
npm start
```

### Terminal 2 - Expo App
```powershell
npx expo start
```

Then press `w` to open in browser.

## 🌐 Access the App

- **Web**: Press `w` in the Expo terminal
- **Mobile**: Scan QR code with Expo Go app
- **Android Emulator**: Press `a`
- **iOS Simulator**: Press `i`

## 🔑 Using Your Real Deepgram Key

Replace `your-deepgram-key-here` with your actual Deepgram API key in Terminal 1.

## 📝 Note

The API URL is automatically set to `http://localhost:3001` for local development.
When you deploy to Render, it will use the production URL from environment variables.

## 🐛 Troubleshooting

**Port 3001 already in use?**
```powershell
# Find and kill the process
netstat -ano | findstr :3001
taskkill /PID <process_id> /F
```

**App not connecting to API?**
- Check API server is running on port 3001
- Visit http://localhost:3001/health to verify
- Check browser console for errors
