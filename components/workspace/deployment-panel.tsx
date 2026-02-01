"use client";

import { 
  Rocket, 
  X, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  RefreshCw,
  Clock,
  AlertTriangle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeployment } from "@/hooks/use-deployment";
import { cn } from "@/lib/utils";
import type { DeploymentLog } from "@/lib/types";

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function LogEntry({ log }: { log: DeploymentLog }) {
  const iconMap = {
    info: <Clock className="h-3.5 w-3.5 text-muted-foreground" />,
    success: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />,
    warning: <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />,
    error: <XCircle className="h-3.5 w-3.5 text-red-500" />,
  };

  const colorMap = {
    info: "text-muted-foreground",
    success: "text-emerald-500",
    warning: "text-amber-500",
    error: "text-red-500",
  };

  return (
    <div className="flex items-start gap-2 py-1.5">
      <span className="text-xs text-muted-foreground/60 font-mono shrink-0">
        {formatTime(log.timestamp)}
      </span>
      {iconMap[log.type]}
      <span className={cn("text-sm font-mono", colorMap[log.type])}>
        {log.message}
      </span>
    </div>
  );
}

interface DeploymentPanelProps {
  open: boolean;
  onClose: () => void;
}

export function DeploymentPanel({ open, onClose }: DeploymentPanelProps) {
  const { deploy, cancel, isDeploying, deployment } = useDeployment();

  if (!open) return null;

  const status = deployment?.status || "idle";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative w-full max-w-2xl mx-4 bg-card border border-border rounded-xl shadow-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              status === "success" ? "bg-emerald-500/20" : 
              status === "failed" ? "bg-red-500/20" : "bg-accent/20"
            )}>
              {isDeploying ? (
                <Loader2 className="h-5 w-5 text-accent animate-spin" />
              ) : status === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : status === "failed" ? (
                <XCircle className="h-5 w-5 text-red-500" />
              ) : (
                <Rocket className="h-5 w-5 text-accent" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {isDeploying ? "Deploying..." : 
                 status === "success" ? "Deployment Successful" :
                 status === "failed" ? "Deployment Failed" : "Deploy to Production"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isDeploying ? "Building and deploying your application" :
                 status === "success" ? "Your app is now live" :
                 status === "failed" ? "There was a problem with the deployment" :
                 "Push your changes to Vercel"}
              </p>
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

        {/* Build Logs */}
        {deployment && deployment.logs.length > 0 && (
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <div className="px-4 py-2 border-b border-border bg-secondary/30 shrink-0">
              <span className="text-xs font-medium text-muted-foreground">Build Logs</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-background/50 font-mono text-sm">
              {deployment.logs.map((log) => (
                <LogEntry key={log.id} log={log} />
              ))}
              {isDeploying && (
                <div className="flex items-center gap-2 py-1.5 text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span className="text-sm">Running...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Success URL */}
        {status === "success" && deployment?.url && (
          <div className="p-4 border-t border-border bg-emerald-500/5 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Deployment URL</p>
                <a 
                  href={deployment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline font-medium"
                >
                  {deployment.url}
                </a>
              </div>
              <Button
                size="sm"
                className="gap-2"
                onClick={() => window.open(deployment.url, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
                Visit Site
              </Button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {status === "failed" && deployment?.error && (
          <div className="p-4 border-t border-border bg-red-500/5 shrink-0">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Deployment Error</p>
                <p className="text-sm text-muted-foreground mt-1">{deployment.error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-border shrink-0">
          {isDeploying ? (
            <Button variant="destructive" onClick={cancel}>
              Cancel Deployment
            </Button>
          ) : status === "failed" ? (
            <>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={deploy} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Retry Deployment
              </Button>
            </>
          ) : status === "success" ? (
            <Button variant="outline" onClick={onClose}>
              Done
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={deploy} className="gap-2">
                <Rocket className="h-4 w-4" />
                Deploy Now
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
