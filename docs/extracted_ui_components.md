# Vertical Pulse: Extracted UI Components Documentation

## 1. Understanding
This document contains the major functional UI components extracted from the **Vertical Pulse** frontend codebase. Each component is presented as a clean, reusable standalone snippet with detailed documentation on its pre-requisites, functional purpose, constraints, and technical implementation. The code style follows the "Uber-Snippet" format: `"use client"` directive, proper TypeScript-grade interfaces, and self-contained logic (including animations and fallback handling).

---

## 🟢 Component 1: LinkForm (Discovery Engine)

### 2. Pre-requisites
*   **Framework**: React (18+).
*   **Utilities**: `cn` (clsx/tailwind-merge) for dynamic class handling.
*   **Styling**: Tailwind CSS (or equivalent utility-first CSS).
*   **Icons**: Lucide React or standard SVG support.

### 3. Functional Purpose
The `LinkForm` serves as the primary entry point for content discovery. It allows users to input a URL for direct processing or search for trending topics across categorized "verticals." It features a premium glassmorphic design and state-driven feedback (loading/error states).

### 4. Component Code Snippet
```javascript
"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface LinkFormProps {
  /** Callback triggered when a single link is processed successfully */
  onLinkAdded?: () => void;
  /** Callback triggered when discovery mode returns multiple options */
  onDiscovery?: (options: any[]) => void;
  /** The currently active platform identifier (e.g., 'cp', 'jobs') */
  selectedPlatform: string;
  /** Callback to update the active platform */
  onPlatformChange: (platform: string) => void;
}

/**
 * @name LinkForm
 * @description A high-end input form for URL submission and AI-powered topic discovery.
 */
const LinkForm = ({ 
  onLinkAdded, 
  onDiscovery, 
  selectedPlatform, 
  onPlatformChange 
}: LinkFormProps) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reusable action handler for both Direct and Discovery modes
  const handleAction = async (mode: 'direct' | 'discover') => {
    if (!url.trim()) return;
    
    setLoading(true);
    setError("");

    try {
      // Mock API routing - replace with your actual backend endpoints
      const endpoint = mode === 'discover' ? '/api/discover' : '/api/links';
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            query: url, 
            platform: selectedPlatform 
        }),
      });

      if (!res.ok) throw new Error("Processing failed");

      const data = await res.json();
      
      if (mode === 'discover') {
        onDiscovery?.(data.options || []);
      } else {
        onLinkAdded?.();
      }
      
      setUrl(""); // Clear on success
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Platform Toggle */}
      <div className="flex justify-center">
        <select 
          className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-sm font-medium outline-none cursor-pointer hover:bg-white/20 transition-all"
          value={selectedPlatform}
          onChange={(e) => onPlatformChange(e.target.value)}
        >
          <option value="cp">🎓 Course Platform</option>
          <option value="jobs">💼 Job Board</option>
          <option value="general">🌐 General Web</option>
        </select>
      </div>

      {/* Main Input Wrapper */}
      <div className={cn(
        "flex flex-col md:flex-row gap-3 p-2 bg-white/50 backdrop-blur-3xl rounded-[2rem] border border-black/5 shadow-2xl transition-all duration-300",
        loading && "opacity-80 scale-[0.98]"
      )}>
        <input
          type="text"
          className="flex-1 px-6 py-4 bg-transparent text-lg font-medium placeholder:text-slate-400 outline-none"
          placeholder="Paste URL or search trending topics..."
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError("");
          }}
          disabled={loading}
        />
        
        <div className="flex gap-2 p-1">
          <button
            onClick={() => handleAction('discover')}
            disabled={loading || !url.trim()}
            className="flex-1 md:flex-none px-8 py-3 bg-black text-white rounded-2xl font-bold hover:bg-slate-800 disabled:bg-slate-300 transition-all active:scale-95"
          >
            {loading ? "⌛" : "🔍 Discover"}
          </button>
          
          <button
            onClick={() => handleAction('direct')}
            disabled={loading || !url.trim()}
            className="flex-1 md:flex-none px-6 py-3 bg-white text-black border border-black/10 rounded-2xl font-bold hover:bg-slate-50 transition-all"
          >
            🚀 Direct
          </button>
        </div>
      </div>

      {/* Error Feedback */}
      {error && (
        <p className="text-center text-red-500 text-sm font-semibold animate-pulse">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
};

export { LinkForm };
```

