"use client";

import { useState, useCallback } from 'react';
import axios from 'axios';

interface UseAIOptions {
  initialMessage?: string;
}

interface AIMessage {
  content: string;
  isUser: boolean;
  id?: string;
}

export function useAI({ initialMessage }: UseAIOptions = {}) {
  const [messages, setMessages] = useState<AIMessage[]>(
    initialMessage 
      ? [{ content: initialMessage, isUser: false, id: 'initial-message' }] 
      : []
  );
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  const ask = useCallback(async (prompt: string) => {
    if (!prompt.trim()) return;
    
    const userMessage = { content: prompt, isUser: true, id: `user-${Date.now()}` };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    
    try {
      // Create an assistant message ID
      const assistantMessageId = `assistant-${Date.now()}`;
      
      // Add initial empty assistant message
      setMessages(prev => [...prev, { 
        content: '', 
        isUser: false,
        id: assistantMessageId
      }]);

      // Use fetch with streams instead of axios for streaming compatibility
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      let accumulatedContent = '';
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }
        
        const chunk = new TextDecoder().decode(value);
        accumulatedContent += chunk;
        
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, content: accumulatedContent } 
              : msg
          )
        );
      }
    } catch (err) {
      console.error('AI request failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      ask(input);
      setInput('');
    }
  }, [ask, input, isLoading]);

  const clearMessages = useCallback(() => {
    setMessages(initialMessage 
      ? [{ content: initialMessage, isUser: false, id: 'initial-message' }] 
      : []);
  }, [initialMessage]);

  return {
    messages,
    isLoading,
    error,
    ask,
    clearMessages,
    input,
    handleInputChange,
    handleSubmit
  };
} 