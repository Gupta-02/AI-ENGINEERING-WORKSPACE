"use client";

import { createClient } from "@/lib/supabase/client";
import type {
  Project,
  Message,
  GeneratedComponent,
  Version,
  Deployment,
} from "@/lib/types";

// =============================================================================
// Projects
// =============================================================================

export async function fetchProjects(): Promise<Project[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error.message);
    return [];
  }

  return data.map(mapProjectFromDb);
}

export async function createProject(
  project: Omit<Project, "id" | "createdAt" | "updatedAt">
): Promise<Project | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("User not authenticated");
    return null;
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      name: project.name,
      description: project.description,
      framework: project.framework,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating project:", error.message);
    return null;
  }

  return mapProjectFromDb(data);
}

export async function updateProject(
  id: string,
  updates: Partial<Project>
): Promise<Project | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .update({
      name: updates.name,
      description: updates.description,
      framework: updates.framework,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating project:", error.message);
    return null;
  }

  return mapProjectFromDb(data);
}

export async function deleteProject(id: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    console.error("Error deleting project:", error.message);
    return false;
  }

  return true;
}

// =============================================================================
// Messages
// =============================================================================

export async function fetchMessages(projectId: string): Promise<Message[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error.message);
    return [];
  }

  return data.map(mapMessageFromDb);
}

export async function createMessage(
  projectId: string,
  message: Omit<Message, "id" | "timestamp">
): Promise<Message | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("User not authenticated for createMessage");
    return null;
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      project_id: projectId,
      user_id: user.id,
      role: message.role,
      content: message.content,
      component_name: message.componentName || null,
      error: message.error || null,
      is_retryable: message.isRetryable ?? true,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating message:", error.message);
    return null;
  }

  return mapMessageFromDb(data);
}

// =============================================================================
// Generated Components
// =============================================================================

export async function fetchComponents(
  projectId: string
): Promise<GeneratedComponent[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("generated_components")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching components:", error.message);
    return [];
  }

  return data.map(mapComponentFromDb);
}

export async function createComponent(
  projectId: string,
  component: Omit<GeneratedComponent, "id" | "createdAt">
): Promise<GeneratedComponent | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("User not authenticated for createComponent");
    return null;
  }

  const { data, error } = await supabase
    .from("generated_components")
    .insert({
      project_id: projectId,
      user_id: user.id,
      name: component.name,
      prompt: component.prompt,
      code: component.code,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating component:", error.message);
    return null;
  }

  // Update project's updated_at
  await supabase
    .from("projects")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", projectId);

  return mapComponentFromDb(data);
}

export async function updateComponent(
  id: string,
  updates: Partial<GeneratedComponent>
): Promise<GeneratedComponent | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("generated_components")
    .update({
      name: updates.name,
      code: updates.code,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating component:", error.message);
    return null;
  }

  return mapComponentFromDb(data);
}

export async function deleteComponent(id: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("generated_components")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting component:", error.message);
    return false;
  }

  return true;
}

// =============================================================================
// Versions
// =============================================================================

export async function fetchVersions(componentId: string): Promise<Version[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("component_versions")
    .select("*")
    .eq("component_id", componentId)
    .order("version_number", { ascending: false });

  if (error) {
    console.error("Error fetching versions:", error.message);
    return [];
  }

  return data.map(mapVersionFromDb);
}

export async function createVersion(
  componentId: string,
  version: Omit<Version, "id" | "createdAt">
): Promise<Version | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("User not authenticated for createVersion");
    return null;
  }

  // Get the next version number
  const { data: existing } = await supabase
    .from("component_versions")
    .select("version_number")
    .eq("component_id", componentId)
    .order("version_number", { ascending: false })
    .limit(1);

  const nextVersion = existing && existing.length > 0 ? existing[0].version_number + 1 : 1;

  const { data, error } = await supabase
    .from("component_versions")
    .insert({
      component_id: componentId,
      user_id: user.id,
      version_number: nextVersion,
      code: version.code,
      label: version.label || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating version:", error.message);
    return null;
  }

  return mapVersionFromDb(data);
}

