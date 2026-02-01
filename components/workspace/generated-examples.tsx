"use client";

import React from "react"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Zap, Shield, Layers, Code } from "lucide-react";

// Example generated component: Hero Section
export function GeneratedHero() {
  return (
    <div className="space-y-8">
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
          <Zap className="h-4 w-4" />
          New Release
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground text-balance">
          Build faster with AI-powered development
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Transform your ideas into production-ready code in seconds. 
          Focus on what matters while AI handles the heavy lifting.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button size="lg" className="gap-2">
            Get Started <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline">
            View Demo
          </Button>
        </div>
      </div>
    </div>
  );
}

// Example generated component: Feature Cards
export function GeneratedFeatureCards() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Generate components in milliseconds with our optimized AI engine.",
    },
    {
      icon: Shield,
      title: "Type Safe",
      description: "Full TypeScript support with proper types and interfaces.",
    },
    {
      icon: Layers,
      title: "Composable",
      description: "Modular components that work together seamlessly.",
    },
    {
      icon: Code,
      title: "Clean Code",
      description: "Production-ready code following best practices.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {features.map((feature) => (
        <Card key={feature.title} className="bg-card border-border">
          <CardHeader className="pb-2">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center mb-2">
              <feature.icon className="h-5 w-5 text-accent" />
            </div>
            <CardTitle className="text-lg">{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="leading-relaxed">
              {feature.description}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Example generated component: Stats Section
export function GeneratedStats() {
  const stats = [
    { value: "10M+", label: "Components Generated" },
    { value: "50K+", label: "Active Developers" },
    { value: "99.9%", label: "Uptime" },
    { value: "<100ms", label: "Avg Response" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-border">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <div className="text-3xl font-bold text-foreground">{stat.value}</div>
          <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

// Map of component names to actual components
export const generatedComponents: Record<string, React.ComponentType> = {
  "Hero Section": GeneratedHero,
  "Feature Cards": GeneratedFeatureCards,
  "Stats Section": GeneratedStats,
};

// Code examples for each component
export const codeExamples: Record<string, { name: string; language: string; code: string }[]> = {
  "Hero Section": [
    {
      name: "hero.tsx",
      language: "tsx",
      code: `import { Button } from "@/components/ui/button"
import { ArrowRight, Zap } from "lucide-react"

export function Hero() {
  return (
    <div className="space-y-8">
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
          <Zap className="h-4 w-4" />
          New Release
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Build faster with AI-powered development
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Transform your ideas into production-ready code in seconds.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button size="lg" className="gap-2">
            Get Started <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline">
            View Demo
          </Button>
        </div>
      </div>
    </div>
  )
}`,
    },
  ],
  "Feature Cards": [
    {
      name: "feature-cards.tsx",
      language: "tsx",
      code: `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Shield, Layers, Code } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate components in milliseconds.",
  },
  {
    icon: Shield,
    title: "Type Safe",
    description: "Full TypeScript support with proper types.",
  },
  {
    icon: Layers,
    title: "Composable",
    description: "Modular components that work together.",
  },
  {
    icon: Code,
    title: "Clean Code",
    description: "Production-ready code following best practices.",
  },
]

export function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {features.map((feature) => (
        <Card key={feature.title}>
          <CardHeader className="pb-2">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center mb-2">
              <feature.icon className="h-5 w-5 text-accent" />
            </div>
            <CardTitle className="text-lg">{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{feature.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}`,
    },
  ],
  "Stats Section": [
    {
      name: "stats.tsx",
      language: "tsx",
      code: `const stats = [
  { value: "10M+", label: "Components Generated" },
  { value: "50K+", label: "Active Developers" },
  { value: "99.9%", label: "Uptime" },
  { value: "<100ms", label: "Avg Response" },
]

export function Stats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-border">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <div className="text-3xl font-bold text-foreground">
            {stat.value}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}`,
    },
  ],
};
