"use client";

import React, { useState } from "react";
import {
  Layout,
  CreditCard,
  Users,
  ShoppingCart,
  BarChart3,
  Mail,
  FileText,
  Settings,
  Search,
  Grid3X3,
  ArrowRight,
  Star,
  Zap,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  prompt: string;
  tags: string[];
  popular?: boolean;
}

const templates: Template[] = [
  // Landing Pages
  {
    id: "hero-section",
    name: "Hero Section",
    description: "A stunning hero section with headline, CTA, and background imagery",
    category: "Landing Pages",
    icon: <Layout className="h-5 w-5" />,
    prompt: "Create a modern hero section with a bold headline, subtitle, CTA button, and a gradient background. Include a navigation bar at the top.",
    tags: ["hero", "landing", "marketing"],
    popular: true,
  },
  {
    id: "pricing-table",
    name: "Pricing Table",
    description: "Responsive pricing cards with feature comparison",
    category: "Landing Pages",
    icon: <CreditCard className="h-5 w-5" />,
    prompt: "Create a pricing section with 3 tiers (Basic, Pro, Enterprise). Include feature lists, pricing, and CTA buttons. Highlight the recommended plan.",
    tags: ["pricing", "saas", "comparison"],
    popular: true,
  },
  {
    id: "feature-grid",
    name: "Feature Grid",
    description: "Showcase product features in an elegant grid layout",
    category: "Landing Pages",
    icon: <Grid3X3 className="h-5 w-5" />,
    prompt: "Create a features section with 6 feature cards in a grid. Each card should have an icon, title, and description. Use a clean, modern design.",
    tags: ["features", "grid", "cards"],
  },
  {
    id: "testimonials",
    name: "Testimonials",
    description: "Customer testimonials with avatars and ratings",
    category: "Landing Pages",
    icon: <Star className="h-5 w-5" />,
    prompt: "Create a testimonials section with 3 customer quotes, including avatars, names, roles, company logos, and star ratings.",
    tags: ["testimonials", "social-proof", "reviews"],
  },

  // Dashboards
  {
    id: "analytics-dashboard",
    name: "Analytics Dashboard",
    description: "Data visualization dashboard with charts and metrics",
    category: "Dashboards",
    icon: <BarChart3 className="h-5 w-5" />,
    prompt: "Create an analytics dashboard with KPI cards at the top, a line chart for trends, a bar chart for comparisons, and a data table below.",
    tags: ["analytics", "charts", "metrics"],
    popular: true,
  },
  {
    id: "user-management",
    name: "User Management",
    description: "Admin panel for managing users with CRUD operations",
    category: "Dashboards",
    icon: <Users className="h-5 w-5" />,
    prompt: "Create a user management table with columns for name, email, role, status, and actions. Include search, filters, and pagination.",
    tags: ["admin", "users", "table"],
  },
  {
    id: "settings-page",
    name: "Settings Page",
    description: "User settings with profile, security, and preferences",
    category: "Dashboards",
    icon: <Settings className="h-5 w-5" />,
    prompt: "Create a settings page with tabs for Profile, Security, and Notifications. Include form fields, toggles, and save buttons.",
    tags: ["settings", "profile", "forms"],
  },

  // E-commerce
  {
    id: "product-card",
    name: "Product Card",
    description: "E-commerce product card with image, price, and actions",
    category: "E-commerce",
    icon: <ShoppingCart className="h-5 w-5" />,
    prompt: "Create a product card grid with 4 products. Each card should have an image, title, price, rating, and add to cart button.",
    tags: ["ecommerce", "products", "cards"],
    popular: true,
  },
  {
    id: "shopping-cart",
    name: "Shopping Cart",
    description: "Cart sidebar with items, quantities, and checkout",
    category: "E-commerce",
    icon: <ShoppingCart className="h-5 w-5" />,
    prompt: "Create a shopping cart component with item list, quantity controls, subtotal, taxes, and checkout button.",
    tags: ["cart", "checkout", "ecommerce"],
  },

  // Forms & Auth
  {
    id: "login-form",
    name: "Login Form",
    description: "Clean login form with social auth options",
    category: "Forms & Auth",
    icon: <FileText className="h-5 w-5" />,
    prompt: "Create a login form with email and password fields, remember me checkbox, forgot password link, and social login buttons for Google and GitHub.",
    tags: ["auth", "login", "form"],
  },
  {
    id: "contact-form",
    name: "Contact Form",
    description: "Contact form with validation and submission",
    category: "Forms & Auth",
    icon: <Mail className="h-5 w-5" />,
    prompt: "Create a contact form with name, email, subject, and message fields. Include validation states and a submit button.",
    tags: ["contact", "form", "validation"],
  },
  {
    id: "multi-step-form",
    name: "Multi-step Form",
    description: "Wizard-style form with progress indicator",
    category: "Forms & Auth",
    icon: <FileText className="h-5 w-5" />,
    prompt: "Create a multi-step form wizard with 3 steps: Personal Info, Account Details, and Confirmation. Include a progress bar and navigation buttons.",
    tags: ["wizard", "steps", "form"],
  },
];

