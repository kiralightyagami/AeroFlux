import { NextRequest, NextResponse } from 'next/server';
import getConfig from 'next/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';


export async function GET(request: NextRequest) {
  try {
    
    const { serverRuntimeConfig } = getConfig();
    
    
    const apiKey = process.env.GEMINI_API_KEY || serverRuntimeConfig.GEMINI_API_KEY;
    const isKeyAvailable = !!apiKey;
    
    
    let isConnectionSuccessful = false;
    let connectionError = null;
    
    if (isKeyAvailable) {
      try {
        
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        
        
        const testResult = await model.generateContent("Reply with 'API connection successful'");
        const testResponse = await testResult.response;
        
        
        isConnectionSuccessful = testResponse.text().includes('API connection successful');
      } catch (error) {
        console.error('API connection test failed:', error);
        connectionError = error instanceof Error ? error.message : 'Unknown error';
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      isKeyAvailable,
      isConnectionSuccessful,
      connectionError,
      model: 'gemini-2.0-flash',
      clientInfo: {
       
        regularCalls: 'axios',
        streamingCalls: 'fetch API with ReadableStream',
        note: 'Axios does not fully support ReadableStream API needed for streaming responses'
      },
      message: !isKeyAvailable 
        ? 'Gemini API key is not found. Please check your .env file.'
        : isConnectionSuccessful
          ? 'Gemini API key is loaded successfully and connection test passed!' 
          : 'Gemini API key is loaded but connection test failed. Check the error details.'
    });
  } catch (error) {
    console.error('Error checking API key:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to verify API key configuration',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
} 