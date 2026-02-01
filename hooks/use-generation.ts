"use client";

import { useCallback, useRef } from "react";
import { useWorkspace } from "@/lib/store";
import { validatePrompt } from "@/lib/validation";
import { generatedComponents, codeExamples } from "@/components/workspace/generated-examples";
import type { CodeFile, ValidationResult } from "@/lib/types";

interface GenerationResult {
  success: boolean;
  componentName?: string;
  code?: CodeFile[];
  error?: string;
}

export function useGeneration() {
  const {
    state,
    addUserMessage,
    addAssistantMessage,
    addErrorMessage,
    setGenerationStatus,
    setGenerationError,
    addGeneratedComponent,
    activeProject,
  } = useWorkspace();

  const abortControllerRef = useRef<AbortController | null>(null);

  const generate = useCallback(async (prompt: string): Promise<GenerationResult> => {
    // Validate prompt
    const validation: ValidationResult = validatePrompt(prompt);
    if (!validation.isValid) {
      setGenerationStatus("error");
      setGenerationError(validation.errors[0]);
      addErrorMessage(validation.errors[0], false);
      return { success: false, error: validation.errors[0] };
    }

    // Check for active project
    if (!activeProject) {
      const error = "Please create or select a project first.";
      setGenerationStatus("error");
      setGenerationError(error);
      addErrorMessage(error, false);
      return { success: false, error };
    }

    // Add user message
    addUserMessage(prompt);

    // Start generation
    setGenerationStatus("validating");
    setGenerationError(null);

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    try {
      // Simulate validation phase
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(resolve, 500);
        abortControllerRef.current?.signal.addEventListener("abort", () => {
          clearTimeout(timeout);
          reject(new Error("Generation cancelled"));
        });
      });

      setGenerationStatus("generating");

      // Simulate AI generation with realistic delays
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(resolve, 1500 + Math.random() * 1000);
        abortControllerRef.current?.signal.addEventListener("abort", () => {
          clearTimeout(timeout);
          reject(new Error("Generation cancelled"));
        });
      });

      // Determine component type from prompt keywords
      let componentName = "Hero Section";
      const lowerPrompt = prompt.toLowerCase();
      
      if (lowerPrompt.includes("card") || lowerPrompt.includes("feature") || lowerPrompt.includes("grid")) {
        componentName = "Feature Cards";
      } else if (lowerPrompt.includes("stat") || lowerPrompt.includes("number") || lowerPrompt.includes("metric")) {
        componentName = "Stats Section";
      } else if (lowerPrompt.includes("hero") || lowerPrompt.includes("landing") || lowerPrompt.includes("header")) {
        componentName = "Hero Section";
      }

      // Get the component and code
      const preview = generatedComponents[componentName] || null;
      const code = codeExamples[componentName] || [];

      // Add generated component to state
      addGeneratedComponent({
        name: componentName,
        prompt,
        code,
        preview,
        projectId: activeProject.id,
      });

      // Success message
      addAssistantMessage(
        `I've created a ${componentName} component based on your description. The component uses Tailwind CSS for styling and follows best practices for accessibility and performance. You can preview it on the right and copy the code to use in your project.`,
        componentName
      );

      setGenerationStatus("success");
      
      // Reset to idle after a short delay
      setTimeout(() => {
        setGenerationStatus("idle");
      }, 1000);

      return { success: true, componentName, code };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      
      if (errorMessage === "Generation cancelled") {
        setGenerationStatus("idle");
        return { success: false, error: errorMessage };
      }

      setGenerationStatus("error");
      setGenerationError(errorMessage);
      addErrorMessage(errorMessage, true);

      return { success: false, error: errorMessage };
    }
  }, [activeProject, addUserMessage, addAssistantMessage, addErrorMessage, setGenerationStatus, setGenerationError, addGeneratedComponent]);

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
    setGenerationStatus("idle");
    setGenerationError(null);
  }, [setGenerationStatus, setGenerationError]);

  const retry = useCallback(async (prompt: string) => {
    return generate(prompt);
  }, [generate]);

  return {
    generate,
    cancel,
    retry,
    isGenerating: state.generationStatus === "generating" || state.generationStatus === "validating",
    status: state.generationStatus,
    error: state.generationError,
  };
}
