# Mind Mitra AI - Mental Health Chatbot

A modern web-based mental health chatbot built with Next.js that connects to your existing backend API. Features voice input, text-to-speech, and a beautiful responsive interface.

## ✨ Features

- 🤖 **AI-Powered Chat** - Connects to your Hugging Face backend for intelligent responses
- 🎤 **Voice Input** - Record voice messages with visual feedback
- 🔊 **Text-to-Speech** - Listen to both your messages and AI responses
- 📱 **Responsive Design** - Works perfectly on mobile and desktop
- 🌙 **Dark/Light Mode** - Toggle between themes
- ⚡ **Real-time Chat** - Instant messaging with typing indicators

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   \`\`\`bash
   git clone <your-repo-url>
   cd mind-mitra-ai
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open in browser**
   \`\`\`
   http://localhost:3000
   \`\`\`

## 🔧 Configuration

The app is pre-configured to connect to your backend:
- **Backend URL**: `https://Macmacmacmacmacmac-mental-health-chatbot-backend.hf.space`
- **Endpoint**: `/chat_text`
- **No API keys required** - connects directly to your Hugging Face backend

## 📱 How to Use

1. **Text Chat**: Type your message and press Enter or click Send
2. **Voice Input**: Click the microphone button and speak (red = recording)
3. **Listen to Messages**: Click the speaker icon next to any message
4. **Theme Toggle**: Use the theme switcher in the top right

## 🌐 Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Deploy automatically
4. Get your live URL to share

### Other Platforms
- **Netlify**: Connect GitHub repo and deploy
- **Railway**: Import from GitHub
- **Render**: Deploy from GitHub

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Voice**: Web Speech API (Speech Recognition & Synthesis)
- **Backend**: Your existing Hugging Face API
- **Deployment**: Vercel (recommended)

## 📂 Project Structure

\`\`\`
mind-mitra-ai/
├── app/
│   ├── api/chat/route.ts     # Backend API integration
│   ├── chat/page.tsx         # Main chat interface
│   ├── page.tsx              # Homepage
│   └── layout.tsx            # App layout
├── components/
│   └── ui/                   # Reusable UI components
├── public/                   # Static assets
└── README.md                 # This file
\`\`\`

## 🔊 Voice Features

- **Speech Recognition**: Converts your voice to text automatically
- **Text-to-Speech**: Reads messages aloud with natural voice
- **Visual Feedback**: Recording indicator shows when microphone is active
- **Cross-browser Support**: Works in Chrome, Firefox, Safari, Edge

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the browser console for error messages
2. Ensure your backend is running and accessible
3. Verify microphone permissions are granted
4. Try refreshing the page

## 🎯 Future Enhancements

- [ ] Chat history persistence
- [ ] Multiple language support
- [ ] Voice customization options
- [ ] Offline mode support
- [ ] Mobile app version

---

Built with ❤️ for mental health support
