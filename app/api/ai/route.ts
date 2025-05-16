import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { getContextForPrompt } from '@/lib/ai-prompts';
import getConfig from 'next/config';


const { serverRuntimeConfig } = getConfig();


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || serverRuntimeConfig.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    
    const apiKey = process.env.GEMINI_API_KEY || serverRuntimeConfig.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('No Gemini API key found');
      return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
    }


    const context = getContextForPrompt(prompt);
    
    
    const enhancedPrompt = `
      You are an AI assistant for AeroFlux, a Solana-based DeFi platform. 
      Use the following information about our tools to inform your response, but respond naturally as a helpful assistant.
      
      CONTEXT INFORMATION:
      ${context}
      
      USER QUESTION:
      ${prompt}
      
      Please provide a helpful, accurate response based on the provided context.
    `;

  
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });

    try {
      
      const streamingResponse = await model.generateContentStream(enhancedPrompt);
      
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of streamingResponse.stream) {
              const text = chunk.text();
              if (text) {
                controller.enqueue(new TextEncoder().encode(text));
              }
            }
            controller.close();
          } catch (error) {
            console.error('Streaming error:', error);
            controller.error(error);
          }
        },
      });

      
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      });
    } catch (modelError) {
      console.error('Gemini model error:', modelError);
      return NextResponse.json({ error: 'Error generating AI response from model' }, { status: 500 });
    }
  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI response' }, 
      { status: 500 }
    );
  }
} 