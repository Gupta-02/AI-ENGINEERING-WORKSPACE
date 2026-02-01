"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Search,
  ChevronRight,
  ExternalLink,
  Lightbulb,
  Code2,
  Layers,
  Rocket,
  Keyboard,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  Zap,
  FileCode,
  Globe,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DocSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  articles: DocArticle[];
}

interface DocArticle {
  id: string;
  title: string;
  content: string;
  tags?: string[];
}

const docSections: DocSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: <Rocket className="h-4 w-4" />,
    description: "Learn the basics of Forge workspace",
    articles: [
      {
        id: "intro",
        title: "Introduction to Forge",
        content: `# Introduction to Forge

Forge is an AI-powered engineering workspace that helps you transform ideas into production-ready web applications faster.

## Key Features

- **Natural Language Input**: Describe what you want to build in plain English
- **Instant Generation**: Get production-ready React/Next.js components
- **Live Preview**: See your components render in real-time
- **Version History**: Track changes and compare versions
- **One-Click Deploy**: Deploy to Vercel instantly

## Quick Start

1. Create a new project from the sidebar
2. Type your prompt in the input area
3. Watch your component generate in the preview panel
4. Refine with follow-up prompts
5. Deploy when ready`,
        tags: ["basics", "overview"],
      },
      {
        id: "first-component",
        title: "Creating Your First Component",
        content: `# Creating Your First Component

Let's create your first component using Forge.

## Step 1: Create a Project

Click the **+ New Project** button in the sidebar or use the keyboard shortcut \`Cmd/Ctrl + N\`.

## Step 2: Write a Prompt

In the prompt input, describe what you want to build. For example:

\`\`\`
Create a modern pricing section with 3 tiers: Basic ($9/mo), Pro ($29/mo), and Enterprise (custom). Each card should have a feature list and CTA button.
\`\`\`

## Step 3: Review and Refine

Once generated, review the preview. You can refine by sending follow-up prompts:

\`\`\`
Make the Pro tier highlighted as "Most Popular" and add a gradient border
\`\`\`

## Tips for Better Results

- Be specific about colors, spacing, and layout
- Reference existing design systems (e.g., "shadcn style")
- Include responsive requirements`,
        tags: ["tutorial", "basics"],
      },
      {
        id: "project-management",
        title: "Managing Projects",
        content: `# Managing Projects

Forge organizes your work into projects, each containing components, versions, and deployment history.

## Creating Projects

- Click **+ New Project** in the sidebar
- Choose a name and framework (Next.js, React, Vue, Svelte)
- Your project is ready to use immediately

## Switching Projects

Click any project in the sidebar to switch to it. Your conversation and components are preserved.

## Deleting Projects

Hover over a project and click the trash icon to delete. This action cannot be undone.

## Project Settings

Access project settings to:
- Rename your project
- Change the framework
- Configure deployment settings
- Manage environment variables`,
        tags: ["projects", "organization"],
      },
    ],
  },
  {
    id: "prompting",
    title: "Prompting Guide",
    icon: <Sparkles className="h-4 w-4" />,
    description: "Write effective prompts for better results",
    articles: [
      {
        id: "effective-prompts",
        title: "Writing Effective Prompts",
        content: `# Writing Effective Prompts

The quality of your prompts directly affects the generated output. Here's how to write better prompts.

## Be Specific

Instead of:
\`\`\`
Create a card
\`\`\`

Try:
\`\`\`
Create a product card with an image at the top (16:9 aspect ratio), product name, price with strikethrough original price, rating with stars, and an "Add to Cart" button
\`\`\`

## Include Context

\`\`\`
I'm building an e-commerce site for a luxury watch brand. Create a product card that feels premium with subtle animations on hover.
\`\`\`

## Specify Technical Requirements

\`\`\`
Create a responsive dashboard layout using CSS Grid. On mobile, stack cards vertically. On tablet, show 2 columns. On desktop, show 4 columns.
\`\`\`

## Reference Styles

\`\`\`
Create a login form in the style of Linear's clean, minimal UI. Use a dark theme with subtle borders.
\`\`\``,
        tags: ["prompts", "tips"],
      },
      {
        id: "prompt-templates",
        title: "Prompt Templates",
        content: `# Prompt Templates

Use these templates as starting points for common UI patterns.

## Landing Page Hero

\`\`\`
Create a hero section for [PRODUCT TYPE]. Include:
- Navigation bar with logo and menu items
- Large headline with gradient text
- Subtitle explaining the value proposition
- Primary and secondary CTA buttons
- Background with [STYLE: gradient/image/pattern]
\`\`\`

## Dashboard Layout

\`\`\`
Create a dashboard layout with:
- Collapsible sidebar with navigation icons
- Header with search, notifications, and user menu
- Main content area with [CONTENT TYPE]
- Use [THEME: dark/light] mode
\`\`\`

## Data Table

\`\`\`
Create a data table for [DATA TYPE] with:
- Sortable columns for [COLUMNS]
- Search and filter functionality
- Pagination with page size selector
- Row actions (edit, delete, view)
- Bulk selection with actions
\`\`\`

## Form Component

\`\`\`
Create a [FORM TYPE] form with:
- Fields: [LIST FIELDS]
- Validation for [REQUIREMENTS]
- Submit button with loading state
- Error message display
\`\`\``,
        tags: ["templates", "examples"],
      },
      {
        id: "iteration",
        title: "Iterative Refinement",
        content: `# Iterative Refinement

Learn how to refine generated components through conversation.

## Building on Previous Output

After your initial generation, you can refine with follow-up prompts:

\`\`\`
Initial: Create a pricing table with 3 tiers
Follow-up: Add a monthly/yearly toggle with 20% discount for yearly
Follow-up: Make the middle card larger and add a "Most Popular" badge
\`\`\`

## Specific Adjustments

Be precise about what to change:

\`\`\`
- Change the primary button color to blue-600
- Increase the card padding to 32px
- Add a subtle shadow on hover
- Make the headline text larger on mobile
\`\`\`

## Requesting Variations

\`\`\`
Show me 3 variations of this hero section:
1. Centered text with illustration on the right
2. Split layout with image on left
3. Full-width with video background
\`\`\``,
        tags: ["iteration", "refinement"],
      },
    ],
  },
  {
    id: "features",
    title: "Features",
    icon: <Layers className="h-4 w-4" />,
    description: "Explore all workspace features",
    articles: [
      {
        id: "live-preview",
        title: "Live Preview",
        content: `# Live Preview

The preview panel shows your generated components in real-time.

## Viewport Controls

Use the viewport controls to test responsive designs:
- **Desktop**: Full-width preview
- **Tablet**: 768px width
- **Mobile**: 375px width

## Refresh Preview

Click the refresh button to re-render the preview without regenerating.

## Fullscreen Mode

Click the expand button to view the preview in fullscreen mode. Press \`Esc\` to exit.

## Interactive Preview

The preview is fully interactive. You can:
- Click buttons and links
- Fill out forms
- Test hover states
- Verify animations`,
        tags: ["preview", "responsive"],
      },
      {
        id: "code-view",
        title: "Code View",
        content: `# Code View

Access and manage the generated code in the code panel.

## Syntax Highlighting

Code is displayed with syntax highlighting for better readability.

## Copy Code

Click the copy button to copy the entire code to your clipboard.

## Download

Download the code as a \`.tsx\` file to use in your project.

## Code Structure

Generated code follows best practices:
- TypeScript with proper types
- React functional components
- Tailwind CSS for styling
- Accessible markup with ARIA attributes
- Responsive design patterns`,
        tags: ["code", "export"],
      },
      {
        id: "version-history",
        title: "Version History",
        content: `# Version History

Track changes and manage versions of your components.

## Automatic Versioning

A new version is created each time you generate or refine a component.

## Manual Saves

Click **Save Version** to create a named checkpoint you can return to.

## Comparing Versions

Click **Compare** on any version to see a side-by-side diff of the code changes.

## Restoring Versions

Click **Restore** to revert to a previous version. This creates a new version with the old code.

## Version Metadata

Each version includes:
- Timestamp
- Prompt that generated it
- Code snapshot`,
        tags: ["versions", "history"],
      },
      {
        id: "deployment",
        title: "Deployment",
        content: `# Deployment

Deploy your components to Vercel with one click.

## One-Click Deploy

Click the **Deploy** button in the header to start deployment.

## Deployment Process

1. Code is bundled and optimized
2. Uploaded to Vercel's edge network
3. SSL certificate provisioned
4. Preview URL generated

## Preview URLs

Each deployment gets a unique preview URL you can share with stakeholders.

## Production Deployments

Connect a custom domain for production use through the Vercel dashboard.

## Build Logs

View real-time build logs during deployment to debug any issues.`,
        tags: ["deploy", "vercel"],
      },
    ],
  },
  {
    id: "keyboard-shortcuts",
    title: "Keyboard Shortcuts",
    icon: <Keyboard className="h-4 w-4" />,
    description: "Speed up your workflow",
    articles: [
      {
        id: "shortcuts",
        title: "All Keyboard Shortcuts",
        content: `# Keyboard Shortcuts

Master these shortcuts to speed up your workflow.

## General

| Shortcut | Action |
|----------|--------|
| \`Cmd/Ctrl + K\` | Open search |
| \`Cmd/Ctrl + N\` | New project |
| \`Cmd/Ctrl + Enter\` | Submit prompt |
| \`Esc\` | Close modal/panel |

## Navigation

| Shortcut | Action |
|----------|--------|
| \`Cmd/Ctrl + 1\` | Switch to Preview |
| \`Cmd/Ctrl + 2\` | Switch to Code |
| \`Cmd/Ctrl + 3\` | Switch to History |
| \`Cmd/Ctrl + B\` | Toggle sidebar |

## Code Panel

| Shortcut | Action |
|----------|--------|
| \`Cmd/Ctrl + C\` | Copy code |
| \`Cmd/Ctrl + S\` | Save version |
| \`Cmd/Ctrl + D\` | Download code |

## Preview Panel

| Shortcut | Action |
|----------|--------|
| \`Cmd/Ctrl + R\` | Refresh preview |
| \`Cmd/Ctrl + F\` | Fullscreen |`,
        tags: ["shortcuts", "productivity"],
      },
    ],
  },
  {
    id: "best-practices",
    title: "Best Practices",
    icon: <Lightbulb className="h-4 w-4" />,
    description: "Tips for production-ready code",
    articles: [
      {
        id: "accessibility",
        title: "Accessibility Guidelines",
        content: `# Accessibility Guidelines

Forge generates accessible code by default, but here's how to ensure your components are fully accessible.

## Request Accessible Components

Include accessibility requirements in your prompts:

\`\`\`
Create an accessible dropdown menu with:
- Keyboard navigation (arrow keys, Enter, Escape)
- ARIA labels and roles
- Focus management
- Screen reader announcements
\`\`\`

## Key Accessibility Features

- **Semantic HTML**: Use proper heading hierarchy and landmarks
- **ARIA attributes**: Include roles, labels, and states
- **Keyboard navigation**: Ensure all interactions work with keyboard
- **Focus indicators**: Visible focus states for all interactive elements
- **Color contrast**: Sufficient contrast ratios for text

## Testing Accessibility

- Use browser dev tools accessibility audit
- Test with keyboard only
- Test with screen reader
- Check color contrast ratios`,
        tags: ["a11y", "accessibility"],
      },
      {
        id: "performance",
        title: "Performance Tips",
        content: `# Performance Tips

Optimize your generated components for the best user experience.

## Image Optimization

\`\`\`
Use Next.js Image component with proper sizing:
- Specify width and height
- Use appropriate loading strategy
- Provide blur placeholder for large images
\`\`\`

## Code Splitting

For large components, request code splitting:

\`\`\`
Create a dashboard with lazy-loaded tabs. Only load the content for each tab when it's selected.
\`\`\`

## Animation Performance

\`\`\`
Use CSS transforms and opacity for animations instead of properties that trigger layout:
- transform: translateX, scale, rotate
- opacity
- Avoid: width, height, top, left
\`\`\`

## Reducing Bundle Size

- Import only what you need from icon libraries
- Use dynamic imports for heavy components
- Avoid unnecessary dependencies`,
        tags: ["performance", "optimization"],
      },
      {
        id: "responsive-design",
        title: "Responsive Design",
        content: `# Responsive Design

Create components that work beautifully on all screen sizes.

## Mobile-First Approach

Request mobile-first designs:

\`\`\`
Create a navigation that's a hamburger menu on mobile and a horizontal nav on desktop.
\`\`\`

## Breakpoint Strategy

Standard breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Flexible Layouts

\`\`\`
Create a card grid that shows:
- 1 column on mobile
- 2 columns on tablet
- 4 columns on desktop
Use CSS Grid with auto-fit for flexibility.
\`\`\`

## Typography Scaling

\`\`\`
Use responsive typography:
- Headings: text-2xl md:text-4xl lg:text-5xl
- Body: text-sm md:text-base
\`\`\``,
        tags: ["responsive", "mobile"],
      },
    ],
  },
];

