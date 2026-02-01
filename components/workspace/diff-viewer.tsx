"use client";

import { X, ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/lib/store";
import { cn } from "@/lib/utils";

interface DiffViewerProps {
  compareVersionId: string | null;
  onClose: () => void;
}

function computeDiff(oldCode: string, newCode: string): { oldLines: DiffLine[]; newLines: DiffLine[] } {
  const oldLines = oldCode.split("\n");
  const newLines = newCode.split("\n");
  
  const oldResult: DiffLine[] = [];
  const newResult: DiffLine[] = [];
  
  const maxLength = Math.max(oldLines.length, newLines.length);
  
  for (let i = 0; i < maxLength; i++) {
    const oldLine = oldLines[i];
    const newLine = newLines[i];
    
    if (oldLine === undefined) {
      oldResult.push({ content: "", type: "empty", lineNumber: i + 1 });
      newResult.push({ content: newLine, type: "added", lineNumber: i + 1 });
    } else if (newLine === undefined) {
      oldResult.push({ content: oldLine, type: "removed", lineNumber: i + 1 });
      newResult.push({ content: "", type: "empty", lineNumber: i + 1 });
    } else if (oldLine !== newLine) {
      oldResult.push({ content: oldLine, type: "removed", lineNumber: i + 1 });
      newResult.push({ content: newLine, type: "added", lineNumber: i + 1 });
    } else {
      oldResult.push({ content: oldLine, type: "unchanged", lineNumber: i + 1 });
      newResult.push({ content: newLine, type: "unchanged", lineNumber: i + 1 });
    }
  }
  
  return { oldLines: oldResult, newLines: newResult };
}

interface DiffLine {
  content: string;
  type: "added" | "removed" | "unchanged" | "empty";
  lineNumber: number;
}

function DiffLineComponent({ line }: { line: DiffLine }) {
  return (
    <div
      className={cn(
        "flex font-mono text-xs",
        line.type === "added" && "bg-emerald-500/10",
        line.type === "removed" && "bg-red-500/10",
        line.type === "empty" && "bg-muted/30"
      )}
    >
      <span className={cn(
        "w-10 px-2 py-0.5 text-right select-none border-r",
        line.type === "added" && "text-emerald-500 border-emerald-500/20",
        line.type === "removed" && "text-red-500 border-red-500/20",
        line.type === "unchanged" && "text-muted-foreground border-border",
        line.type === "empty" && "text-muted-foreground/50 border-border"
      )}>
        {line.type !== "empty" ? line.lineNumber : ""}
      </span>
      <span className={cn(
        "flex-1 px-2 py-0.5 whitespace-pre",
        line.type === "added" && "text-emerald-400",
        line.type === "removed" && "text-red-400",
        line.type === "unchanged" && "text-foreground",
        line.type === "empty" && "text-muted-foreground/30"
      )}>
        {line.type === "added" && "+ "}
        {line.type === "removed" && "- "}
        {line.type === "unchanged" && "  "}
        {line.content}
      </span>
    </div>
  );
}

export function DiffViewer({ compareVersionId, onClose }: DiffViewerProps) {
  const { state, currentComponent, restoreVersion } = useWorkspace();
  
  if (!compareVersionId || !currentComponent) {
    return null;
  }

  const compareVersion = state.versions.find((v) => v.id === compareVersionId);
  const currentVersions = state.versions.filter((v) => v.componentId === currentComponent.id);
  const latestVersion = [...currentVersions].sort((a, b) => b.versionNumber - a.versionNumber)[0];

  if (!compareVersion || !latestVersion) {
    return null;
  }

  const oldCode = compareVersion.code[0]?.code || "";
  const newCode = latestVersion.code[0]?.code || "";
  const { oldLines, newLines } = computeDiff(oldCode, newCode);

  const addedCount = newLines.filter((l) => l.type === "added").length;
  const removedCount = oldLines.filter((l) => l.type === "removed").length;

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="flex items-center justify-between h-12 px-4 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">Comparing Versions</span>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 bg-secondary rounded text-muted-foreground">
              v{compareVersion.versionNumber}
            </span>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <span className="px-2 py-0.5 bg-accent/20 rounded text-accent">
              v{latestVersion.versionNumber} (current)
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 text-xs mr-2">
            <span className="text-emerald-500">+{addedCount} added</span>
            <span className="text-red-500">-{removedCount} removed</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 bg-transparent"
            onClick={() => {
              restoreVersion(compareVersionId);
              onClose();
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restore v{compareVersion.versionNumber}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Diff Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Old Version */}
        <div className="flex-1 flex flex-col border-r border-border">
          <div className="px-4 py-2 border-b border-border bg-secondary/30">
            <span className="text-xs text-muted-foreground">
              {compareVersion.code[0]?.name || "component.tsx"} (v{compareVersion.versionNumber})
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {oldLines.map((line, i) => (
              <DiffLineComponent key={i} line={line} />
            ))}
          </div>
        </div>

        {/* New Version */}
        <div className="flex-1 flex flex-col">
          <div className="px-4 py-2 border-b border-border bg-secondary/30">
            <span className="text-xs text-muted-foreground">
              {latestVersion.code[0]?.name || "component.tsx"} (v{latestVersion.versionNumber} - current)
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {newLines.map((line, i) => (
              <DiffLineComponent key={i} line={line} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
