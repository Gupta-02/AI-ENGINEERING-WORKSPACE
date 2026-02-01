"use client";

import React from "react"

import { useState, useEffect } from "react";
import { X, FolderPlus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/lib/store";
import { validateProjectName } from "@/lib/validation";
import { cn } from "@/lib/utils";
import type { Framework } from "@/lib/types";

interface ProjectModalProps {
  open: boolean;
  onClose: () => void;
}

const frameworks: { value: Framework; label: string; description: string }[] = [
  { value: "nextjs", label: "Next.js", description: "React framework with SSR/SSG" },
  { value: "react", label: "React", description: "Client-side React application" },
  { value: "vue", label: "Vue", description: "Progressive JavaScript framework" },
  { value: "svelte", label: "Svelte", description: "Compiler-based framework" },
];

export function ProjectModal({ open, onClose }: ProjectModalProps) {
  const { createProject } = useWorkspace();
  const [name, setName] = useState("");
  const [framework, setFramework] = useState<Framework>("nextjs");
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setName("");
      setFramework("nextjs");
      setError(null);
      setIsCreating(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateProjectName(name);
    if (!validation.isValid) {
      setError(validation.errors[0]);
      return;
    }

    setIsCreating(true);
    setError(null);

    // Simulate slight delay for UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    createProject(name.trim(), framework);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-card border border-border rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <FolderPlus className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Create Project</h2>
              <p className="text-sm text-muted-foreground">Start a new workspace</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Project Name */}
          <div className="space-y-2">
            <label htmlFor="project-name" className="text-sm font-medium text-foreground">
              Project Name
            </label>
            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              placeholder="My Awesome Project"
              className={cn(
                "w-full px-3 py-2 bg-input border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring",
                error ? "border-destructive" : "border-border"
              )}
              autoFocus
            />
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </div>

          {/* Framework Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Framework</label>
            <div className="grid grid-cols-2 gap-2">
              {frameworks.map((fw) => (
                <button
                  key={fw.value}
                  type="button"
                  onClick={() => setFramework(fw.value)}
                  className={cn(
                    "flex flex-col items-start p-3 rounded-lg border text-left transition-colors",
                    framework === fw.value
                      ? "bg-accent/10 border-accent text-foreground"
                      : "bg-secondary/50 border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                  )}
                >
                  <span className="font-medium text-sm">{fw.label}</span>
                  <span className="text-xs text-muted-foreground mt-0.5">{fw.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || !name.trim()}>
              {isCreating ? (
                <>
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
