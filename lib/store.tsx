"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import * as db from "@/lib/supabase/database";
import type {
  WorkspaceState,
  WorkspaceAction,
  Project,
  Message,
  GeneratedComponent,
  Version,
  Deployment,
  GenerationStatus,
  ViewMode,
  ViewportSize,
} from "./types";

const initialState: WorkspaceState = {
  projects: [],
  activeProjectId: null,
  messages: [],
  generationStatus: "idle",
  generationError: null,
  generatedComponents: [],
  currentComponentId: null,
  versions: [],
  selectedVersionId: null,
  viewMode: "preview",
  viewport: "desktop",
  deployment: null,
  sidebarOpen: true,
  settingsOpen: false,
  searchQuery: "",
};

function workspaceReducer(
  state: WorkspaceState,
  action: WorkspaceAction
): WorkspaceState {
  switch (action.type) {
    case "SET_PROJECTS":
      return { ...state, projects: action.payload };

    case "ADD_PROJECT":
      return { ...state, projects: [...state.projects, action.payload] };

    case "UPDATE_PROJECT":
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
        ),
      };

    case "DELETE_PROJECT":
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== action.payload),
        activeProjectId:
          state.activeProjectId === action.payload
            ? null
            : state.activeProjectId,
      };

    case "SET_ACTIVE_PROJECT":
      return { ...state, activeProjectId: action.payload };

    case "SET_MESSAGES":
      return { ...state, messages: action.payload };

    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };

    case "UPDATE_MESSAGE":
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.payload.id ? { ...m, ...action.payload.updates } : m
        ),
      };

    case "CLEAR_MESSAGES":
      return { ...state, messages: [] };

    case "SET_GENERATION_STATUS":
      return { ...state, generationStatus: action.payload };

    case "SET_GENERATION_ERROR":
      return { ...state, generationError: action.payload };

    case "SET_GENERATED_COMPONENTS":
      return { ...state, generatedComponents: action.payload };

    case "ADD_GENERATED_COMPONENT":
      return {
        ...state,
        generatedComponents: [...state.generatedComponents, action.payload],
      };

    case "UPDATE_GENERATED_COMPONENT":
      return {
        ...state,
        generatedComponents: state.generatedComponents.map((c) =>
          c.id === action.payload.id ? { ...c, ...action.payload.updates } : c
        ),
      };

    case "DELETE_GENERATED_COMPONENT":
      return {
        ...state,
        generatedComponents: state.generatedComponents.filter(
          (c) => c.id !== action.payload
        ),
        currentComponentId:
          state.currentComponentId === action.payload
            ? null
            : state.currentComponentId,
      };

    case "SET_CURRENT_COMPONENT":
      return { ...state, currentComponentId: action.payload };

    case "SET_VERSIONS":
      return { ...state, versions: action.payload };

    case "ADD_VERSION":
      return { ...state, versions: [...state.versions, action.payload] };

    case "SET_SELECTED_VERSION":
      return { ...state, selectedVersionId: action.payload };

    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.payload };

    case "SET_VIEWPORT":
      return { ...state, viewport: action.payload };

    case "SET_DEPLOYMENT":
      return { ...state, deployment: action.payload };

    case "UPDATE_DEPLOYMENT":
      return {
        ...state,
        deployment: state.deployment
          ? { ...state.deployment, ...action.payload }
          : null,
      };

    case "ADD_DEPLOYMENT_LOG":
      // Logs are stored in the database, not in local state
      return state;

    case "SET_SIDEBAR_OPEN":
      return { ...state, sidebarOpen: action.payload };

    case "SET_SETTINGS_OPEN":
      return { ...state, settingsOpen: action.payload };

    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };

    case "HYDRATE":
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

