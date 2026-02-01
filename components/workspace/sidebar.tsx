"use client";

import React from "react";
import { 
  Home, 
  Layers, 
  FileCode, 
  Settings, 
  History,
  Plus,
  ChevronRight,
  Trash2,
  FolderOpen,
  Check,
  LayoutTemplate,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/lib/store";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/types";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function SidebarItem({ icon, label, active, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-smooth",
        active 
          ? "text-foreground" 
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
      )}
    >
      {/* Active indicator with gold glitter */}
      {active && (
        <div className="absolute inset-0 rounded-lg bg-secondary border-glitter" />
      )}
      <span className={cn("relative z-10", active && "text-accent gold-shine")}>{icon}</span>
      <span className="relative z-10">{label}</span>
    </button>
  );
}

interface ProjectItemProps {
  project: Project;
  active?: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

function ProjectItem({ project, active, onSelect, onDelete }: ProjectItemProps) {
  return (
    <div
      className={cn(
        "group relative flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-smooth cursor-pointer",
        active 
          ? "text-foreground" 
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
      )}
      onClick={onSelect}
    >
      {active && (
        <div className="absolute inset-0 rounded-lg bg-secondary/80" />
      )}
      {active ? (
        <Check className="h-3.5 w-3.5 text-accent shrink-0 relative z-10" />
      ) : (
        <ChevronRight className="h-3.5 w-3.5 shrink-0 relative z-10 opacity-50 group-hover:opacity-100" />
      )}
      <span className="truncate flex-1 relative z-10 font-medium">{project.name}</span>
      <button
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/20 rounded-md transition-smooth relative z-10"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        title="Delete project"
      >
        <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
      </button>
    </div>
  );
}

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onCreateProject: () => void;
}

export function Sidebar({ activeView, onViewChange, onCreateProject }: SidebarProps) {
  const { state, switchProject, deleteProject, activeProject } = useWorkspace();

  // Get components for active project
  const projectComponents = state.generatedComponents.filter(
    (c) => c.projectId === activeProject?.id
  );

  // Sort projects by most recently updated
  const sortedProjects = [...state.projects].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <aside className="hidden lg:flex flex-col w-60 border-r border-border/50 bg-sidebar bg-noise">
      <div className="flex-1 p-3 space-y-6 overflow-y-auto scrollbar-thin">
        {/* Main Navigation */}
        <nav className="space-y-1">
          <SidebarItem 
            icon={<Home className="h-4 w-4" />} 
            label="Home" 
            active={activeView === "home"}
            onClick={() => onViewChange("home")}
          />
          <SidebarItem 
            icon={<Layers className="h-4 w-4" />} 
            label="Components" 
            active={activeView === "components"}
            onClick={() => onViewChange("components")}
          />
          <SidebarItem 
            icon={<FileCode className="h-4 w-4" />} 
            label="Code" 
            active={activeView === "code"}
            onClick={() => onViewChange("code")}
          />
          <SidebarItem 
            icon={<History className="h-4 w-4" />} 
            label="History" 
            active={activeView === "history"}
            onClick={() => onViewChange("history")}
          />
          
          {/* Separator */}
          <div className="h-px bg-border/50 my-3" />
          
          <SidebarItem 
            icon={<LayoutTemplate className="h-4 w-4" />} 
            label="Templates" 
            active={activeView === "templates"}
            onClick={() => onViewChange("templates")}
          />
          <SidebarItem 
            icon={<BookOpen className="h-4 w-4" />} 
            label="Docs" 
            active={activeView === "docs"}
            onClick={() => onViewChange("docs")}
          />
        </nav>

        {/* Projects Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-3">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Projects
            </span>
            <button 
              className="p-1.5 hover:bg-secondary/60 rounded-md transition-smooth group"
              onClick={onCreateProject}
              title="Create new project"
            >
              <Plus className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent transition-colors" />
            </button>
          </div>
          <nav className="space-y-0.5">
            {sortedProjects.length > 0 ? (
              sortedProjects.map((project) => (
                <ProjectItem
                  key={project.id}
                  project={project}
                  active={project.id === activeProject?.id}
                  onSelect={() => switchProject(project.id)}
                  onDelete={() => deleteProject(project.id)}
                />
              ))
            ) : (
              <div className="px-3 py-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-secondary/60 flex items-center justify-center mx-auto mb-3">
                  <FolderOpen className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mb-3">No projects yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 bg-transparent border-border/60 hover:bg-secondary/60 hover:border-border"
                  onClick={onCreateProject}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create Project
                </Button>
              </div>
            )}
          </nav>
        </div>

        {/* Recent Components */}
        {projectComponents.length > 0 && (
          <div className="space-y-2">
            <div className="h-px bg-border/50" />
            <div className="flex items-center px-3 pt-2">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Recent
              </span>
            </div>
            <nav className="space-y-0.5">
              {projectComponents.slice(0, 5).map((component) => (
                <button
                  key={component.id}
                  className={cn(
                    "flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm transition-smooth",
                    state.currentComponentId === component.id
                      ? "bg-secondary/80 text-foreground" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  )}
                >
                  <Layers className="h-3.5 w-3.5 shrink-0 text-accent/70" />
                  <span className="truncate font-medium">{component.name}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border/50">
        <SidebarItem 
          icon={<Settings className="h-4 w-4" />} 
          label="Settings" 
          active={activeView === "settings"}
          onClick={() => onViewChange("settings")}
        />
      </div>
    </aside>
  );
}
