"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { cn } from '@/lib/utils';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div className={cn("markdown-content text-sm prose prose-slate dark:prose-invert max-w-none", className)}>
      <style jsx global>{`
        .markdown-content {
          font-size: 0.9375rem;
          line-height: 1.6;
          overflow-wrap: break-word;
          word-break: break-word;
        }
        .markdown-content > *:first-child {
          margin-top: 0;
        }
        .markdown-content > *:last-child {
          margin-bottom: 0;
        }
        .markdown-content h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }
        .markdown-content h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }
        .markdown-content h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }
        .markdown-content a {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
        }
        .markdown-content a:hover {
          text-decoration: underline;
        }
        .markdown-content p {
          margin-bottom: 0.75rem;
        }
        .markdown-content ul, .markdown-content ol {
          margin-top: 0.5rem;
          margin-bottom: 0.75rem;
          padding-left: 1.5rem;
        }
        .markdown-content ul {
          list-style-type: disc;
        }
        .markdown-content ol {
          list-style-type: decimal;
        }
        .markdown-content ul li, .markdown-content ol li {
          margin-bottom: 0.25rem;
        }
        .markdown-content blockquote {
          border-left: 3px solid #6366f1;
          padding-left: 0.75rem;
          font-style: italic;
          margin: 0.75rem 0;
          color: #6b7280;
        }
        .dark .markdown-content blockquote {
          color: #9ca3af;
        }
        .markdown-content pre {
          background-color: #111827;
          border-radius: 0.375rem;
          padding: 0.75rem;
          overflow-x: auto;
          margin: 0.75rem 0;
          font-size: 0.85rem;
          border: 1px solid #1f2937;
        }
        .markdown-content code {
          background-color: #f1f5f9;
          border-radius: 0.25rem;
          padding: 0.2rem 0.3rem;
          font-size: 0.875rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }
        .markdown-content pre code {
          background-color: transparent;
          padding: 0;
          border-radius: 0;
          color: #e2e8f0;
          font-size: 0.85rem;
        }
        .dark .markdown-content code {
          background-color: #1e293b;
        }
        .markdown-content table {
          border-collapse: collapse;
          width: 100%;
          margin: 0.75rem 0;
          font-size: 0.875rem;
        }
        .markdown-content th, .markdown-content td {
          border: 1px solid #e2e8f0;
          padding: 0.5rem;
          text-align: left;
        }
        .dark .markdown-content th, .dark .markdown-content td {
          border-color: #334155;
        }
        .markdown-content th {
          background-color: #f8fafc;
          font-weight: 600;
        }
        .dark .markdown-content th {
          background-color: #1e293b;
        }
        .markdown-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.375rem;
          margin: 0.75rem 0;
        }
        .markdown-content hr {
          border: 0;
          border-top: 1px solid #e2e8f0;
          margin: 1rem 0;
        }
        .dark .markdown-content hr {
          border-top-color: #334155;
        }
      `}</style>
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
} 