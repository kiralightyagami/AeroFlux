"use client";

import { useRef, useEffect } from 'react';
import { useAI } from '@/lib/useAI';
import { Button } from './button';
import { Card } from './card';
import { Input } from './input';
import { cn } from '@/lib/utils';
import { MarkdownContent } from './markdown-content';
import { SparklesIcon, SendIcon } from 'lucide-react';

interface AIAssistantProps {
  initialMessage?: string;
  className?: string;
}

export function AIAssistant({ initialMessage = "Hi there! I'm your AI assistant for AeroFlux. Ask me how to use any of our tools or any questions you might have.", className }: AIAssistantProps) {
  const { 
    messages, 
    isLoading, 
    error, 
    input, 
    handleInputChange, 
    handleSubmit 
  } = useAI({ initialMessage });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (messages.length > 0 && messages[messages.length - 1]?.content && !messages[messages.length - 1].isUser) {
      inputRef.current?.focus();
    }
  }, [messages]);

  return (
    <Card className={cn(
      'flex flex-col h-full w-full relative overflow-hidden bg-transparent border-0',
      className
    )}>
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
        {messages.map((message, i) => (
          <div 
            key={message.id || i} 
            className={cn(
              'animate-in fade-in slide-in-from-bottom-2 duration-300',
              message.isUser ? 'flex justify-end' : 'flex justify-start'
            )}
          >
            <div
              className={cn(
                'rounded-lg p-3 max-w-[90%] shadow-sm',
                message.isUser 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100'
              )}
            >
              {message.isUser ? (
                <div className="whitespace-pre-wrap break-words">{message.content}</div>
              ) : (
                <MarkdownContent content={message.content} />
              )}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.isUser && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 max-w-[90%] shadow-sm">
              <div className="flex space-x-2 items-center text-blue-500">
                <SparklesIcon className="h-4 w-4 animate-pulse" />
                <div className="flex space-x-1">
                  <div className="h-2 w-2 rounded-full bg-current animate-bounce"></div>
                  <div className="h-2 w-2 rounded-full bg-current animate-bounce delay-100"></div>
                  <div className="h-2 w-2 rounded-full bg-current animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-600 dark:text-red-400 rounded-lg p-3 my-2 text-sm">
            Error: {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form 
        onSubmit={handleSubmit} 
        className="border-t border-slate-200 dark:border-slate-800 p-3 flex gap-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
      >
        <Input
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          placeholder="Ask me about Solana tools..."
          disabled={isLoading}
          className="flex-1 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-blue-500"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (input.trim() && !isLoading) {
                handleSubmit(e);
              }
            }
          }}
        />
        <Button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          size="icon"
        >
          <SendIcon className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
} 