"use client";

import React from "react"

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/workspace/header";
import { Sidebar } from "@/components/workspace/sidebar";
import { PromptInput } from "@/components/workspace/prompt-input";
import { ChatPanel } from "@/components/workspace/chat-panel";
import { PreviewPanel } from "@/components/workspace/preview-panel";
import { CodePanel } from "@/components/workspace/code-panel";
import { ProjectModal } from "@/components/workspace/project-modal";
import { DeploymentPanel } from "@/components/workspace/deployment-panel";
import { VersionPanel } from "@/components/workspace/version-panel";
import { DiffViewer } from "@/components/workspace/diff-viewer";
import { TemplatesPanel } from "@/components/workspace/templates-panel";
import { DocsPanel } from "@/components/workspace/docs-panel";
import { WorkspaceProvider, useWorkspace } from "@/lib/store";
import { useGeneration } from "@/hooks/use-generation";
import { generatedComponents } from "@/components/workspace/generated-examples";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Eye, Code, History, Zap, Sparkles, Rocket, LogIn, ArrowRight, X } from "lucide-react";
import type { ViewMode } from "@/lib/types";
import { cn } from "@/lib/utils";

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useWorkspace();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background bg-noise">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div className="h-12 w-12 rounded-2xl btn-glitter" />
            <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-accent-foreground z-10" />
          </div>
          <p className="text-muted-foreground font-medium">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-background bg-noise">
        {/* Header */}
        <header className="glass flex items-center justify-between h-16 px-6 border-b border-border/50 sticky top-0 z-40">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl btn-glitter">
              <Zap className="h-5 w-5 text-accent-foreground relative z-10" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-glitter">Forge</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="sm" className="gap-2 btn-glitter relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Get Started
                </span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-sm font-medium mb-8 animate-fade-in shimmer-gold-fast border-glitter">
              <Sparkles className="h-4 w-4 text-accent gold-shine" />
              <span className="text-glitter">AI-Powered Engineering Workspace</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance mb-6 animate-slide-up-fade">
              Transform Ideas into
              <span className="text-glitter"> Production-Ready</span> Apps
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground text-pretty mb-12 max-w-2xl mx-auto leading-relaxed" style={{ animationDelay: "100ms" }}>
              Describe features in natural language and instantly generate UI
              components, layouts, and interaction flows. Deploy seamlessly with
              real-time previews.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4" style={{ animationDelay: "200ms" }}>
              <Link href="/auth/sign-up">
                <Button size="lg" className="gap-2 text-base px-8 h-12 btn-glitter relative overflow-hidden transition-smooth">
                  <span className="relative z-10 flex items-center gap-2">
                    <Rocket className="h-5 w-5" />
                    Start Building Free
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="text-base px-8 h-12 bg-transparent border-border/60 hover:bg-secondary/60 hover:border-border transition-smooth">
                  Sign In to Your Workspace
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-24">
            {[
              {
                icon: Sparkles,
                title: "Natural Language Input",
                description: "Describe what you want to build in plain English. Our AI understands context and generates production-ready code."
              },
              {
                icon: Eye,
                title: "Live Preview",
                description: "See your components come to life instantly with real-time preview. Test responsive layouts across all device sizes."
              },
              {
                icon: Rocket,
                title: "One-Click Deploy",
                description: "Deploy to Vercel with a single click. Get instant feedback through live deployments and shareable preview URLs."
              }
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className="group p-6 rounded-2xl border border-border/50 bg-card/50 hover:bg-card hover:border-accent/30 transition-smooth animate-slide-up-fade"
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl btn-glitter flex items-center justify-center mb-5 transition-smooth">
                  <feature.icon className="h-6 w-6 text-accent-foreground relative z-10" />
                </div>
                <h3 className="text-lg font-semibold mb-2 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 py-6 px-6">
          <div className="max-w-5xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
            <p>Built with Vercel, v0, and modern frontend tooling</p>
            <p className="font-medium">Ship fast, ship right</p>
          </div>
        </footer>
      </div>
    );
  }

  return <>{children}</>;
}

