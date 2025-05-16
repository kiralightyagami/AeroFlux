"use client";

import { useState, useEffect } from 'react';
import { MarkdownContent } from '@/components/ui/markdown-content';
import axios from 'axios';

export default function DebugPage() {
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [testPrompt, setTestPrompt] = useState('How does the AeroFlux token creator work?');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('/api/ai/test')
      .then(res => {
        setApiStatus(res.data);
      })
      .catch(err => {
        console.error('Error checking API status:', err);
      });
  }, []);

  const testAPI = async () => {
    if (!testPrompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResponse('');
    
    try {
      
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: testPrompt }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get AI response');
      }
      
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }
     
      let fullResponse = '';
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }
        
        const chunk = new TextDecoder().decode(value);
        fullResponse += chunk;
        setResponse(prev => prev + chunk);
      }
    } catch (err) {
      console.error('Test request failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">AI API Debug</h1>
      
      <div className="bg-muted p-4 rounded-lg mb-8">
        <h2 className="text-lg font-semibold mb-2">API Status</h2>
        {apiStatus ? (
          <pre className="bg-slate-900 text-slate-50 p-4 rounded text-sm overflow-auto max-h-60">
            {JSON.stringify(apiStatus, null, 2)}
          </pre>
        ) : (
          <p>Loading API status...</p>
        )}
      </div>
      
      <div className="bg-muted p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Test API</h2>
        <div className="mb-4">
          <textarea 
            value={testPrompt}
            onChange={(e) => setTestPrompt(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>
        <div className="mb-6">
          <button
            onClick={testAPI}
            disabled={isLoading || !testPrompt.trim()}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test API'}
          </button>
        </div>
        
        {error && (
          <div className="bg-destructive/10 border border-destructive p-4 rounded mb-4">
            <h3 className="font-semibold text-destructive">Error</h3>
            <p>{error}</p>
          </div>
        )}
        
        {response && (
          <div className="bg-card p-4 rounded">
            <h3 className="font-semibold mb-2">Response</h3>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded shadow-sm">
              <MarkdownContent content={response} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 