interface WorkspaceContextValue {
  state: WorkspaceState;
  dispatch: React.Dispatch<WorkspaceAction>;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  // Project actions
  createProject: (
    name: string,
    framework?: "nextjs" | "react" | "vue" | "svelte",
    description?: string
  ) => Promise<Project | null>;
  switchProject: (id: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  // Message actions
  addUserMessage: (content: string) => Promise<Message | null>;
  addAssistantMessage: (
    content: string,
    componentId?: string
  ) => Promise<Message | null>;
  addErrorMessage: (error: string, isRetryable?: boolean) => Message;
  clearMessages: () => void;
  // Generation actions
  setGenerationStatus: (status: GenerationStatus) => void;
  setGenerationError: (error: string | null) => void;
  // Component actions
  addGeneratedComponent: (
    component: Omit<GeneratedComponent, "id" | "createdAt">
  ) => Promise<GeneratedComponent | null>;
  updateComponent: (
    id: string,
    updates: Partial<GeneratedComponent>
  ) => Promise<void>;
  deleteComponent: (id: string) => Promise<void>;
  setCurrentComponent: (id: string | null) => void;
  // Version actions
  saveVersion: (
    componentId: string,
    description?: string
  ) => Promise<Version | null>;
  restoreVersion: (versionId: string) => Promise<void>;
  loadVersions: (componentId: string) => Promise<void>;
  // View actions
  setViewMode: (mode: ViewMode) => void;
  setViewport: (size: ViewportSize) => void;
  // Deployment actions
  startDeployment: () => Promise<void>;
  addDeploymentLog: (message: string, type: "info" | "success" | "warning" | "error") => void;
  completeDeployment: (url?: string) => Promise<void>;
  failDeployment: (error: string) => Promise<void>;
  // Computed values
  activeProject: Project | null;
  currentComponent: GeneratedComponent | null;
  currentVersions: Version[];
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(workspaceReducer, initialState);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  // Auth state listener
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        // Clear state on sign out
        dispatch({ type: "SET_PROJECTS", payload: [] });
        dispatch({ type: "SET_ACTIVE_PROJECT", payload: null });
        dispatch({ type: "CLEAR_MESSAGES" });
        dispatch({ type: "SET_GENERATED_COMPONENTS", payload: [] });
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // Load projects when user is authenticated
  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    const projects = await db.fetchProjects();
    dispatch({ type: "SET_PROJECTS", payload: projects });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Project actions
  const createProject = useCallback(
    async (
      name: string,
      framework: "nextjs" | "react" | "vue" | "svelte" = "nextjs",
      description = ""
    ): Promise<Project | null> => {
      const project = await db.createProject({ name, framework, description });
      if (project) {
        dispatch({ type: "ADD_PROJECT", payload: project });
        dispatch({ type: "SET_ACTIVE_PROJECT", payload: project.id });
        dispatch({ type: "CLEAR_MESSAGES" });
        dispatch({ type: "SET_GENERATED_COMPONENTS", payload: [] });
        dispatch({ type: "SET_VERSIONS", payload: [] });
      }
      return project;
    },
    []
  );

  const switchProject = useCallback(async (id: string) => {
    dispatch({ type: "SET_ACTIVE_PROJECT", payload: id });
    dispatch({ type: "SET_CURRENT_COMPONENT", payload: null });
    dispatch({ type: "SET_VERSIONS", payload: [] });

    // Load messages and components for this project
    const [messages, components] = await Promise.all([
      db.fetchMessages(id),
      db.fetchComponents(id),
    ]);

    dispatch({ type: "SET_MESSAGES", payload: messages });
    dispatch({ type: "SET_GENERATED_COMPONENTS", payload: components });
  }, []);

  const deleteProject = useCallback(
    async (id: string) => {
      const success = await db.deleteProject(id);
      if (success) {
        dispatch({ type: "DELETE_PROJECT", payload: id });
        if (state.activeProjectId === id) {
          dispatch({ type: "CLEAR_MESSAGES" });
          dispatch({ type: "SET_GENERATED_COMPONENTS", payload: [] });
        }
      }
    },
    [state.activeProjectId]
  );

  // Message actions
  const addUserMessage = useCallback(
    async (content: string): Promise<Message | null> => {
      if (!state.activeProjectId) return null;

      const message = await db.createMessage(state.activeProjectId, {
        role: "user",
        content,
      });

      if (message) {
        dispatch({ type: "ADD_MESSAGE", payload: message });
      }
      return message;
    },
    [state.activeProjectId]
  );

  const addAssistantMessage = useCallback(
    async (content: string, componentName?: string): Promise<Message | null> => {
      if (!state.activeProjectId) return null;

      const message = await db.createMessage(state.activeProjectId, {
        role: "assistant",
        content,
        componentName,
      });

      if (message) {
        dispatch({ type: "ADD_MESSAGE", payload: message });
      }
      return message;
    },
    [state.activeProjectId]
  );

  const addErrorMessage = useCallback(
    (error: string, isRetryable = true): Message => {
      const message: Message = {
        id: `msg_${Date.now() + 1}`,
        role: "assistant",
        content: "I encountered an issue while generating your component.",
        timestamp: new Date(),
        error,
        isRetryable,
      };
      dispatch({ type: "ADD_MESSAGE", payload: message });
      return message;
    },
    []
  );

  const clearMessages = useCallback(() => {
    dispatch({ type: "CLEAR_MESSAGES" });
  }, []);

  // Generation actions
  const setGenerationStatus = useCallback((status: GenerationStatus) => {
    dispatch({ type: "SET_GENERATION_STATUS", payload: status });
  }, []);

  const setGenerationError = useCallback((error: string | null) => {
    dispatch({ type: "SET_GENERATION_ERROR", payload: error });
  }, []);

  // Component actions
  const addGeneratedComponent = useCallback(
    async (
      component: Omit<GeneratedComponent, "id" | "createdAt">
    ): Promise<GeneratedComponent | null> => {
      if (!state.activeProjectId) return null;

      const newComponent = await db.createComponent(
        state.activeProjectId,
        component
      );

      if (newComponent) {
        dispatch({ type: "ADD_GENERATED_COMPONENT", payload: newComponent });
        dispatch({ type: "SET_CURRENT_COMPONENT", payload: newComponent.id });

        // Auto-save initial version
        await db.createVersion(newComponent.id, {
          versionNumber: 1,
          code: newComponent.code,
          label: "Initial generation",
        });
      }

      return newComponent;
    },
    [state.activeProjectId]
  );

  const updateComponent = useCallback(
    async (id: string, updates: Partial<GeneratedComponent>) => {
      const updated = await db.updateComponent(id, updates);
      if (updated) {
        dispatch({
          type: "UPDATE_GENERATED_COMPONENT",
          payload: { id, updates },
        });
      }
    },
    []
  );

  const deleteComponent = useCallback(async (id: string) => {
    const success = await db.deleteComponent(id);
    if (success) {
      dispatch({ type: "DELETE_GENERATED_COMPONENT", payload: id });
    }
  }, []);

  const setCurrentComponent = useCallback((id: string | null) => {
    dispatch({ type: "SET_CURRENT_COMPONENT", payload: id });
    dispatch({ type: "SET_SELECTED_VERSION", payload: null });
    if (id) {
      loadVersions(id);
    }
  }, []);

  // Version actions
  const loadVersions = useCallback(async (componentId: string) => {
    const versions = await db.fetchVersions(componentId);
    dispatch({ type: "SET_VERSIONS", payload: versions });
  }, []);

  const saveVersion = useCallback(
    async (
      componentId: string,
      description?: string
    ): Promise<Version | null> => {
      const component = state.generatedComponents.find(
        (c) => c.id === componentId
      );
      if (!component) return null;

      const existingVersions = state.versions.filter(
        (v) => v.componentId === componentId
      );

      const version = await db.createVersion(componentId, {
        versionNumber: existingVersions.length + 1,
        code: component.code,
        label: description,
      });

      if (version) {
        dispatch({ type: "ADD_VERSION", payload: version });
      }
      return version;
    },
    [state.generatedComponents, state.versions]
  );

  const restoreVersion = useCallback(
    async (versionId: string) => {
      const version = state.versions.find((v) => v.id === versionId);
      if (!version || !state.currentComponentId) return;

      await updateComponent(state.currentComponentId, { code: version.code });
      dispatch({ type: "SET_SELECTED_VERSION", payload: null });
    },
    [state.versions, state.currentComponentId, updateComponent]
  );

  // View actions
  const setViewMode = useCallback((mode: ViewMode) => {
    dispatch({ type: "SET_VIEW_MODE", payload: mode });
  }, []);

  const setViewport = useCallback((size: ViewportSize) => {
    dispatch({ type: "SET_VIEWPORT", payload: size });
  }, []);

  // Deployment actions
  const startDeployment = useCallback(async () => {
    if (!state.activeProjectId) return;

    const deploymentData = await db.createDeployment(state.activeProjectId, {
      status: "building",
    });

    if (deploymentData) {
      dispatch({ type: "SET_DEPLOYMENT", payload: deploymentData });
    }
  }, [state.activeProjectId]);

  const addDeploymentLog = useCallback(
    (message: string, type: "info" | "success" | "warning" | "error") => {
      // Save to database if we have a deployment
      if (state.deployment?.id) {
        db.createDeploymentLog(state.deployment.id, {
          logType: type,
          message,
        });
      }
    },
    [state.deployment?.id]
  );

  const completeDeployment = useCallback(async (url?: string) => {
    dispatch({
      type: "UPDATE_DEPLOYMENT",
      payload: { status: "success", url, completedAt: new Date() },
    });

    if (state.deployment?.id) {
      await db.updateDeployment(state.deployment.id, {
        status: "success",
        url,
      });
    }
  }, [state.deployment?.id]);

  const failDeployment = useCallback(async (error: string) => {
    dispatch({
      type: "UPDATE_DEPLOYMENT",
      payload: { status: "failed", error, completedAt: new Date() },
    });

    if (state.deployment?.id) {
      await db.updateDeployment(state.deployment.id, {
        status: "failed",
      });
    }
  }, [state.deployment?.id]);

  // Computed values
  const activeProject = useMemo(
    () => state.projects.find((p) => p.id === state.activeProjectId) || null,
    [state.projects, state.activeProjectId]
  );

  const currentComponent = useMemo(
    () =>
      state.generatedComponents.find(
        (c) => c.id === state.currentComponentId
      ) || null,
    [state.generatedComponents, state.currentComponentId]
  );

  const currentVersions = useMemo(
    () => state.versions.filter((v) => v.componentId === state.currentComponentId),
    [state.versions, state.currentComponentId]
  );

  const value: WorkspaceContextValue = {
    state,
    dispatch,
    user,
    isLoading,
    isAuthenticated: !!user,
    signOut,
    createProject,
    switchProject,
    deleteProject,
    addUserMessage,
    addAssistantMessage,
    addErrorMessage,
    clearMessages,
    setGenerationStatus,
    setGenerationError,
    addGeneratedComponent,
    updateComponent,
    deleteComponent,
    setCurrentComponent,
    saveVersion,
    restoreVersion,
    loadVersions,
    setViewMode,
    setViewport,
    startDeployment,
    addDeploymentLog,
    completeDeployment,
    failDeployment,
    activeProject,
    currentComponent,
    currentVersions,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
