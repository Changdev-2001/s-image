# S-Image
Demo : https://s-image.vercel.app/
A modern, responsive Next.js application for generating and enhancing images using OpenRouter's AI models. Featuring a sleek UI with separate modes for creation and enhancement.

## Features

- 🎨 **Two Powerful Modes**:
  - **Create**: Generate stunning images from text prompts
  - **Enhance**: Transform existing images with "Cinematic", "Minimalist", or "Vintage" styles
- 🚀 **Modern & Responsive UI**:
  - Fully responsive design optimized for all screen sizes (including 13-inch laptops)
  - Beautiful dark/light mode support
  - Smooth animations and transitions
- ⚙️ **User-Friendly Controls**:
  - Intuitive sidebar with mode switching
  - Drag-and-drop image upload
  - One-click style presets
- 🔒 **Secure**: API keys are managed securely within the application state
- ⚡ **Fast**: Built with Next.js 14, Tailwind CSS, and Redux Toolkit

## getting Started

### Prerequisites

- **OpenRouter API Key**: This app uses OpenRouter for AI image generation.
  1. Go to [OpenRouter Keys](https://openrouter.ai/keys).
  2. Create a new key.
  3. You will paste this key directly into the application settings.
- **Node.js**: Ensure you have Node.js installed (v18+ recommended).

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Changdev-2001/s-image.git
   cd s-image
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run the development server**:

   ```bash
   npm run dev
   ```

4. **Open the app**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

### Setting Up Your API Key

1. When you first open the app, click on the **Settings** icon (gear) in the navbar.
2. Enter your **OpenRouter API Key** in the input field.
3. Click "Save".
4. You're ready to start creating!

_Note: The API key is stored locally in your browser/app state and is never shared unless you explicitly deploy a backend that logs it (this app is client-focused)._

## Usage Guide

### Create Mode

1. Select **"Create Image"** from the sidebar.
2. Enter a descriptive prompt (e.g., "A futuristic cyberpunk city with neon lights").
3. Click **"Generate Image"**.
4. Download your creation!

### Enhance Mode

1. Select **"Enhance Image"** from the sidebar.
2. Upload a reference image (drag & drop or click to browse).
3. Choose a **Style Preset**:
   - 🎬 **Cinematic**: Dramatic lighting and high contrast.
   - 🎨 **Minimalist**: Clean lines and simple colors.
   - 🎞️ **Vintage**: Retro film grain and analog aesthetics.
4. Click **"Enhance Image"** to transform your uploaded photo.

## Technologies Used

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **AI Integration**: OpenRouter SDK

## Project Structure

```
s-image/
├── app/
│   ├── page.tsx             # Main application logic
│   └── api/                 # API routes for proxying requests
├── components/
│   ├── Sidebar/             # Sidebar components (ModeSelector, ImageUpload, etc.)
│   ├── Navbar.tsx           # Top navigation bar
│   ├── SettingsModal.tsx    # API key configuration
│   └── ...
├── hooks/                   # Custom hooks (useGenerateImage, etc.)
└── store/                   # Redux store configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source.
