// Core types for the AI Engineering Workspace

export type Framework = "nextjs" | "react" | "vue" | "svelte";
export type ProjectStatus = "active" | "archived" | "draft";
export type GenerationStatus =
  | "idle"
  | "validating"
  | "generating"
  | "success"
  | "error";
export type DeploymentStatus =
  | "idle"
  | "building"
  | "deploying"
  | "success"
  | "failed";
export type ViewMode = "preview" | "code" | "diff";
export type ViewportSize = "desktop" | "tablet" | "mobile";

export interface Project {
  id: string;
  name: string;
  description?: string;
  framework: Framework;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  componentName?: string;
  error?: string;
  isRetryable?: boolean;
}

export interface GeneratedComponent {
  id: string;
  name: string;
  prompt: string;
  code: string;
  createdAt: Date;
}

export interface Version {
  id: string;
  componentId?: string;
  versionNumber: number;
  code: string;
  label?: string;
  createdAt: Date;
}

export interface Deployment {
  id: string;
  projectId?: string;
  status: DeploymentStatus;
  url?: string;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface DeploymentLog {
  id: string;
  timestamp: Date;
  message: string;
  type: "info" | "success" | "warning" | "error";
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface WorkspaceState {
  // Projects
  projects: Project[];
  activeProjectId: string | null;

  // Chat
  messages: Message[];

  // Generation
  generationStatus: GenerationStatus;
  generationError: string | null;

  // Components
  generatedComponents: GeneratedComponent[];
  currentComponentId: string | null;

  // Versions
  versions: Version[];
  selectedVersionId: string | null;

  // View
  viewMode: ViewMode;
  viewport: ViewportSize;

  // Deployment
  deployment: Deployment | null;

  // UI State
  sidebarOpen: boolean;
  settingsOpen: boolean;
  searchQuery: string;
}

// Action types for state management
export type WorkspaceAction =
  | { type: "SET_PROJECTS"; payload: Project[] }
  | { type: "ADD_PROJECT"; payload: Project }
  | {
      type: "UPDATE_PROJECT";
      payload: { id: string; updates: Partial<Project> };
    }
  | { type: "DELETE_PROJECT"; payload: string }
  | { type: "SET_ACTIVE_PROJECT"; payload: string | null }
  | { type: "SET_MESSAGES"; payload: Message[] }
  | { type: "ADD_MESSAGE"; payload: Message }
  | {
      type: "UPDATE_MESSAGE";
      payload: { id: string; updates: Partial<Message> };
    }
  | { type: "CLEAR_MESSAGES" }
  | { type: "SET_GENERATION_STATUS"; payload: GenerationStatus }
  | { type: "SET_GENERATION_ERROR"; payload: string | null }
  | { type: "SET_GENERATED_COMPONENTS"; payload: GeneratedComponent[] }
  | { type: "ADD_GENERATED_COMPONENT"; payload: GeneratedComponent }
  | {
      type: "UPDATE_GENERATED_COMPONENT";
      payload: { id: string; updates: Partial<GeneratedComponent> };
    }
  | { type: "DELETE_GENERATED_COMPONENT"; payload: string }
  | { type: "SET_CURRENT_COMPONENT"; payload: string | null }
  | { type: "SET_VERSIONS"; payload: Version[] }
  | { type: "ADD_VERSION"; payload: Version }
  | { type: "SET_SELECTED_VERSION"; payload: string | null }
  | { type: "SET_VIEW_MODE"; payload: ViewMode }
  | { type: "SET_VIEWPORT"; payload: ViewportSize }
  | { type: "SET_DEPLOYMENT"; payload: Deployment | null }
  | { type: "UPDATE_DEPLOYMENT"; payload: Partial<Deployment> }
  | { type: "ADD_DEPLOYMENT_LOG"; payload: DeploymentLog }
  | { type: "SET_SIDEBAR_OPEN"; payload: boolean }
  | { type: "SET_SETTINGS_OPEN"; payload: boolean }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "HYDRATE"; payload: Partial<WorkspaceState> };