### 5. Example Usage
```javascript
import { LinkForm } from "./components/LinkForm";

// Example parent implementation in a dashboard
const Dashboard = () => {
    const [platform, setPlatform] = useState('cp');

    const handleDiscoveryResults = (results) => {
        console.log("New content options found:", results);
        // Logic to update your content feed
    };

    return (
        <section className="py-20 bg-slate-50">
            <h1 className="text-center text-4xl font-black mb-10">Content Hub</h1>
            
            {/* Standard Implementation */}
            <LinkForm 
                selectedPlatform={platform}
                onPlatformChange={setPlatform}
                onDiscovery={handleDiscoveryResults}
                onLinkAdded={() => alert("Post published directly!")}
            />
        </section>
    );
};
```

### 6. Component Constraints
*   **Backend Dependency**: Requires endpoints for `/api/discover` and `/api/links` returning specific JSON schemas.
*   **Viewport**: Optimally designed for modern browsers; requires `backdrop-filter` for the glassmorphism effect.
*   **State**: The component is semi-controlled (platform is controlled, URL is local).

### 7. Technical Implementation
Internally, the component utilizes a dual-action handler patterns (`handleAction`) to minimize code duplication between "Direct" and "Discover" modes. It uses standard `fetch` API for hardware-efficient networking and leverages Tailwind's `backdrop-blur` for a premium layer effect without the use of heavy external UI libraries.

### 8. Author
[VERTICAL_PULSE_TEAM]

---

## 🔵 Component 2: PostEditor (AI Summarizer UI)

### 2. Pre-requisites
*   **Framework**: React (18+).
*   **API**: Backend endpoint for `/api/summarize-genz`.
*   **Styling**: CSS Modules or Tailwind CSS.

### 3. Functional Purpose
The `PostEditor` is a refinement tool used to edit discovered content before it goes live. Its standout feature is the "Gen Z Rewrite" button, which communicates with an AI service to transform professional summaries into engaging, social-friendly bops.

### 4. Component Code Snippet
```javascript
"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface PostEditorProps {
  /** The raw content object from the discovery API */
  option: {
    title: string;
    summary: string;
    url: string;
    [key: string]: any;
  };
  /** Triggered when the user confirms the refined post */
  onPublish: (updatedData: any) => void;
  /** Triggered when the user rejects the suggestion */
  onDiscard: () => void;
  /** Global publishing state to disable buttons during fetch */
  isPublishing?: boolean;
}

/**
 * @name PostEditor
 * @description An interactive editor with Gen-Z specific AI rewriting capabilities.
 */
const PostEditor = ({ option, onPublish, onDiscard, isPublishing }: PostEditorProps) => {
  const [title, setTitle] = useState(option.title || "");
  const [summary, setSummary] = useState(option.summary || "");
  const [isVibing, setIsVibing] = useState(false);

  // Core feature: The Gen-Z AI Transformation logic
  const handleVibeCheck = async () => {
    setIsVibing(true);
    try {
      const res = await fetch("/api/summarize-genz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: summary }),
      });
      const data = await res.json();
      if (data.summary) setSummary(data.summary);
    } catch (err) {
      console.error("Vibe check failed:", err);
    } finally {
      setIsVibing(false);
    }
  };

  return (
    <div className="post-editor-card p-8 bg-white rounded-[2.5rem] border border-black/5 shadow-xl transition-all hover:shadow-2xl">
      {/* Title Field */}
      <div className="mb-6">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
          Headline
        </label>
        <textarea
          className="w-full text-2xl font-extrabold bg-transparent border-none outline-none resize-none focus:text-cyan-600 transition-colors"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          rows={2}
        />
      </div>

      {/* Summary Field with AI Magic Button */}
      <div className="mb-8 p-6 bg-slate-50/50 rounded-3xl border border-dashed border-black/10 relative">
        <div className="flex justify-between items-center mb-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            The Vibe (Summary)
          </label>
          <button 
            onClick={handleVibeCheck}
            disabled={isVibing}
            className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold rounded-full hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {isVibing ? "⌛ Rewriting..." : "✨ Gen Z Rewrite"}
          </button>
        </div>
        <textarea
          className="w-full bg-transparent border-none outline-none resize-none text-slate-600 leading-relaxed"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={4}
        />
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onPublish({ ...option, title, summary })}
          disabled={isPublishing}
          className="flex-1 py-4 bg-black text-white rounded-2xl font-bold hover:bg-slate-800 disabled:bg-slate-400 transition-all"
        >
          {isPublishing ? "Publishing..." : "Send it! 🚀"}
        </button>
        <button 
          onClick={onDiscard}
          className="px-6 py-4 text-slate-400 font-bold hover:text-red-500 transition-colors"
        >
          Discard
        </button>
      </div>
    </div>
  );
};

export { PostEditor };
```

### 5. Example Usage
```javascript
import { PostEditor } from "./components/PostEditor";

// Using inside a discovery list
const DiscoveryList = ({ suggestions }) => {
    return (
        <div className="grid gap-6 p-10 bg-slate-100">
            {suggestions.map((item) => (
                <PostEditor 
                    key={item.id}
                    option={item}
                    onPublish={(finalData) => saveToDB(finalData)}
                    onDiscard={() => console.log("Removed suggestion")}
                />
            ))}
        </div>
    );
};
```

