"use client";

import { Sparkles, Github, Menu, Command, Search, ChevronDown, Rocket, LogOut, User, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useWorkspace } from "@/lib/store";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onToggleSidebar: () => void;
  onDeploy: () => void;
  onCreateProject: () => void;
  deployStatus?: "idle" | "deploying" | "success" | "error";
}

export function Header({ onToggleSidebar, onDeploy, onCreateProject, deployStatus = "idle" }: HeaderProps) {
  const { activeProject, user, signOut } = useWorkspace();
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Keyboard shortcut for search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="glass flex items-center justify-between h-14 px-4 border-b border-border/50 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden p-2 hover:bg-secondary/80 rounded-lg transition-smooth"
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5 text-muted-foreground" />
        </button>
        
        {/* Logo with Glitter Effect */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg btn-glitter">
            <Sparkles className="h-4 w-4 text-accent-foreground relative z-10" />
          </div>
          <span className="font-semibold text-glitter tracking-tight text-[15px]">Forge</span>
        </div>
        
        {/* Project Indicator */}
        {activeProject ? (
          <button className="hidden md:flex items-center gap-2 px-2.5 py-1.5 bg-secondary/60 hover:bg-secondary rounded-lg text-sm transition-smooth group">
            <span className="text-muted-foreground/60">/</span>
            <span className="text-foreground font-medium">{activeProject.name}</span>
            <span className="text-[11px] px-1.5 py-0.5 accent-gradient text-accent-foreground rounded font-medium">
              {activeProject.framework}
            </span>
            <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:flex text-muted-foreground hover:text-foreground gap-1.5 hover:bg-secondary/60"
            onClick={onCreateProject}
          >
            <span>Create Project</span>
          </Button>
        )}

        <nav className="hidden lg:flex items-center gap-0.5 ml-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-secondary/60 px-3">
            Workspace
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-secondary/60 px-3">
            Templates
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-secondary/60 px-3">
            Docs
          </Button>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <button 
          className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-input/60 border border-border/60 rounded-lg text-sm text-muted-foreground hover:border-muted-foreground/50 hover:bg-input transition-smooth"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="h-4 w-4" />
          <span className="hidden lg:inline">Search...</span>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-secondary/80 rounded text-[11px] font-medium text-muted-foreground border border-border/50">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </button>
        
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-secondary/60">
          <Github className="h-5 w-5" />
        </Button>
        
        {/* Deploy Button with Glitter Effect */}
        <Button 
          size="sm" 
          className={cn(
            "hidden sm:flex gap-2 transition-smooth relative overflow-hidden",
            deployStatus === "deploying" && "opacity-80",
            deployStatus === "success" && "btn-glitter",
            deployStatus === "error" && "bg-destructive hover:bg-destructive/90",
            deployStatus === "idle" && "btn-glitter"
          )}
          onClick={onDeploy}
          disabled={!activeProject || deployStatus === "deploying"}
        >
          <span className="relative z-10 flex items-center gap-2">
            {deployStatus === "deploying" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Deploying...</span>
              </>
            ) : deployStatus === "success" ? (
              <>
                <Check className="h-4 w-4" />
                <span>Deployed</span>
              </>
            ) : (
              <>
                <Rocket className="h-4 w-4" />
                <span>Deploy</span>
              </>
            )}
          </span>
        </Button>

        {/* User Menu */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full transition-smooth",
                userMenuOpen 
                  ? "accent-gradient glow-accent-subtle" 
                  : "bg-secondary/80 hover:bg-secondary"
              )}
            >
              <User className={cn("h-4 w-4", userMenuOpen ? "text-accent-foreground" : "text-foreground")} />
            </button>
            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-60 py-1.5 glass border border-border/60 rounded-xl shadow-2xl z-50 animate-slide-up-fade">
                  <div className="px-3.5 py-2.5 border-b border-border/50">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.email}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">Workspace Member</p>
                  </div>
                  <div className="p-1.5">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        signOut();
                      }}
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-smooth"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
          <div 
            className="absolute inset-0 bg-background/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setSearchOpen(false)}
          />
          <div className="relative w-full max-w-lg mx-4 glass border border-border/60 rounded-xl shadow-2xl overflow-hidden animate-slide-up-fade">
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/50">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search components, projects, templates..."
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-[15px]"
                autoFocus
              />
              <kbd className="px-2 py-1 bg-secondary/80 rounded text-[11px] text-muted-foreground font-medium border border-border/50">
                ESC
              </kbd>
            </div>
            <div className="p-6">
              <p className="text-sm text-muted-foreground text-center py-6">
                Start typing to search...
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
