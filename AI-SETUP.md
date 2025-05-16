# AeroFlux AI Assistant Setup

This document provides instructions for setting up the AI Assistant feature in AeroFlux.

## Gemini API Setup

The AI Assistant uses Google's Gemini API with the Gemini 2.0 Flash model for faster responses. Follow these steps to set it up:

1. Visit [Google AI Studio](https://aistudio.google.com/) and create an account if you don't have one
2. Go to the API section and create a new API key
3. Create a `.env.local` file in the root of your project with the following:

```
GEMINI_API_KEY=your_api_key_here
```

## Environment Variables

Make sure to add the following to your `.env.local` file:

```
# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Other existing environment variables
# ...
```

## Verifying Setup

To verify that your Gemini API key is loaded correctly:

1. Start the development server with `npm run dev` or `pnpm dev`
2. Visit `/api/ai/test` in your browser
3. You should see a success message confirming the API key is available

## Features

The AI Assistant provides help with:

- Token creation
- Liquidity pool management
- Swap functionality
- Airdrop functionality
- General usage tips

## Model Information

This implementation uses the Gemini 2.0 Flash model, which provides:
- Faster response times for better user experience
- Optimized for real-time chat applications
- More efficient token usage
- Support for context-aware responses

## Streaming Responses

The AI assistant uses streaming responses which:
- Show responses as they're being generated in real-time
- Provide a more interactive user experience
- Use the Vercel AI SDK for optimized performance
- Allow users to start reading responses before they're completed

## Implementation Details

The AI integration includes:
- A dedicated AI Assistant page at `/ai-assistant`
- A floating help widget available throughout the app
- Context-aware responses based on the user's questions
- Real-time streaming of AI responses

## Production Considerations

For production deployment:
- Use environment variables for API keys
- Consider rate limiting to prevent excessive API usage
- Implement caching for common queries to reduce API costs
- Consider using a vector database for more advanced RAG (Retrieval Augmented Generation)

## Troubleshooting

If the AI assistant isn't working properly:

1. Check that your `.env.local` file contains a valid Gemini API key
2. Verify the key is working by visiting `/api/ai/test`
3. Check browser console for any API errors
4. Ensure your Next.js version supports the serverRuntimeConfig setup 