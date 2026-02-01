"use client";

import { History, RotateCcw, GitCompare, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Version } from "@/lib/types";

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

interface VersionItemProps {
  version: Version;
  isSelected: boolean;
  isCurrent: boolean;
  onSelect: () => void;
  onRestore: () => void;
  onCompare: () => void;
}

function VersionItem({ version, isSelected, isCurrent, onSelect, onRestore, onCompare }: VersionItemProps) {
  return (
    <div
      className={cn(
        "group flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer",
        isSelected
          ? "bg-accent/10 border-accent"
          : "bg-secondary/30 border-border hover:border-muted-foreground"
      )}
      onClick={onSelect}
    >
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
        isCurrent ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
      )}>
        {isCurrent ? (
          <Check className="h-4 w-4" />
        ) : (
          <span className="text-xs font-medium">v{version.versionNumber}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {version.label || `Version ${version.versionNumber}`}
          </span>
          {isCurrent && (
            <span className="px-1.5 py-0.5 bg-accent/20 text-accent text-xs rounded">
              Current
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {formatTimeAgo(version.createdAt)}
        </div>
      </div>
      {!isCurrent && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onCompare();
            }}
            title="Compare with current"
          >
            <GitCompare className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onRestore();
            }}
            title="Restore this version"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

interface VersionPanelProps {
  onCompare: (versionId: string) => void;
}

export function VersionPanel({ onCompare }: VersionPanelProps) {
  const { state, currentVersions, restoreVersion, currentComponent } = useWorkspace();

  if (!currentComponent) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-3">
          <History className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">
          Generate a component to see version history
        </p>
      </div>
    );
  }

  if (currentVersions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-3">
          <History className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">
          No versions yet
        </p>
      </div>
    );
  }

  // Sort versions by version number descending (newest first)
  const sortedVersions = [...currentVersions].sort((a, b) => b.versionNumber - a.versionNumber);
  const latestVersion = sortedVersions[0];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Version History</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {currentVersions.length} version{currentVersions.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {sortedVersions.map((version) => (
          <VersionItem
            key={version.id}
            version={version}
            isSelected={state.selectedVersionId === version.id}
            isCurrent={version.id === latestVersion.id}
            onSelect={() => {
              // Toggle selection
            }}
            onRestore={() => restoreVersion(version.id)}
            onCompare={() => onCompare(version.id)}
          />
        ))}
      </div>
    </div>
  );
}
