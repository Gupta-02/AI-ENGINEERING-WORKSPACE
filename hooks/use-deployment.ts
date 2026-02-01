"use client";

import { useCallback, useRef } from "react";
import { useWorkspace } from "@/lib/store";

const DEPLOYMENT_STEPS = [
  { message: "Installing dependencies...", duration: 800 },
  { message: "Building application...", duration: 1200 },
  { message: "Optimizing assets...", duration: 600 },
  { message: "Running type checks...", duration: 500 },
  { message: "Generating static pages...", duration: 700 },
  { message: "Deploying to edge network...", duration: 1000 },
  { message: "Configuring CDN...", duration: 400 },
  { message: "Verifying deployment...", duration: 300 },
];

export function useDeployment() {
  const {
    state,
    startDeployment,
    addDeploymentLog,
    completeDeployment,
    failDeployment,
    activeProject,
  } = useWorkspace();

  const abortControllerRef = useRef<AbortController | null>(null);

  const deploy = useCallback(async (): Promise<boolean> => {
    if (!activeProject) {
      return false;
    }

    // Start deployment
    startDeployment();
    abortControllerRef.current = new AbortController();

    addDeploymentLog("Starting deployment pipeline...", "info");

    try {
      for (const step of DEPLOYMENT_STEPS) {
        // Check for abort
        if (abortControllerRef.current?.signal.aborted) {
          throw new Error("Deployment cancelled");
        }

        await new Promise((resolve, reject) => {
          const timeout = setTimeout(resolve, step.duration);
          abortControllerRef.current?.signal.addEventListener("abort", () => {
            clearTimeout(timeout);
            reject(new Error("Deployment cancelled"));
          });
        });

        addDeploymentLog(step.message, "info");
      }

      // Simulate random failure (10% chance) for realism
      if (Math.random() < 0.1) {
        throw new Error("Build failed: TypeScript error in component");
      }

      // Success
      const url = `https://${activeProject.name.toLowerCase().replace(/\s+/g, "-")}.vercel.app`;
      addDeploymentLog("Deployment successful!", "success");
      completeDeployment(url);

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Deployment failed";
      addDeploymentLog(errorMessage, "error");
      failDeployment(errorMessage);
      return false;
    }
  }, [activeProject, startDeployment, addDeploymentLog, completeDeployment, failDeployment]);

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
    addDeploymentLog("Deployment cancelled by user", "warning");
    failDeployment("Deployment cancelled");
  }, [addDeploymentLog, failDeployment]);

  const isDeploying = state.deployment?.status === "building" || state.deployment?.status === "deploying";

  return {
    deploy,
    cancel,
    isDeploying,
    deployment: state.deployment,
  };
}