### 6. Component Constraints
*   **Props**: `option` must be a valid object; `title` and `summary` are treated as the primary editable fields.
*   **State**: Maintains local state for edits to prevent accidental global overrides before publishing.
*   **Async**: Relies on a functioning `/api/summarize-genz` endpoint for the "Rewrite" feature.

### 7. Technical Implementation
The component employs an "Optimistic UI" approach locally, allowing users to tweak content instantly. The "Vibe Check" logic uses a standard JSON `POST` request to an external LLM-driven service, which then hydrates the local `summary` state with the returned slang-optimized content.

### 8. Author
[VERTICAL_PULSE_TEAM]

---

## 🟠 Component 3: ContentCard (Visual Display)

### 2. Pre-requisites
*   **Framework**: Next.js or Vite-React.
*   **Utilities**: `cn` for styling logic.
*   **Styles**: Tailwind CSS and `backdrop-filter`.

### 3. Functional Purpose
The `ContentCard` is the final visual representation of a published post. It is optimized for high engagement, featuring hover animations, clean domain badging, a read-more link, and a one-click clipboard sharing system.

### 4. Component Code Snippet
```javascript
"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface CardData {
  id: string;
  title: string;
  summary: string;
  image_url?: string;
  domain: string;
  url: string;
}

interface ContentCardProps {
  /** The post data object */
  card: CardData;
  /** Optional index for staggered animations */
  index?: number;
  /** Callback to delete the card from the dashboard */
  onDelete?: (id: string) => void;
}

/**
 * @name ContentCard
 * @description A premium display card for published content with integrated sharing.
 */
const ContentCard = ({ card, index = 0, onDelete }: ContentCardProps) => {
  const [copied, setCopied] = useState(false);
  
  // Staggered animation delay based on index
  const animDelay = `${index * 0.1}s`;

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/card/${card.id}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  return (
    <article 
      className="group relative flex flex-col w-full rounded-[2rem] bg-white/70 border border-black/5 backdrop-blur-xl overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 animate-in fade-in slide-in-from-bottom-5"
      style={{ animationDelay: animDelay }}
    >
      {/* Featured Image */}
      <div className="relative h-48 w-full overflow-hidden">
        {card.image_url ? (
          <img 
            src={card.image_url} 
            alt={card.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-slate-200 flex items-center justify-center text-3xl">📰</div>
        )}
        <div className="absolute top-4 left-4 px-3 py-1 bg-white/80 backdrop-blur-md rounded-full border border-black/5 shadow-sm">
          <span className="text-[10px] font-black uppercase text-cyan-600 tracking-tighter">• {card.domain}</span>
        </div>
      </div>

      {/* Textual Body */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-extrabold text-slate-900 leading-tight mb-3 line-clamp-2">
          {card.title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed mb-6">
          {card.summary}
        </p>

        {/* Dynamic Footer */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-black/5">
          <a 
            href={card.url} 
            target="_blank" 
            className="text-xs font-bold text-cyan-500 hover:text-cyan-700 transition-colors"
          >
            Read Article →
          </a>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleShare}
              className={cn(
                "px-4 py-1.5 text-[10px] font-black rounded-full transition-all",
                copied ? "bg-green-500 text-white" : "bg-black text-white hover:bg-slate-800"
              )}
            >
              {copied ? "COPIED" : "SHARE"}
            </button>
            <button 
                onClick={() => onDelete?.(card.id)}
                className="p-1 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all text-slate-300"
            >
                🗑️
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export { ContentCard };
```

### 5. Example Usage
```javascript
import { ContentCard } from "./components/ContentCard";

// Using inside a grid layout
const PostGrid = ({ posts }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-10">
            {posts.map((post, idx) => (
                <ContentCard 
                    key={post.id}
                    card={post}
                    index={idx} // Enables staggered animation
                    onDelete={(id) => removeFromFeed(id)}
                />
            ))}
        </div>
    );
};
```

### 6. Component Constraints
*   **Image Handling**: Uses a fallback box if `image_url` is missing or fails to load.
*   **Line Clamping**: Titles are limited to 2 lines and summaries to 3 to maintain grid symmetry.
*   **Sharing**: Relies on `navigator.clipboard` which requires a secure (HTTPS) context.

### 7. Technical Implementation
The `ContentCard` implements a CSS-driven animation system that calculates `animationDelay` based on its position in a list. It uses Tailwind's `group` utility to trigger secondary actions (like the delete icon) only when the card is hovered, keeping the interface clean for passive browsing.

### 8. Author
[VERTICAL_PULSE_TEAM]
