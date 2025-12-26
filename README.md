# S-Image

A modern Next.js application for generating stunning images from text prompts using OpenRouter's AI image generation models.

## Features

- 🎨 **AI-Powered Image Generation**: Transform text descriptions into beautiful images using state-of-the-art AI models
- 🚀 **Modern UI/UX**: Clean, minimalist, and fully responsive design with dark mode support
- ⚡ **Fast & Efficient**: Built with Next.js 14+ App Router and TypeScript
- 📱 **Mobile-First**: Responsive design that works perfectly on all devices
- 🔒 **Secure**: API keys stored securely in environment variables
- 💾 **Download Support**: Download generated images with one click
- 🎯 **Custom Hooks**: Clean, reusable React hooks for state management
- 🛠️ **Robust Error Handling**: Comprehensive error messages and debugging support

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API Integration**: OpenRouter SDK (@openrouter/sdk)
- **State Management**: Custom React Hooks
- **Deployment**: Optimized for Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- OpenRouter API key ([Get one here](https://openrouter.ai/keys))
- **OpenRouter Credits** (Required for image generation models)

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd s-image
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Create a `.env.local` file in the root directory with the following:
   ```env
   OPENROUTER_API_KEY=your_actual_api_key_here
   OPENROUTER_MODEL=google/gemini-2.5-flash-image-preview
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Add credits to your OpenRouter account:**
   
   ⚠️ **IMPORTANT**: Image generation models require credits. Visit [OpenRouter Credits](https://openrouter.ai/settings/credits) to add credits to your account.

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

### Required

- `OPENROUTER_API_KEY`: Your OpenRouter API key. Get it from [OpenRouter Keys](https://openrouter.ai/keys)

### Optional

- `OPENROUTER_MODEL`: The model to use for image generation. Default: `google/gemini-2.5-flash-image-preview`
- `NEXT_PUBLIC_APP_URL`: Your app URL for OpenRouter tracking (useful for production)

## Available Models

You can use any image generation model available on OpenRouter. Some popular options:

### Image Generation Models (Requires Credits)

- `google/gemini-2.5-flash-image-preview` (default - recommended, paid)
- `google/gemini-2.5-flash-image` (paid)
- `black-forest-labs/flux-pro` (paid)
- `black-forest-labs/flux-dev` (paid)
- `black-forest-labs/flux-schnell` (paid)

⚠️ **Note**: All image generation models on OpenRouter are paid services and require credits. Check [OpenRouter's model list](https://openrouter.ai/models) for the latest available models, pricing, and their exact IDs.

## Project Structure

```
s-image/
├── app/
│   ├── api/
│   │   └── generate-image/
│   │       └── route.ts          # API route for image generation
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Home page component
├── hooks/
│   └── useGenerateImage.ts        # Custom hook for image generation
├── .env.local                     # Environment variables (not in git)
├── .gitignore                     # Git ignore file
├── next.config.js                 # Next.js configuration
├── package.json                   # Dependencies
├── postcss.config.js              # PostCSS configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # This file
```

## Architecture

### Custom Hooks

The application uses a custom React hook (`useGenerateImage`) that encapsulates:
- Image generation API calls
- Loading state management
- Error handling
- Debug information
- Image URL state

### API Route

The API route (`/api/generate-image`) handles:
- OpenRouter SDK integration
- Request validation
- Response parsing
- Error handling with detailed messages
- Image URL extraction from various response formats

## Deployment to Vercel

1. **Push your code to GitHub** (make sure `.env.local` is in `.gitignore`)

2. **Import your project to Vercel:**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Add environment variables in Vercel:**
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add the following:
     - `OPENROUTER_API_KEY`: Your OpenRouter API key
     - `OPENROUTER_MODEL`: Your preferred model (optional)
     - `NEXT_PUBLIC_APP_URL`: Your Vercel deployment URL (optional)

4. **Deploy:**
   - Vercel will automatically deploy your application
   - Your app will be live at `your-project.vercel.app`

## Usage

1. Enter a text description of the image you want to generate in the prompt textarea
2. Click "Generate Image"
3. Wait for the image to be generated (you'll see a loading indicator)
4. Once generated, the image will appear below
5. Click "Download Image" to save the image to your device

### Example Prompts

- "A fluffy baby duckling sitting on grass, golden hour warm lighting, soft texture, macro lens close-up, ultra-detailed"
- "A funny duck wearing sunglasses and riding a tiny skateboard, dynamic pose, colorful cartoon style, high-energy composition"
- "Cyberpunk cityscape at night, neon lights, rain-soaked streets, cinematic composition"

## Error Handling

The application includes comprehensive error handling:

- ✅ **Invalid prompts**: Clear error messages for empty or invalid prompts
- ✅ **API errors**: User-friendly messages for API failures
- ✅ **Network errors**: Handles connection issues gracefully
- ✅ **Rate limits**: Displays appropriate messages for rate limit errors
- ✅ **Insufficient credits**: Specific guidance to add credits
- ✅ **Invalid models**: Helpful messages with links to model documentation
- ✅ **Debug mode**: Detailed error information in development mode

## Development

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Lint

```bash
npm run lint
```

### Development Tips

- Use `console.log` statements in `/api/generate-image/route.ts` for debugging API responses
- Check the browser console for frontend errors
- Enable debug mode by setting `NODE_ENV=development` in `.env.local`

## Troubleshooting

### Image not generating

1. **Check your credits**: 
   - Visit [OpenRouter Credits](https://openrouter.ai/settings/credits)
   - Ensure you have sufficient credits for image generation
   - Most image models cost between $0.01 - $0.10 per image

2. **Check your API key**: 
   - Ensure `OPENROUTER_API_KEY` is set correctly in `.env.local`
   - Verify your API key is active at [OpenRouter Keys](https://openrouter.ai/keys)

3. **Check your model**: 
   - Verify the model name is correct and available on [OpenRouter Models](https://openrouter.ai/models)
   - Try switching to `google/gemini-2.5-flash-image-preview`

4. **Check console logs**: 
   - Look for error messages in the browser console and server logs
   - The terminal will show detailed API responses

5. **Restart the server**: 
   - After changing `.env.local`, restart the development server
   - Run `npm run dev` again

### Common Errors

#### "Insufficient credits"
**Solution**: Add credits at [OpenRouter Credits](https://openrouter.ai/settings/credits)

#### "Model not available" or "not a valid model ID"
**Solution**: Check [OpenRouter Models](https://openrouter.ai/models) for valid model IDs

#### "No valid response from the API"
**Solution**: 
- Check if you have sufficient credits
- Try a different model
- Check the debug information in the error message

#### "Image was generated but not returned"
**Solution**: This usually means insufficient credits. The API generates the image but doesn't return it without payment.

### Build errors

1. **TypeScript errors**: Run `npm run lint` to see detailed error messages
2. **Missing dependencies**: Run `npm install` to ensure all dependencies are installed
3. **Environment variables**: Make sure `.env.local` exists and has the required variables

## Dependencies

### Main Dependencies
- `next`: ^14.2.0
- `react`: ^18.3.0
- `react-dom`: ^18.3.0
- `@openrouter/sdk`: ^0.1.27

### Dev Dependencies
- `typescript`: ^5.3.3
- `@types/node`: ^20.11.0
- `@types/react`: ^18.2.0
- `tailwindcss`: ^3.4.1

## API Costs

Image generation on OpenRouter uses a pay-per-use model. Typical costs:

- **Google Gemini Image Models**: ~$0.01 - $0.05 per image
- **Flux Models**: ~$0.05 - $0.10 per image
- **Other Models**: Check [OpenRouter Pricing](https://openrouter.ai/models)

💡 **Tip**: Start with smaller `max_tokens` values to reduce costs during testing.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available for personal and commercial use.

## Support

For issues related to:
- **OpenRouter API**: Check [OpenRouter Documentation](https://openrouter.ai/docs)
- **Credits & Billing**: Visit [OpenRouter Settings](https://openrouter.ai/settings)
- **Next.js**: Check [Next.js Documentation](https://nextjs.org/docs)
- **This project**: Open an issue on the project repository

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [OpenRouter](https://openrouter.ai/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

Built with ❤️ using Next.js, TypeScript, and OpenRouter

**Happy Image Generation! 🎨**
