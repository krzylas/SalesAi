# VAPI.ai Setup Guide for Sales Training

## 🎯 Overview

This guide will help you configure VAPI.ai for the best sales call training experience.

---

## Step 1: Create VAPI Account

1. Go to [vapi.ai](https://vapi.ai)
2. Click **"Get Started"** or **"Sign Up"**
3. Create your account (free tier available)
4. Verify your email

---

## Step 2: Get Your API Key

1. Log into your VAPI dashboard
2. Go to **Settings** → **API Keys**
3. Click **"Create API Key"**
4. Copy the key (starts with `vapi_...`)
5. **Save this key securely** - you'll need it for Render

---

## Step 3: Create a Sales Training Assistant

### 3.1 Go to Assistants
1. In VAPI dashboard, click **"Assistants"**
2. Click **"Create Assistant"**

### 3.2 Configure the Assistant

**Basic Settings:**
- **Name**: `Sales Trainer`
- **First Message**: "Hi! I'm interested in learning more about your product. What can you tell me about it?"

**Model Configuration:**
```json
{
  "provider": "openai",
  "model": "gpt-4",
  "temperature": 0.7
}
```

**System Prompt** (copy this for best results):
```
You are an experienced sales trainer role-playing as a potential customer. Your goal is to help salespeople practice their skills by providing realistic interactions.

BEHAVIOR:
- Start as a curious but skeptical prospect
- Ask clarifying questions about the product/service
- Raise common objections (price, timing, competition, need)
- Don't make it too easy - push back on weak arguments
- Occasionally show interest to keep the conversation going
- After 3-5 minutes, either agree to next steps or politely decline

OBJECTIONS TO USE (rotate through these):
1. "That sounds expensive. What's the ROI?"
2. "We're already using [competitor]. Why should we switch?"
3. "I'm not sure we need this right now."
4. "I need to check with my team/boss first."
5. "Can you send me some information to review?"
6. "How is this different from what we're already doing?"

FEEDBACK MODE:
When the user says "feedback" or "how did I do", switch to coach mode and provide:
- What they did well
- Areas for improvement
- Specific phrases or techniques to try
- A score out of 10

Keep responses concise (2-3 sentences max) to simulate real conversation flow.
```

### 3.3 Voice Settings

**Recommended Voice:**
- **Provider**: `elevenlabs` or `playht`
- **Voice**: Choose a professional-sounding voice
- **Speed**: 1.0 (normal)

**Transcription:**
- **Provider**: `deepgram`
- **Model**: `nova-2`
- **Language**: `en-US`

---

## Step 4: Get Your Assistant ID

1. After creating the assistant, copy the **Assistant ID**
2. It looks like: `asst_xxxxxxxxxxxx`

---

## Step 5: Update Your App

### Option A: Use Assistant ID (Recommended)

Edit `app/(tabs)/index.tsx` and update the `startCall` function:

```typescript
startCall('YOUR_ASSISTANT_ID', {});
```

Replace `YOUR_ASSISTANT_ID` with your actual assistant ID from VAPI.

### Option B: Use Inline Configuration

Keep the current setup which configures the assistant inline:

```typescript
startCall('YOUR_PUBLIC_KEY', {
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en-US",
  },
  model: {
    provider: "openai",
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Your system prompt here...",
      },
    ],
  },
  voice: {
    provider: "elevenlabs",
    voiceId: "your-voice-id",
  },
});
```

---

## Step 6: Deploy API Key to Render

1. Go to your Render dashboard
2. Select your `sales-gym-api` service
3. Go to **Environment** tab
4. Set `VAPI_API_KEY` to your VAPI API key
5. Click **Save Changes**
6. The service will automatically redeploy

---

## 🎓 Best Practices for Sales Training

### Scenario Ideas

1. **Cold Call Practice**
   - System prompt: "You are a busy executive who wasn't expecting this call"
   
2. **Discovery Call**
   - System prompt: "You are evaluating solutions and have specific requirements"
   
3. **Objection Handling**
   - System prompt: "You are interested but have many concerns about price and timing"
   
4. **Closing Practice**
   - System prompt: "You are ready to buy but need final convincing"

### Training Tips

1. **Start with easy scenarios** - Build confidence first
2. **Record sessions** - Review your performance later
3. **Focus on one skill** - Don't try to improve everything at once
4. **Ask for feedback** - Say "feedback" to get AI coaching
5. **Practice daily** - 10-15 minutes is enough

---

## 🔧 Advanced Configuration

### Custom Scenarios

Create multiple assistants for different scenarios:

| Assistant | Use Case | Difficulty |
|-----------|----------|------------|
| `Friendly Prospect` | Warm leads | Easy |
| `Skeptical Buyer` | Cold outreach | Medium |
| `Executive Gatekeeper` | C-suite calls | Hard |
| `Price Negotiator` | Closing deals | Hard |

### Webhook Integration (Optional)

Track training sessions by adding a webhook:

1. In VAPI, go to **Webhooks**
2. Add your endpoint URL
3. Select events: `call-start`, `call-end`, `transcript`

---

## 📊 Metrics to Track

- **Talk time ratio** - Aim for 40% you, 60% prospect
- **Questions asked** - More discovery = better outcomes
- **Objections handled** - Track which ones you struggle with
- **Call duration** - Practice extending conversations
- **Conversion rate** - How often do you get to "next steps"

---

## 🚀 Quick Start Checklist

- [ ] Create VAPI account
- [ ] Generate API key
- [ ] Create Sales Trainer assistant
- [ ] Copy assistant ID
- [ ] Add API key to Render environment
- [ ] Test a call in the app
- [ ] Practice for 15 minutes daily

---

## 💡 Pro Tips

1. **Use the feedback command** - Say "feedback" or "how did I do" at any point
2. **Practice specific objections** - Tell the AI "let's practice price objections"
3. **Role-play different personas** - "Pretend you're a CFO"
4. **Vary your pitch** - Try different approaches and see what works
5. **Record breakthrough moments** - Note phrases that work well

---

## 🆘 Troubleshooting

**No audio?**
- Check microphone permissions in browser
- Ensure VAPI API key is set correctly

**AI not responding?**
- Check API server is running
- Verify VAPI account has credits

**Poor transcription?**
- Speak clearly and at normal pace
- Use a good microphone
- Reduce background noise

---

## 📞 Support

- **VAPI Documentation**: https://docs.vapi.ai
- **VAPI Discord**: https://discord.gg/vapi
- **OpenAI Status**: https://status.openai.com

---

Happy selling! 🎯
