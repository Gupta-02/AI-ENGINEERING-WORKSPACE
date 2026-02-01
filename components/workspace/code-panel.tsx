"use client";

import { useState, useCallback } from "react";
import {
  Copy,
  Check,
  Download,
  FileCode,
  Save,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { validateCode } from "@/lib/validation";
import { cn } from "@/lib/utils";

interface CodePanelProps {
  code: string;
  isGenerating: boolean;
  onSaveVersion?: () => void;
}

// Skeleton loader for code
function CodeSkeleton() {
  return (
    <div className="space-y-2.5 p-4">
      {[...Array(15)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
          <div className="w-6 h-4 bg-secondary/50 rounded animate-pulse" />
          <div
            className="h-4 bg-secondary/50 rounded animate-pulse"
            style={{
              width: `${Math.random() * 50 + 20}%`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

export function CodePanel({
  code,
  isGenerating,
  onSaveVersion,
}: CodePanelProps) {
  const [copied, setCopied] = useState(false);

  const validation = code ? validateCode(code) : null;

  const handleCopy = useCallback(() => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code]);

  const handleDownload = useCallback(() => {
    if (code) {
      const blob = new Blob([code], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "component.tsx";
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [code]);

  // Enhanced syntax highlighting for TSX
  const highlightCode = (codeStr: string) => {
    return codeStr.split("\n").map((line, i) => {
      let highlighted = line
        // Keywords (pink/magenta)
        .replace(
          /\b(import|export|from|const|let|var|function|return|if|else|for|while|class|extends|interface|type|async|await|default|new|this|true|false|null|undefined|typeof|instanceof)\b/g,
          '<span class="text-pink-400 font-medium">$1</span>'
        )
        // Strings (emerald/green)
        .replace(
          /(['"`])((?:\\.|[^\\])*?)\1/g,
          '<span class="text-emerald-400">$1$2$1</span>'
        )
        // JSX components (cyan)
        .replace(
          /(<\/?[A-Z][a-zA-Z0-9]*)/g,
          '<span class="text-cyan-400">$1</span>'
        )
        // HTML tags (cyan)
        .replace(
          /(<\/?(?:div|span|p|h[1-6]|button|input|form|a|img|ul|li|ol|nav|header|footer|main|section|article|aside|label|select|option|textarea))/gi,
          '<span class="text-cyan-400">$1</span>'
        )
        // Props/attributes (orange)
        .replace(
          /\s([a-zA-Z-]+)=/g,
          ' <span class="text-orange-300">$1</span>='
        )
        // Comments (muted)
        .replace(
          /(\/\/.*$)/g,
          '<span class="text-muted-foreground italic">$1</span>'
        )
        // Numbers (amber)
        .replace(
          /\b(\d+(?:\.\d+)?)\b/g,
          '<span class="text-amber-400">$1</span>'
        )
        // Function calls (yellow)
        .replace(
          /\b([a-z_][a-zA-Z0-9_]*)\s*\(/g,
          '<span class="text-yellow-300">$1</span>('
        )
        // Types (sky blue)
        .replace(
          /:\s*([A-Z][a-zA-Z0-9]*)/g,
          ': <span class="text-sky-400">$1</span>'
        );

      return (
        <div 
          key={i} 
          className={cn(
            "flex group/line hover:bg-secondary/20 transition-colors",
            i === 0 && "pt-2"
          )}
        >
          <span className="w-12 pr-4 text-right text-muted-foreground/40 select-none shrink-0 border-r border-border/30 font-mono text-xs leading-7 group-hover/line:text-muted-foreground/60 transition-colors">
            {i + 1}
          </span>
          <span
            className="flex-1 pl-4 whitespace-pre leading-7"
            dangerouslySetInnerHTML={{ __html: highlighted || " " }}
          />
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-card/50 border-l border-border/50">
      {/* Toolbar */}
      <div className="flex items-center justify-between h-12 px-4 border-b border-border/50 shrink-0 glass">
        <div className="flex items-center gap-2.5">
          <FileCode className="h-4 w-4 text-accent" />
          <span className="text-sm font-semibold text-foreground">Code</span>
          {code && (
            <span className="text-xs text-muted-foreground px-2 py-1 bg-secondary/60 rounded-md font-mono border border-border/30">
              component.tsx
            </span>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          {onSaveVersion && code && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              onClick={onSaveVersion}
              title="Save version"
            >
              <Save className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 transition-smooth",
              copied 
                ? "text-accent bg-accent/15" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            )}
            onClick={handleCopy}
            disabled={!code}
            title="Copy code"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            onClick={handleDownload}
            disabled={!code}
            title="Download file"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Validation Warnings */}
      {validation && validation.warnings.length > 0 && (
        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-warning/10 border-b border-warning/20 shrink-0">
          <AlertCircle className="h-4 w-4 text-warning shrink-0" />
          <p className="text-xs text-warning truncate font-medium">
            {validation.warnings[0]}
            {validation.warnings.length > 1 &&
              ` (+${validation.warnings.length - 1} more)`}
          </p>
        </div>
      )}

      {/* Code Editor */}
      <div className="flex-1 overflow-auto font-mono text-[13px] bg-background/30 scrollbar-thin">
        {isGenerating ? (
          <CodeSkeleton />
        ) : code ? (
          <pre className="pb-4">{highlightCode(code)}</pre>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-14 h-14 rounded-2xl bg-secondary/60 flex items-center justify-center mb-4">
              <FileCode className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Generated code will appear here
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1.5">
              Ready to receive your first component
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