const categories = [
  "All",
  "Landing Pages",
  "Dashboards",
  "E-commerce",
  "Forms & Auth",
];

interface TemplatesPanelProps {
  onUseTemplate: (prompt: string) => void;
}

export function TemplatesPanel({ onUseTemplate }: TemplatesPanelProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(search.toLowerCase()) ||
      template.description.toLowerCase().includes(search.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(search.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "All" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularTemplates = templates.filter((t) => t.popular);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
            <Layout className="h-4 w-4 text-accent" />
          </div>
          <div>
            <h2 className="font-semibold">Templates</h2>
            <p className="text-xs text-muted-foreground">
              Start with pre-built components
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-input border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors",
                selectedCategory === category
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Popular Section */}
        {selectedCategory === "All" && !search && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <Zap className="h-3.5 w-3.5 text-accent" />
              Popular Templates
            </div>
            <div className="grid gap-3">
              {popularTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onUse={() => onUseTemplate(template.prompt)}
                  featured
                />
              ))}
            </div>
          </div>
        )}

        {/* All Templates */}
        <div className="space-y-3">
          {(selectedCategory !== "All" || search) && (
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <Clock className="h-3.5 w-3.5" />
              {filteredTemplates.length} Template
              {filteredTemplates.length !== 1 ? "s" : ""}
            </div>
          )}
          {selectedCategory === "All" && !search && (
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <Grid3X3 className="h-3.5 w-3.5" />
              All Templates
            </div>
          )}
          <div className="grid gap-3">
            {filteredTemplates
              .filter((t) => selectedCategory !== "All" || search || !t.popular)
              .map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onUse={() => onUseTemplate(template.prompt)}
                />
              ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                No templates found
              </p>
              <p className="text-xs text-muted-foreground/70">
                Try a different search term
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface TemplateCardProps {
  template: Template;
  onUse: () => void;
  featured?: boolean;
}

function TemplateCard({ template, onUse, featured }: TemplateCardProps) {
  return (
    <div
      className={cn(
        "group relative p-4 rounded-xl border transition-all",
        featured
          ? "border-accent/30 bg-accent/5 hover:border-accent/50"
          : "border-border bg-card hover:border-muted-foreground/30"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
            featured ? "bg-accent/20 text-accent" : "bg-secondary text-foreground"
          )}
        >
          {template.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-sm">{template.name}</h3>
            {template.popular && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-accent/20 text-accent rounded">
                Popular
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {template.description}
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex flex-wrap gap-1">
              {template.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 text-[10px] bg-secondary text-muted-foreground rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
            <Button
              size="sm"
              variant={featured ? "default" : "outline"}
              className={cn("gap-1.5 h-7 text-xs", !featured && "bg-transparent")}
              onClick={onUse}
            >
              Use
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
