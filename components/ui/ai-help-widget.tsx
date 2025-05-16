"use client";

import { useState } from 'react';
import { Card } from './card';
import { Button } from './button';
import { AIAssistant } from './ai-assistant';
import { BotIcon, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import ClientOnly from '@/components/ClientOnly';

interface AIHelpWidgetProps {
  className?: string;
}

export function AIHelpWidget({ className }: AIHelpWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ClientOnly>
      <div className={cn('fixed bottom-6 right-6 z-50', className)}>
        {isOpen ? (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-300">
            {/* Backdrop for mobile devices */}
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-10" onClick={() => setIsOpen(false)} />
            
            <Card className="relative w-[90vw] sm:w-[450px] md:w-[480px] h-[600px] md:h-[520px] shadow-2xl 
                           bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 
                           overflow-hidden z-20">
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-blue-600/10 to-purple-600/10 
                            backdrop-blur-sm flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-medium text-md flex items-center gap-2">
                  <BotIcon className="h-5 w-5 text-blue-500" />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    AeroFlux Assistant
                  </span>
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close assistant"
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="pt-12 h-full">
                <AIAssistant 
                  initialMessage="How can I help you with AeroFlux tools today? Ask me about token creation, swapping, or airdrop features."
                  className="shadow-none h-full border-none bg-transparent"
                />
              </div>
            </Card>
          </div>
        ) : (
          <Button
            id="ai-button"
            aria-label="Open AI assistant"
            className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 
                     hover:from-blue-700 hover:to-purple-700 p-0 flex items-center justify-center
                     transition-all duration-300 hover:scale-105 animate-in fade-in duration-500"
            onClick={() => setIsOpen(true)}
          >
            <BotIcon className="h-6 w-6" />
          </Button>
        )}
      </div>
    </ClientOnly>
  );
} 