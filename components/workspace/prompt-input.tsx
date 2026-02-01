"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";
import { Sparkles, ImageIcon, Code, Layout, AlertCircle, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { validatePrompt } from "@/lib/validation";

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

function QuickAction({ icon, label, onClick, disabled }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium transition-smooth overflow-hidden",
        "bg-secondary/70 hover:bg-secondary border border-border/50 hover:border-accent/50",
        "text-muted-foreground hover:text-foreground",
        disabled && "opacity-50 cursor-not-allowed hover:bg-secondary/70 hover:text-muted-foreground hover:border-border/50"
      )}
    >
      <span className="absolute inset-0 shimmer-gold-fast opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="relative z-10 text-accent gold-shine">{icon}</span>
      <span className="relative z-10">{label}</span>
    </button>
  );
}

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isGenerating: boolean;
  disabled?: boolean;
  error?: string | null;
}

export function PromptInput({ onSubmit, isGenerating, disabled, error }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [prompt]);

  // Clear validation on prompt change
  useEffect(() => {
    if (prompt.length > 0) {
      const result = validatePrompt(prompt);
      if (!result.isValid) {
        setValidationError(result.errors[0]);
      } else {
        setValidationError(null);
      }
      setValidationWarnings(result.warnings);
    } else {
      setValidationError(null);
      setValidationWarnings([]);
    }
  }, [prompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = prompt.trim();
    
    if (!trimmed || isGenerating || disabled) return;

    const validation = validatePrompt(trimmed);
    if (!validation.isValid) {
      setValidationError(validation.errors[0]);
      return;
    }

    onSubmit(trimmed);
    setPrompt("");
    setValidationError(null);
    setValidationWarnings([]);
  };

  const handleQuickAction = (action: string) => {
    if (disabled || isGenerating) return;
    setPrompt(action);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isDisabled = disabled || isGenerating;
  const hasError = !!(validationError || error);
  const displayError = validationError || error;

  return (
    <div className="space-y-4">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <QuickAction
          icon={<Layout className="h-4 w-4" />}
          label="Landing page"
          onClick={() => handleQuickAction("Create a modern landing page with hero section, features, and CTA")}
          disabled={isDisabled}
        />
        <QuickAction
          icon={<Code className="h-4 w-4" />}
          label="Dashboard"
          onClick={() => handleQuickAction("Build a dashboard with sidebar navigation, stats cards, and a data table")}
          disabled={isDisabled}
        />
        <QuickAction
          icon={<ImageIcon className="h-4 w-4" />}
          label="Card grid"
          onClick={() => handleQuickAction("Create a responsive grid of cards with images, titles, and descriptions")}
          disabled={isDisabled}
        />
      </div>

      {/* Validation Warnings */}
      {validationWarnings.length > 0 && !hasError && (
        <div className="flex items-start gap-2.5 px-4 py-3 bg-warning/10 border border-warning/30 rounded-xl animate-slide-up-fade">
          <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
          <div className="text-sm text-warning">
            {validationWarnings.map((warning, i) => (
              <p key={i}>{warning}</p>
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      {hasError && (
        <div className="flex items-start gap-2.5 px-4 py-3 bg-destructive/10 border border-destructive/30 rounded-xl animate-slide-up-fade">
          <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive flex-1 font-medium">{displayError}</p>
          <button
            className="shrink-0 text-destructive hover:text-destructive/80 transition-colors p-0.5"
            onClick={() => setValidationError(null)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div 
          className={cn(
            "relative flex items-end rounded-2xl overflow-hidden transition-all duration-200",
            "bg-input/80 border-2",
            hasError 
              ? "border-destructive/50" 
              : isFocused
                ? "border-accent/50 glow-accent-subtle"
                : "border-border/50 hover:border-border",
            isDisabled && "opacity-60"
          )}
        >
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={disabled ? "Create a project to start generating..." : "Describe the component or feature you want to build..."}
            className="flex-1 min-h-[100px] max-h-[200px] px-4 py-4 bg-transparent text-foreground placeholder:text-muted-foreground resize-none focus:outline-none disabled:cursor-not-allowed text-[15px] leading-relaxed scrollbar-thin"
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isDisabled}
          />
        </div>
        
        {/* Submit Button */}
        <div className="absolute bottom-3 right-3 flex items-center gap-3">
          <span className="text-xs text-muted-foreground/70 hidden sm:inline tabular-nums">
            {prompt.length}/2000
          </span>
          <Button
            type="submit"
            size="sm"
            disabled={!prompt.trim() || isGenerating || disabled || !!validationError}
            className={cn(
              "gap-2 px-4 transition-smooth relative overflow-hidden",
              isGenerating 
                ? "opacity-80" 
                : "btn-glitter"
            )}
          >
            <span className="relative z-10 flex items-center gap-2">
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate</span>
                </>
              )}
            </span>
          </Button>
        </div>
      </form>

      {/* Helper Text */}
      <p className="text-xs text-muted-foreground/70 text-center">
        Press <kbd className="px-1.5 py-0.5 bg-secondary/80 rounded text-[11px] font-medium border border-border/50">Enter</kbd> to generate, <kbd className="px-1.5 py-0.5 bg-secondary/80 rounded text-[11px] font-medium border border-border/50">Shift + Enter</kbd> for new line
      </p>
    </div>
  );
}