// =============================================================================
// Deployments
// =============================================================================

export async function fetchDeployments(
  projectId: string
): Promise<Deployment[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("deployments")
    .select("*")
    .eq("project_id", projectId)
    .order("started_at", { ascending: false });

  if (error) {
    console.error("Error fetching deployments:", error.message);
    return [];
  }

  return data.map(mapDeploymentFromDb);
}

export async function createDeployment(
  projectId: string,
  deployment: Omit<Deployment, "id" | "createdAt">
): Promise<Deployment | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("User not authenticated for createDeployment");
    return null;
  }

  const { data, error } = await supabase
    .from("deployments")
    .insert({
      project_id: projectId,
      user_id: user.id,
      status: deployment.status,
      url: deployment.url || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating deployment:", error.message);
    return null;
  }

  return mapDeploymentFromDb(data);
}

export async function updateDeployment(
  id: string,
  updates: Partial<Deployment>
): Promise<Deployment | null> {
  const supabase = createClient();
  
  const updateData: Record<string, unknown> = {};
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.url !== undefined) updateData.url = updates.url;
  if (updates.error !== undefined) updateData.error = updates.error;
  if (updates.status === "success" || updates.status === "failed") {
    updateData.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("deployments")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating deployment:", error.message);
    return null;
  }

  return mapDeploymentFromDb(data);
}

// =============================================================================
// Deployment Logs
// =============================================================================

export async function createDeploymentLog(
  deploymentId: string,
  log: { logType: string; message: string }
): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("User not authenticated for createDeploymentLog");
    return;
  }

  await supabase.from("deployment_logs").insert({
    deployment_id: deploymentId,
    user_id: user.id,
    log_type: log.logType,
    message: log.message,
  });
}

export async function fetchDeploymentLogs(
  deploymentId: string
): Promise<Array<{ logType: string; message: string; timestamp: Date }>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("deployment_logs")
    .select("*")
    .eq("deployment_id", deploymentId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching deployment logs:", error.message);
    return [];
  }

  return data.map((log) => ({
    logType: log.log_type,
    message: log.message,
    timestamp: new Date(log.created_at),
  }));
}

// =============================================================================
// Mappers
// =============================================================================

function mapProjectFromDb(data: Record<string, unknown>): Project {
  return {
    id: data.id as string,
    name: data.name as string,
    description: (data.description as string) || "",
    framework: (data.framework as Project["framework"]) || "nextjs",
    createdAt: new Date(data.created_at as string),
    updatedAt: new Date(data.updated_at as string),
  };
}

function mapMessageFromDb(data: Record<string, unknown>): Message {
  return {
    id: data.id as string,
    role: data.role as Message["role"],
    content: data.content as string,
    timestamp: new Date(data.created_at as string),
    componentName: (data.component_name as string) || undefined,
    error: (data.error as string) || undefined,
    isRetryable: data.is_retryable as boolean,
  };
}

function mapComponentFromDb(data: Record<string, unknown>): GeneratedComponent {
  return {
    id: data.id as string,
    name: data.name as string,
    prompt: data.prompt as string,
    code: typeof data.code === "string" ? data.code : JSON.stringify(data.code),
    createdAt: new Date(data.created_at as string),
  };
}

function mapVersionFromDb(data: Record<string, unknown>): Version {
  return {
    id: data.id as string,
    versionNumber: data.version_number as number,
    code: typeof data.code === "string" ? data.code : JSON.stringify(data.code),
    label: (data.label as string) || "",
    createdAt: new Date(data.created_at as string),
  };
}

function mapDeploymentFromDb(data: Record<string, unknown>): Deployment {
  return {
    id: data.id as string,
    status: data.status as Deployment["status"],
    url: (data.url as string) || undefined,
    error: (data.error as string) || undefined,
    createdAt: new Date(data.started_at as string),
  };
}
