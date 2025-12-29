# Sales Gym 🎯

A minimalist sales practice app powered by AI voice technology. Practice your sales pitch with an AI sales trainer that provides realistic customer interactions.

## Features

- 🎤 **Voice-Powered Practice**: Real-time voice interaction with AI
- 🎨 **Minimalist UI**: Clean, distraction-free interface
- 🔒 **Secure API Management**: API keys stored securely on backend
- ⚡ **Optimized Performance**: Keep-alive functionality prevents cold starts
- 📱 **Cross-Platform**: Works on web, iOS, and Android

## Quick Start

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your API backend URL (or use localhost for dev)

3. **Run the API server** (in one terminal)
   ```powershell
   cd server
   $env:DEEPGRAM_API_KEY="your-test-key"; npm start
   ```

4. **Run the app** (in another terminal)
   ```bash
   EXPO_PUBLIC_API_URL=http://localhost:3001 npx expo start
   ```

5. **Open the app**
   - Press `w` for web
   - Scan QR code with Expo Go for mobile
   - Press `a` for Android emulator
   - Press `i` for iOS simulator

## Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for complete deployment instructions including:
- Secure API key management with Render
- Frontend static site deployment
- Keep-alive configuration
- Production best practices

## Project Structure

```
sales-gym/
├── app/                    # React Native app screens
│   ├── (tabs)/            # Tab navigation
│   │   └── index.tsx      # Main screen with mic button
│   └── _layout.tsx        # Root layout with keep-alive
├── server/                # Backend API server
│   ├── index.js          # Express server
│   └── package.json      # Server dependencies
├── hooks/                 # React hooks
│   ├── useSalesCall.ts   # Deepgram Voice Agent integration
│   └── usePermission.ts  # Microphone permissions
├── utils/                 # Utilities
│   └── keepAlive.ts      # Keep-alive pinging
└── store/                 # State management
    └── callStore.ts      # Call state (Zustand)
```

## How It Works

1. **User taps microphone button** → App requests mic permissions
2. **App fetches API key** → Securely retrieved from backend server
3. **Deepgram Voice Agent connected** → Real-time voice AI interaction
4. **AI responds** → GPT-4 powered sales trainer provides feedback
5. **Keep-alive pings** → Prevents server from sleeping

## Security

- ✅ API keys stored in Render environment variables (never in code)
- ✅ Backend API serves keys securely
- ✅ `.env` files excluded from Git
- ✅ HTTPS for all API communication

## Technologies

- **Frontend**: React Native, Expo, TypeScript
- **Backend**: Node.js, Express
- **AI**: Deepgram Voice Agent API (STT + LLM + TTS), OpenAI GPT-4
- **Hosting**: Render.com
- **State**: Zustand
- **Styling**: NativeWind (Tailwind CSS)

## Scripts

```bash
npm start              # Start Expo dev server
npm run build:static   # Build static web app
npm run serve          # Serve built app locally
npm run android        # Run on Android
npm run ios            # Run on iOS
npm run web            # Run on web
```

## Support

For deployment help, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## License

MIT
