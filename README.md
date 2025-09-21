# Mind Mitra AI 🧠💙

An AI-powered, confidential, and empathetic mental wellness solution designed specifically for Indian youth. Built with Next.js, React, and connected to your custom backend.

## Features

- 🤖 **AI-Powered Conversations**: Intelligent responses from your custom backend
- 🌙 **Dark/Light Mode**: Comfortable viewing in any lighting condition
- 😊 **Emotion Picker**: Quick mood sharing with visual feedback
- 💡 **Wellness Tips**: Contextual mental health guidance
- 🔒 **Privacy-First**: Confidential and secure conversations
- 📱 **Responsive Design**: Works beautifully on all devices
- 🎨 **Smooth Animations**: Engaging and calming user experience

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Your backend running at: `https://Macmacmacmacmacmac-mental-health-chatbot-backend.hf.space`

### Installation

1. **Clone or download the project files**

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the app.

## Backend Configuration

The app is pre-configured to connect to your backend at:
`https://Macmacmacmacmacmac-mental-health-chatbot-backend.hf.space`

### Backend API Format

The app sends POST requests to `/chat` endpoint with this format:
\`\`\`json
{
  "message": "user message",
  "user_id": "web_user",
  "session_id": "timestamp"
}
\`\`\`

Expected response format:
\`\`\`json
{
  "response": "AI response text"
}
\`\`\`

## Project Structure

\`\`\`
mind-mitra-ai/
├── app/
│   ├── api/chat/route.ts      # Backend integration endpoint
│   ├── chat/page.tsx          # Main chat interface
│   ├── page.tsx               # Homepage
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles & animations
├── components/ui/             # Reusable UI components
└── package.json               # Project configuration
\`\`\`

## Customization

### Changing Backend URL

To use a different backend, update the `BACKEND_URL` in `app/api/chat/route.ts`:

\`\`\`typescript
const BACKEND_URL = "your-new-backend-url"
\`\`\`

### Adding New Features

1. **Emotion Types**: Modify the `emotions` array in `app/chat/page.tsx`
2. **Wellness Tips**: Update the `wellnessTips` array
3. **Backend Integration**: Customize request/response format in `app/api/chat/route.ts`
4. **Styling**: Modify colors and animations in `app/globals.css`

### Cultural Adaptation

The AI is configured to be culturally sensitive to Indian context. You can further customize:

- Language support (Hindi/regional languages)
- Cultural references and examples
- Academic pressure awareness
- Family dynamics understanding

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `GOOGLE_AI_API_KEY` in Vercel's environment variables
4. Deploy!

### Other Platforms

The app can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues:

1. Check that your backend is correctly set up and running
2. Ensure all dependencies are installed
3. Verify your Node.js version (18+)
4. Check the browser console for errors

## Troubleshooting

Common issues and solutions:

1. **Backend Connection Failed**
   - Ensure your backend is running and accessible
   - Check the backend URL in `app/api/chat/route.ts`
   - Verify your backend accepts POST requests to `/chat`

2. **CORS Issues**
   - Make sure your backend allows requests from `http://localhost:3000`
   - Add proper CORS headers in your backend

3. **Response Format Issues**
   - Check that your backend returns JSON with a `response` field
   - Update the response parsing in `app/api/chat/route.ts` if needed

## Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [React](https://reactjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/) and [Shadcn/ui](https://ui.shadcn.com/)
- Backend integration with your custom backend
- Icons from [Lucide React](https://lucide.dev/)

---

**Mind Mitra AI** - Supporting mental wellness for Indian youth through compassionate AI technology. 💙
