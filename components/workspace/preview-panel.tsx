"use client";

import React from "react";
import { useState, useCallback } from "react";
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  ExternalLink, 
  RefreshCw, 
  Maximize2, 
  Minimize2,
  AlertTriangle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ViewportSize } from "@/lib/types";

interface PreviewPanelProps {
  content: React.ReactNode;
  isGenerating: boolean;
  viewport: ViewportSize;
  onViewportChange: (size: ViewportSize) => void;
}

// Error boundary for preview content
class PreviewErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: () => void },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; onError?: () => void }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-destructive/15 flex items-center justify-center mb-4">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>
          <p className="text-sm font-semibold text-foreground mb-1.5">Preview Error</p>
          <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
            {this.state.error?.message || "There was an error rendering the preview."}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-5 bg-transparent border-border/60 hover:bg-secondary/60"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-2" />
            Retry
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Skeleton loader for generating state
function PreviewSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 bg-secondary/60 rounded-lg animate-pulse" />
        <div className="h-8 w-24 bg-secondary/60 rounded-lg animate-pulse" />
      </div>
      
      {/* Hero skeleton */}
      <div className="space-y-4 py-8">
        <div className="h-5 w-20 bg-secondary/60 rounded-full mx-auto animate-pulse" />
        <div className="h-10 w-3/4 bg-secondary/60 rounded-lg mx-auto animate-pulse" style={{ animationDelay: "100ms" }} />
        <div className="h-4 w-1/2 bg-secondary/60 rounded-lg mx-auto animate-pulse" style={{ animationDelay: "200ms" }} />
        <div className="flex justify-center gap-3 pt-4">
          <div className="h-10 w-28 bg-secondary/60 rounded-lg animate-pulse" style={{ animationDelay: "300ms" }} />
          <div className="h-10 w-28 bg-secondary/60 rounded-lg animate-pulse" style={{ animationDelay: "400ms" }} />
        </div>
      </div>
      
      {/* Cards skeleton */}
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 border border-border/50 rounded-xl space-y-3 animate-fade-in" style={{ animationDelay: `${400 + i * 100}ms` }}>
            <div className="h-10 w-10 bg-secondary/60 rounded-xl animate-pulse" />
            <div className="h-5 w-24 bg-secondary/60 rounded-lg animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-secondary/60 rounded animate-pulse" />
              <div className="h-3 w-2/3 bg-secondary/60 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ViewportButton({ 
  viewport, 
  currentViewport, 
  icon: Icon, 
  label, 
  onClick 
}: { 
  viewport: ViewportSize; 
  currentViewport: ViewportSize; 
  icon: React.ElementType; 
  label: string;
  onClick: () => void;
}) {
  const isActive = viewport === currentViewport;
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "h-8 w-8 transition-smooth",
        isActive 
          ? "text-accent bg-accent/15 hover:bg-accent/20" 
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
      )}
      onClick={onClick}
      title={label}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}

export function PreviewPanel({ content, isGenerating, viewport, onViewportChange }: PreviewPanelProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const viewportWidths = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setRefreshKey((k) => k + 1);
    setTimeout(() => setIsRefreshing(false), 500);
  }, []);

  const handleFullscreen = useCallback(() => {
    setIsFullscreen((f) => !f);
  }, []);

  const handleOpenExternal = useCallback(() => {
    window.open("about:blank", "_blank");
  }, []);

  return (
    <div className={cn(
      "flex flex-col h-full bg-card/50 border-l border-border/50",
      isFullscreen && "fixed inset-0 z-50 border-l-0 bg-background"
    )}>
      {/* Toolbar */}
      <div className="flex items-center justify-between h-12 px-4 border-b border-border/50 shrink-0 glass">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-foreground mr-3">Preview</span>
          <div className="flex items-center gap-0.5 p-1 bg-secondary/50 rounded-lg">
            <ViewportButton
              viewport="desktop"
              currentViewport={viewport}
              icon={Monitor}
              label="Desktop view"
              onClick={() => onViewportChange("desktop")}
            />
            <ViewportButton
              viewport="tablet"
              currentViewport={viewport}
              icon={Tablet}
              label="Tablet view"
              onClick={() => onViewportChange("tablet")}
            />
            <ViewportButton
              viewport="mobile"
              currentViewport={viewport}
              icon={Smartphone}
              label="Mobile view"
              onClick={() => onViewportChange("mobile")}
            />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            onClick={handleRefresh}
            disabled={isGenerating}
            title="Refresh preview"
          >
            <RefreshCw className={cn("h-4 w-4 transition-smooth", isRefreshing && "animate-spin")} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            onClick={handleFullscreen}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            onClick={handleOpenExternal}
            disabled={!content}
            title="Open in new tab"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto p-4 bg-background/50 bg-grid-pattern">
        <div
          className={cn(
            "mx-auto h-full bg-card border border-border/50 rounded-xl overflow-hidden transition-all duration-300",
            viewport !== "desktop" && "shadow-2xl"
          )}
          style={{ width: viewportWidths[viewport], maxWidth: "100%" }}
        >
          {/* Device frame for non-desktop */}
          {viewport !== "desktop" && (
            <div className="h-6 bg-secondary/50 border-b border-border/50 flex items-center justify-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
              <div className="w-8 h-1 rounded-full bg-muted-foreground/30" />
            </div>
          )}
          
          {isGenerating ? (
            <PreviewSkeleton />
          ) : content ? (
            <PreviewErrorBoundary key={refreshKey}>
              <div className="p-6 scrollbar-thin overflow-auto h-full">{content}</div>
            </PreviewErrorBoundary>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-secondary/60 flex items-center justify-center mb-4">
                <Monitor className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Your preview will appear here
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1.5">
                Describe a component to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
