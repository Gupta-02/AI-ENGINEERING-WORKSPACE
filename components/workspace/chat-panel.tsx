"use client";

import { Sparkles, User, Copy, Check, RotateCcw, AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { Message } from "@/lib/types";

interface MessageBubbleProps {
  message: Message;
  onRetry?: (content: string) => void;
  isLatest?: boolean;
}

function MessageBubble({ message, onRetry, isLatest }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";
  const hasError = !!message.error;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className={cn(
        "flex gap-3 animate-slide-up-fade",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar with Glitter Effect */}
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-xl shrink-0 transition-smooth",
          isUser 
            ? "bg-secondary/80" 
            : hasError 
              ? "bg-destructive/20" 
              : "btn-glitter"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-foreground" />
        ) : hasError ? (
          <AlertCircle className="h-4 w-4 text-destructive" />
        ) : (
          <Sparkles className="h-4 w-4 text-accent-foreground relative z-10" />
        )}
      </div>
      
      {/* Message Content */}
      <div className={cn("flex flex-col gap-1.5 max-w-[85%]", isUser && "items-end")}>
        <div
          className={cn(
            "px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm",
            isUser
              ? "bg-secondary/80 text-foreground rounded-tr-md"
              : hasError
                ? "bg-destructive/10 border border-destructive/30 text-foreground rounded-tl-md"
                : "bg-card border border-border/60 text-foreground rounded-tl-md"
          )}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
          
          {/* Error details */}
          {hasError && message.error && (
            <div className="mt-3 pt-3 border-t border-destructive/20">
              <span className="text-xs text-destructive font-medium">{message.error}</span>
            </div>
          )}
          
          {/* Component generated badge */}
          {message.componentName && !hasError && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <span className="text-xs text-muted-foreground">
                Generated: <span className="accent-gradient-text font-medium">{message.componentName}</span>
              </span>
            </div>
          )}
        </div>
        
        {/* Actions */}
        {!isUser && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              onClick={handleCopy}
              title="Copy message"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-accent" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
            {message.isRetryable && onRetry && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                onClick={() => onRetry(message.content)}
                title="Retry generation"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Skeleton loader for messages
function MessageSkeleton() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="w-8 h-8 rounded-xl bg-secondary/60 animate-pulse shrink-0" />
      <div className="flex-1 space-y-2.5">
        <div className="h-4 bg-secondary/60 rounded-lg animate-pulse w-3/4" />
        <div className="h-4 bg-secondary/60 rounded-lg animate-pulse w-1/2" />
      </div>
    </div>
  );
}

// Typing indicator
function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-slide-up-fade">
      <div className="flex items-center justify-center w-8 h-8 rounded-xl btn-glitter shrink-0">
        <Sparkles className="h-4 w-4 text-accent-foreground relative z-10" />
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-card border border-border/60 shadow-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

interface ChatPanelProps {
  messages: Message[];
  isGenerating?: boolean;
  onRetry?: (content: string) => void;
  hasProject?: boolean;
  onCreateProject?: () => void;
}

export function ChatPanel({ messages, isGenerating, onRetry, hasProject, onCreateProject }: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  // Empty state - no project
  if (!hasProject) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-2xl btn-glitter flex items-center justify-center mb-5">
          <Sparkles className="h-8 w-8 text-accent-foreground relative z-10" />
        </div>
        <h2 className="text-xl font-semibold text-glitter mb-2 tracking-tight">
          Welcome to Forge
        </h2>
        <p className="text-muted-foreground max-w-sm leading-relaxed mb-5">
          Create a project to start building AI-powered components with instant previews.
        </p>
        <Button onClick={onCreateProject} className="gap-2 btn-glitter relative overflow-hidden">
          <span className="relative z-10 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Create Your First Project
          </span>
        </Button>
      </div>
    );
  }

  // Empty state - no messages
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-2xl btn-glitter flex items-center justify-center mb-5">
          <Sparkles className="h-8 w-8 text-accent-foreground relative z-10" />
        </div>
        <h2 className="text-xl font-semibold text-glitter mb-2 tracking-tight">
          Start Building
        </h2>
        <p className="text-muted-foreground max-w-sm leading-relaxed">
          Describe what you want to create and watch your ideas transform into
          production-ready components.
        </p>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin">
      {messages.map((message, index) => (
        <div key={message.id} className="group">
          <MessageBubble 
            message={message} 
            onRetry={onRetry}
            isLatest={index === messages.length - 1}
          />
        </div>
      ))}
      {isGenerating && <TypingIndicator />}
    </div>
  );
}