interface DocsPanelProps {
  onClose?: () => void;
}

export function DocsPanel({ onClose }: DocsPanelProps) {
  const [search, setSearch] = useState("");
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<DocArticle | null>(
    null
  );

  // Search across all articles
  const searchResults = search
    ? docSections.flatMap((section) =>
        section.articles
          .filter(
            (article) =>
              article.title.toLowerCase().includes(search.toLowerCase()) ||
              article.content.toLowerCase().includes(search.toLowerCase()) ||
              article.tags?.some((tag) =>
                tag.toLowerCase().includes(search.toLowerCase())
              )
          )
          .map((article) => ({ ...article, sectionTitle: section.title }))
      )
    : [];

  // Get current section
  const currentSection = selectedSection
    ? docSections.find((s) => s.id === selectedSection)
    : null;

  // Handle back navigation
  const handleBack = () => {
    if (selectedArticle) {
      setSelectedArticle(null);
    } else if (selectedSection) {
      setSelectedSection(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2 mb-4">
          {(selectedSection || selectedArticle) && (
            <button
              onClick={handleBack}
              className="p-1.5 -ml-1.5 hover:bg-secondary rounded-md transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-accent" />
          </div>
          <div>
            <h2 className="font-semibold">
              {selectedArticle
                ? selectedArticle.title
                : currentSection
                  ? currentSection.title
                  : "Documentation"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {selectedArticle
                ? currentSection?.title
                : currentSection
                  ? currentSection.description
                  : "Learn how to use Forge"}
            </p>
          </div>
        </div>

        {/* Search */}
        {!selectedArticle && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (e.target.value) {
                  setSelectedSection(null);
                  setSelectedArticle(null);
                }
              }}
              className="w-full h-9 pl-9 pr-4 rounded-lg bg-input border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Search Results */}
        {search && (
          <div className="p-4 space-y-3">
            <p className="text-xs text-muted-foreground">
              {searchResults.length} result{searchResults.length !== 1 && "s"}{" "}
              found
            </p>
            {searchResults.map((result) => (
              <button
                key={result.id}
                onClick={() => {
                  setSelectedArticle(result);
                  setSearch("");
                }}
                className="w-full text-left p-3 rounded-lg border border-border hover:border-muted-foreground/30 transition-colors"
              >
                <p className="font-medium text-sm mb-1">{result.title}</p>
                <p className="text-xs text-muted-foreground">
                  {result.sectionTitle}
                </p>
              </button>
            ))}
            {searchResults.length === 0 && (
              <div className="text-center py-8">
                <Search className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No results found</p>
              </div>
            )}
          </div>
        )}

        {/* Article Content */}
        {selectedArticle && !search && (
          <div className="p-4">
            <article className="prose prose-sm prose-invert max-w-none">
              <div className="space-y-4 text-sm">
                {selectedArticle.content.split("\n").map((line, i) => {
                  if (line.startsWith("# ")) {
                    return (
                      <h1 key={i} className="text-xl font-bold mt-0">
                        {line.slice(2)}
                      </h1>
                    );
                  }
                  if (line.startsWith("## ")) {
                    return (
                      <h2
                        key={i}
                        className="text-lg font-semibold mt-6 mb-3 text-foreground"
                      >
                        {line.slice(3)}
                      </h2>
                    );
                  }
                  if (line.startsWith("### ")) {
                    return (
                      <h3 key={i} className="text-base font-medium mt-4 mb-2">
                        {line.slice(4)}
                      </h3>
                    );
                  }
                  if (line.startsWith("```")) {
                    return null; // Handle code blocks separately
                  }
                  if (line.startsWith("- ")) {
                    return (
                      <div key={i} className="flex items-start gap-2 ml-2">
                        <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">
                          {line.slice(2)}
                        </span>
                      </div>
                    );
                  }
                  if (line.startsWith("|")) {
                    // Simple table handling
                    const cells = line.split("|").filter(Boolean);
                    if (cells.some((c) => c.trim().match(/^-+$/))) return null;
                    return (
                      <div
                        key={i}
                        className="flex gap-4 py-2 border-b border-border text-xs"
                      >
                        <code className="flex-1 bg-secondary px-2 py-1 rounded text-accent">
                          {cells[0]?.trim()}
                        </code>
                        <span className="flex-1 text-muted-foreground">
                          {cells[1]?.trim()}
                        </span>
                      </div>
                    );
                  }
                  if (line.trim() === "") return <div key={i} className="h-2" />;
                  return (
                    <p key={i} className="text-muted-foreground leading-relaxed">
                      {line}
                    </p>
                  );
                })}
              </div>
            </article>

            {/* Tags */}
            {selectedArticle.tags && (
              <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-border">
                {selectedArticle.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-secondary text-muted-foreground rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section Articles */}
        {currentSection && !selectedArticle && !search && (
          <div className="p-4 space-y-2">
            {currentSection.articles.map((article) => (
              <button
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:border-muted-foreground/30 transition-colors group"
              >
                <div className="text-left">
                  <p className="font-medium text-sm">{article.title}</p>
                  {article.tags && (
                    <div className="flex gap-1 mt-1">
                      {article.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] text-muted-foreground"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
            ))}
          </div>
        )}

        {/* Section List */}
        {!selectedSection && !selectedArticle && !search && (
          <div className="p-4 space-y-3">
            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              <QuickLink
                icon={<Zap className="h-4 w-4" />}
                label="Quick Start"
                onClick={() => {
                  const section = docSections.find(
                    (s) => s.id === "getting-started"
                  );
                  const article = section?.articles[0];
                  if (article) {
                    setSelectedSection("getting-started");
                    setSelectedArticle(article);
                  }
                }}
              />
              <QuickLink
                icon={<Sparkles className="h-4 w-4" />}
                label="Prompting"
                onClick={() => setSelectedSection("prompting")}
              />
              <QuickLink
                icon={<Keyboard className="h-4 w-4" />}
                label="Shortcuts"
                onClick={() => {
                  const section = docSections.find(
                    (s) => s.id === "keyboard-shortcuts"
                  );
                  const article = section?.articles[0];
                  if (article) {
                    setSelectedSection("keyboard-shortcuts");
                    setSelectedArticle(article);
                  }
                }}
              />
              <QuickLink
                icon={<Lightbulb className="h-4 w-4" />}
                label="Best Practices"
                onClick={() => setSelectedSection("best-practices")}
              />
            </div>

            {/* All Sections */}
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              All Topics
            </p>
            {docSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setSelectedSection(section.id)}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-muted-foreground/30 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-accent/20 group-hover:text-accent transition-colors">
                  {section.icon}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm">{section.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {section.description}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
            ))}

            {/* External Links */}
            <div className="pt-4 mt-4 border-t border-border space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Resources
              </p>
              <a
                href="https://nextjs.org/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary transition-colors group"
              >
                <FileCode className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm flex-1">Next.js Documentation</span>
                <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="https://tailwindcss.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary transition-colors group"
              >
                <Palette className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm flex-1">Tailwind CSS</span>
                <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="https://vercel.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary transition-colors group"
              >
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm flex-1">Vercel Platform</span>
                <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function QuickLink({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
    >
      <span className="text-accent">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