function WorkspaceContent() {
  const {
    state,
    activeProject,
    currentComponent,
    setViewMode,
    setViewport,
    saveVersion,
  } = useWorkspace();

  const { generate, isGenerating, error } = useGeneration();

  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [deploymentPanelOpen, setDeploymentPanelOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState("home");
  const [compareVersionId, setCompareVersionId] = useState<string | null>(null);
  const [mobileViewMode, setMobileViewMode] = useState<ViewMode>("preview");
  const [showTemplates, setShowTemplates] = useState(false);
  const [showDocs, setShowDocs] = useState(false);

  // Handle sidebar view changes
  const handleViewChange = useCallback((view: string) => {
    if (view === "templates") {
      setShowTemplates(true);
      setShowDocs(false);
    } else if (view === "docs") {
      setShowDocs(true);
      setShowTemplates(false);
    } else {
      setActiveView(view);
      setShowTemplates(false);
      setShowDocs(false);
    }
  }, []);

  // Handle template use
  const handleUseTemplate = useCallback((prompt: string) => {
    setShowTemplates(false);
    generate(prompt);
  }, [generate]);

  // Get the generated component preview
  const CurrentGeneratedComponent = useMemo(() => {
    if (!currentComponent) return null;
    return generatedComponents[currentComponent.name] || null;
  }, [currentComponent]);

  // Get current code
  const currentCode = currentComponent?.code || "";

  // Handle generation
  const handleGenerate = useCallback(
    (prompt: string) => {
      generate(prompt);
    },
    [generate]
  );

  // Handle retry
  const handleRetry = useCallback(
    (content: string) => {
      const messages = state.messages;
      const lastUserMessage = [...messages]
        .reverse()
        .find((m) => m.role === "user");
      if (lastUserMessage) {
        generate(lastUserMessage.content);
      }
    },
    [generate, state.messages]
  );

  // Handle version save
  const handleSaveVersion = useCallback(() => {
    if (currentComponent) {
      saveVersion(currentComponent.id, `Manual save`);
    }
  }, [currentComponent, saveVersion]);

  // Handle compare
  const handleCompare = useCallback(
    (versionId: string) => {
      setCompareVersionId(versionId);
      setViewMode("diff");
    },
    [setViewMode]
  );

  // Determine what to show based on view mode
  const showDiffViewer = state.viewMode === "diff" && compareVersionId;

  return (
    <div className="flex flex-col h-screen bg-background bg-noise">
      <Header
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onDeploy={() => setDeploymentPanelOpen(true)}
        onCreateProject={() => setProjectModalOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <Sidebar
            activeView={showTemplates ? "templates" : showDocs ? "docs" : activeView}
            onViewChange={handleViewChange}
            onCreateProject={() => setProjectModalOpen(true)}
          />
        )}

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Chat/Prompt */}
          <div className="flex flex-col w-full lg:w-[45%] xl:w-[40%] border-r border-border/50 bg-card/30">
            <ChatPanel
              messages={state.messages}
              isGenerating={isGenerating}
              onRetry={handleRetry}
              hasProject={!!activeProject}
              onCreateProject={() => setProjectModalOpen(true)}
            />
            <div className="p-4 border-t border-border/50 bg-card/50">
              <PromptInput
                onSubmit={handleGenerate}
                isGenerating={isGenerating}
                disabled={!activeProject}
                error={error}
              />
            </div>
          </div>

          {/* Right Panel - Preview/Code/History */}
          <div className="hidden lg:flex flex-col flex-1 min-w-0">
            {/* Tablet view mode tabs */}
            <div className="flex items-center justify-between h-12 px-4 border-b border-border/50 glass xl:hidden">
              <Tabs
                value={mobileViewMode}
                onValueChange={(v) => setMobileViewMode(v as ViewMode)}
              >
                <TabsList className="h-8 bg-secondary/50">
                  <TabsTrigger value="preview" className="text-xs px-3 gap-1.5 data-[state=active]:bg-secondary">
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="code" className="text-xs px-3 gap-1.5 data-[state=active]:bg-secondary">
                    <Code className="h-3.5 w-3.5" />
                    Code
                  </TabsTrigger>
                  <TabsTrigger value="diff" className="text-xs px-3 gap-1.5 data-[state=active]:bg-secondary">
                    <History className="h-3.5 w-3.5" />
                    History
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Desktop split view */}
            <div className="hidden xl:flex flex-1 overflow-hidden">
              {showDiffViewer ? (
                <DiffViewer
                  compareVersionId={compareVersionId}
                  onClose={() => {
                    setCompareVersionId(null);
                    setViewMode("preview");
                  }}
                />
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <PreviewPanel
                      content={
                        CurrentGeneratedComponent ? (
                          <CurrentGeneratedComponent />
                        ) : null
                      }
                      isGenerating={isGenerating}
                      viewport={state.viewport}
                      onViewportChange={setViewport}
                    />
                  </div>
                  <div className="w-[45%] min-w-[400px] flex">
                    <div className="flex-1">
                      <CodePanel
                        code={currentCode}
                        isGenerating={isGenerating}
                        onSaveVersion={
                          currentComponent ? handleSaveVersion : undefined
                        }
                      />
                    </div>
                    <div className="w-64 border-l border-border/50">
                      <VersionPanel onCompare={handleCompare} />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Tablet single panel view */}
            <div className="flex xl:hidden flex-1 overflow-hidden">
              {mobileViewMode === "preview" ? (
                <PreviewPanel
                  content={
                    CurrentGeneratedComponent ? (
                      <CurrentGeneratedComponent />
                    ) : null
                  }
                  isGenerating={isGenerating}
                  viewport={state.viewport}
                  onViewportChange={setViewport}
                />
              ) : mobileViewMode === "code" ? (
                <CodePanel
                  code={currentCode}
                  isGenerating={isGenerating}
                  onSaveVersion={
                    currentComponent ? handleSaveVersion : undefined
                  }
                />
              ) : (
                <VersionPanel onCompare={handleCompare} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProjectModal
        open={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
      />
      <DeploymentPanel
        open={deploymentPanelOpen}
        onClose={() => setDeploymentPanelOpen(false)}
      />

      {/* Templates Slide Panel */}
      {showTemplates && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-background/70 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowTemplates(false)}
          />
          <div className="relative ml-auto w-full max-w-md border-l border-border/50 bg-sidebar shadow-2xl animate-in slide-in-from-right duration-200">
            <button
              onClick={() => setShowTemplates(false)}
              className="absolute right-4 top-4 p-2 rounded-lg hover:bg-secondary/60 transition-smooth z-10"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
            <TemplatesPanel onUseTemplate={handleUseTemplate} />
          </div>
        </div>
      )}

      {/* Docs Slide Panel */}
      {showDocs && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-background/70 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowDocs(false)}
          />
          <div className="relative ml-auto w-full max-w-lg border-l border-border/50 bg-sidebar shadow-2xl animate-in slide-in-from-right duration-200">
            <button
              onClick={() => setShowDocs(false)}
              className="absolute right-4 top-4 p-2 rounded-lg hover:bg-secondary/60 transition-smooth z-10"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
            <DocsPanel />
          </div>
        </div>
      )}
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <WorkspaceProvider>
      <AuthGate>
        <WorkspaceContent />
      </AuthGate>
    </WorkspaceProvider>
  );
}
