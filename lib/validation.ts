import type { ValidationResult } from "./types";

// Minimum and maximum prompt lengths
const MIN_PROMPT_LENGTH = 10;
const MAX_PROMPT_LENGTH = 2000;

// Blocked patterns for security
const BLOCKED_PATTERNS = [
  /\b(eval|exec)\s*\(/i,
  /<script[^>]*>/i,
  /javascript:/i,
  /on\w+\s*=/i,
];

// Warning patterns
const WARNING_PATTERNS = [
  { pattern: /\b(todo|fixme|hack)\b/i, message: "Prompt contains placeholder terms" },
  { pattern: /\b(lorem ipsum)\b/i, message: "Consider providing real content instead of placeholders" },
];

export function validatePrompt(prompt: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const trimmed = prompt.trim();

  // Check length
  if (trimmed.length < MIN_PROMPT_LENGTH) {
    errors.push(`Prompt must be at least ${MIN_PROMPT_LENGTH} characters. Please provide more detail about what you want to build.`);
  }

  if (trimmed.length > MAX_PROMPT_LENGTH) {
    errors.push(`Prompt exceeds ${MAX_PROMPT_LENGTH} characters. Please be more concise.`);
  }

  // Check for blocked patterns
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(trimmed)) {
      errors.push("Prompt contains potentially unsafe content. Please remove any script tags or executable code.");
      break;
    }
  }

  // Check for warnings
  for (const { pattern, message } of WARNING_PATTERNS) {
    if (pattern.test(trimmed)) {
      warnings.push(message);
    }
  }

  // Check for empty brackets or incomplete templates
  if (/\[\s*\]|\{\s*\}/.test(trimmed)) {
    warnings.push("Prompt contains empty brackets. Consider filling in specific values.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateProjectName(name: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const trimmed = name.trim();

  if (trimmed.length < 2) {
    errors.push("Project name must be at least 2 characters.");
  }

  if (trimmed.length > 50) {
    errors.push("Project name must be 50 characters or less.");
  }

  if (!/^[a-zA-Z0-9][a-zA-Z0-9\s\-_]*$/.test(trimmed)) {
    errors.push("Project name must start with a letter or number and can only contain letters, numbers, spaces, hyphens, and underscores.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateCode(code: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for basic syntax issues
  const openBraces = (code.match(/{/g) || []).length;
  const closeBraces = (code.match(/}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push("Mismatched curly braces detected.");
  }

  const openParens = (code.match(/\(/g) || []).length;
  const closeParens = (code.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    errors.push("Mismatched parentheses detected.");
  }

  // Check for common issues
  if (/console\.(log|error|warn)/.test(code)) {
    warnings.push("Code contains console statements. Consider removing for production.");
  }

  if (/debugger/.test(code)) {
    warnings.push("Code contains debugger statement.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
