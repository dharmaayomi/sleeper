# Implementation Plan - Safari Sidebar & Internal Blog Reader

Add a native Safari-style sidebar (like Safari's Reading List panel) that displays blog articles within the app instead of redirecting to external links. Blog content will be self-hosted and rendered internally with full reading experience.

---

## User Review Required

> [!IMPORTANT]
> - A new sidebar component will be integrated into `Safari.tsx` (not a separate file) with local state management
> - Sidebar toggles via existing `<PanelLeft />` icon in the window header
> - Sidebar only appears on **desktop** (hidden on mobile) — uses `useDevice()` hook
> - Blog data structure updated in `src/constants/safari.ts` to include `content` field (HTML string)
> - Articles now open **internally** in Safari window instead of external redirect
> - Mobile has back button to return to article list; desktop uses ChevronLeft button
> - Zero breaking changes to existing windows or state management

---

## Proposed Changes

### Constants

#### [MODIFY] `src/constants/safari.ts`
Expand `BlogPost` interface to include `content` property (HTML string for rendering). Update blog posts array with full article content.

**Updated BlogPost Interface:**
```typescript
interface BlogPost {
  id: number
  date: string
  title: string
  image: string
  link?: string // Optional for future external links
  content: string // New: Full article content (HTML string)
}
```

**Sample Blog Posts:**
```typescript
const blogPosts: BlogPost[] = [
  {
    id: 1,
    date: "Sep 2, 2025",
    title: "TypeScript Explained: What It Is, Why It Matters, and How to Master It",
    image: "/images/blog1.png",
    content: `
      <p>TypeScript is a superset of JavaScript that adds static typing capabilities. This feature helps developers catch bugs early before code runs in the browser.</p>
      <h4>Why TypeScript Matters</h4>
      <p>In large-scale projects, tracking data types of variables and function parameters becomes challenging. TypeScript solves this by providing reliable autocompletion and self-documenting code.</p>
      <h4>Getting Started</h4>
      <p>You can install TypeScript globally or set it up directly in your Vite/Next.js project using tsconfig.json configuration.</p>
    `,
  },
  {
    id: 2,
    date: "Aug 28, 2025",
    title: "The Ultimate Guide to Mastering Three.js for 3D Development",
    image: "/images/blog2.png",
    content: `
      <p>Three.js brings the power of WebGL into easy-to-understand JavaScript syntax, enabling creation of interactive 3D graphics directly in the browser.</p>
      <h4>Core Three.js Components</h4>
      <p>To create a 3D visualization, you need at least three basic elements: Scene (stage), Camera (viewpoint), and Renderer (drawing tool).</p>
      <h4>Performance Optimization Tips</h4>
      <p>Always reuse geometry and materials, reduce polygon count on 3D models (GLB/GLTF files), and use efficient lighting techniques.</p>
    `,
  },
  {
    id: 3,
    date: "Aug 15, 2025",
    title: "The Ultimate Guide to Mastering GSAP Animations",
    image: "/images/blog3.png",
    content: `
      <p>GSAP (GreenSock Animation Platform) is the industry standard for creating high-performance web animations that run smoothly on all modern browsers.</p>
      <h4>GSAP vs CSS Animations</h4>
      <p>GSAP handles complex animations with sequencing control like pause, reverse, and seek — features difficult to achieve with CSS Transitions alone.</p>
      <h4>Key Features</h4>
      <p>Use the ScrollTrigger plugin to bind animations directly to scroll position, creating immersive interactive experiences.</p>
    `,
  },
]

export { blogPosts }
export type { BlogPost }
```

---

### Components

#### [MODIFY] `src/windows/Safari.tsx`
Complete rewrite to include local sidebar state, article reading functionality, and responsive layout.

**Key Changes:**
- Add `showSidebar` state (boolean) — controls sidebar visibility on desktop
- Add `activePost` state (BlogPost | null) — tracks currently reading article
- Toggle sidebar with `<PanelLeft />` icon click
- Layout changes to flex-based container (sidebar left, content right)
- Render article content using `dangerouslySetInnerHTML` when `activePost` is set
- Back button on mobile (`<ChevronLeft />` on desktop) to return to article list

```typescript
import { useState } from "react"
import { WindowControls } from "#components"
import { useWindow } from "#hooks/useWindow"
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  PanelLeft,
  Plus,
  Search,
  Share,
  ShieldHalf,
  BookOpen,
} from "lucide-react"
import { blogPosts, BlogPost } from "#constants"
import useDevice from "#hooks/useDevice"
import clsx from "clsx"

const Safari = () => {
  const { containerRef, headerRef } = useWindow("safari")
  const { isMobile } = useDevice()

  // New state for sidebar & internal article reading
  const [showSidebar, setShowSidebar] = useState<boolean>(true)
  const [activePost, setActivePost] = useState<BlogPost | null>(null)

  return (
    <section ref={containerRef} id="safari" className="window">
      {/* Header Toolbar - Responsive */}
      {isMobile ? (
        <div
          ref={headerRef}
          id="window-header"
          className="relative flex items-center justify-between select-none"
        >
          <WindowControls target="safari" />
          <div className="search flex items-center gap-1.5 bg-neutral-100 border border-neutral-200 rounded-lg px-2.5 py-1 w-[55%] truncate mr-2 select-none">
            <Search size={12} className="text-gray-400 flex-shrink-0" />
            <span className="text-[11px] text-gray-500 font-inter truncate">
              {activePost ? "articles.com/blog" : "articles.com"}
            </span>
          </div>
        </div>
      ) : (
        <div ref={headerRef} id="window-header">
          <WindowControls target="safari" />

          {/* PanelLeft icon toggles sidebar */}
          <PanelLeft
            className={clsx(
              "ml-10 icon cursor-pointer transition-colors",
              showSidebar && "text-blue-600"
            )}
            onClick={() => setShowSidebar(!showSidebar)}
          />

          <div className="flex items-center gap-1 ml-5">
            {/* Back button - enabled only when reading article */}
            <ChevronLeft
              className={clsx(
                "icon",
                activePost ? "cursor-pointer text-gray-700" : "opacity-30 pointer-events-none"
              )}
              onClick={() => setActivePost(null)}
            />
            <ChevronRight className="icon opacity-30 pointer-events-none" />
          </div>

          <div className="flex-1 flex items-center justify-center gap-3">
            <ShieldHalf className="icon" />

            <div className="search flex gap-2">
              <Search className="icon" />
              <input
                type="text"
                name="Search Safari"
                placeholder="Search or enter website name"
                className="flex-1 text-xs"
                value={activePost ? `articles.com/blog/${activePost.id}` : "articles.com"}
                readOnly
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <Share className="icon" />
            <Plus className="icon" />
            <Copy className="icon" />
          </div>
        </div>
      )}

      {/* Main Safari Layout Container */}
      <div className="flex h-[calc(100%-2.75rem)] overflow-hidden w-full bg-white dark:bg-zinc-900">
        
        {/* SIDEBAR - Desktop Only */}
        {!isMobile && showSidebar && (
          <aside className="w-64 border-r border-gray-100 dark:border-zinc-800 bg-neutral-50/50 dark:bg-zinc-900/50 h-full flex flex-col select-none animate-fadeIn">
            <div className="p-4 border-b border-gray-100 dark:border-zinc-800">
              <h3 className="text-xs font-bold font-inter text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen size={13} /> Reading List
              </h3>
            </div>

            <ul className="flex-1 overflow-y-auto p-2 space-y-1">
              {/* Return to article list */}
              <li
                onClick={() => setActivePost(null)}
                className={clsx(
                  "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-xs font-inter transition-all font-medium",
                  activePost === null
                    ? "bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100"
                    : "text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                )}
              >
                <span>🏠 All Articles</span>
              </li>

              <div className="h-px bg-gray-100 dark:bg-zinc-800 my-2 mx-2" />

              {/* Article shortcuts in sidebar */}
              {blogPosts.map((post) => (
                <li
                  key={post.id}
                  onClick={() => setActivePost(post)}
                  className={clsx(
                    "flex flex-col gap-0.5 px-3 py-2 rounded-lg cursor-pointer text-xs font-inter transition-all",
                    activePost?.id === post.id
                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-medium"
                      : "text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                  )}
                >
                  <span className="truncate w-full">{post.title}</span>
                  <span className="text-[10px] text-gray-400">{post.date}</span>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-6 pb-16">
          <div className="max-w-2xl mx-auto">
            
            {/* ARTICLE VIEW */}
            {activePost ? (
              <article className="animate-fadeIn font-inter">
                {/* Back button for mobile */}
                {isMobile && (
                  <button
                    onClick={() => setActivePost(null)}
                    className="text-xs font-semibold text-blue-600 mb-4 inline-flex items-center gap-1"
                  >
                    &larr; Back to Blog
                  </button>
                )}

                <p className="text-xs text-gray-400 mb-2">{activePost.date}</p>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-zinc-100 leading-tight mb-6">
                  {activePost.title}
                </h1>

                <div className="w-full h-56 sm:h-72 rounded-xl overflow-hidden mb-6">
                  <img
                    src={activePost.image}
                    alt={activePost.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Render article content */}
                <div
                  className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-zinc-300 space-y-4 text-sm sm:text-base leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: activePost.content }}
                />
              </article>
            ) : (
              
              /* BLOG LIST VIEW */
              <div className="animate-fadeIn">
                <h2 className="text-xl font-inter font-bold text-zinc-800 dark:text-zinc-200 mb-8">
                  My Blog
                </h2>

                <div className="space-y-8">
                  {blogPosts.map((post) => (
                    <div
                      key={post.id}
                      className={
                        isMobile
                          ? "flex flex-col gap-3"
                          : "blog-post grid grid-cols-12 space-x-5 cursor-pointer group"
                      }
                      onClick={() => setActivePost(post)}
                    >
                      <div
                        className={
                          isMobile ? "w-full rounded-lg overflow-hidden" : "col-span-3"
                        }
                      >
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-40 md:h-24 object-cover rounded-md group-hover:opacity-90 transition-opacity"
                        />
                      </div>

                      <div
                        className={`content ${isMobile ? "space-y-1.5" : "col-span-9 space-y-1.5"}`}
                      >
                        <p className="text-[11px] font-inter text-gray-400">
                          {post.date}
                        </p>
                        <h3 className="font-semibold text-sm text-gray-800 dark:text-zinc-200 leading-snug group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </h3>
                        <span className="text-blue-600 text-xs font-semibold inline-flex items-center gap-1 mt-1">
                          Read Inside &rarr;
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  )
}

export default Safari
```

---

## Key Features Explained

### 1. **Desktop-Only Sidebar**
- Controlled by `showSidebar` state
- Toggle with `<PanelLeft />` icon in header
- Mimics Safari Reading List aesthetic with Tailwind styling
- Shows "All Articles" link + list of all blog posts
- Responsive width (w-64) and dark mode support

### 2. **Internal Blog Reader**
- Articles load **within** Safari window instead of external redirect
- Content rendered using `dangerouslySetInnerHTML` (HTML string)
- Smooth fade-in animations (`animate-fadeIn`)
- Date, title, hero image, and full content displayed

### 3. **Smart Navigation**
- Desktop: `<ChevronLeft />` button in header returns to article list
- Mobile: "Back to Blog" button below article title
- Both trigger `setActivePost(null)` to show list view

### 4. **Responsive Design**
- Sidebar hidden on mobile (checked via `useDevice()` hook)
- Article layout adapts: grid on desktop, stack on mobile
- Images scale appropriately for mobile screens
- Touch-friendly margins and spacing

### 5. **Dark Mode Support**
- Sidebar colors use `dark:` variants
- Content area supports dark mode with prose styling
- Text colors adjust automatically

---

## File Structure Impact

```
src/
├── constants/
│   └── safari.ts         ← MODIFY (add content to BlogPost)
├── windows/
│   └── Safari.tsx        ← MODIFY (add sidebar + internal reader)
└── (other files unchanged)
```

---

## Verification Plan

### Functional Testing
- [ ] Click `<PanelLeft />` icon → sidebar appears/disappears smoothly
- [ ] Sidebar visible on desktop, hidden on mobile
- [ ] Click article in sidebar → article opens with content visible
- [ ] Click article in blog list → same article opens
- [ ] Click "All Articles" in sidebar → returns to blog list
- [ ] Click `<ChevronLeft />` on desktop → returns to blog list
- [ ] Mobile: "Back to Blog" button works correctly
- [ ] Article content renders properly (no HTML escaping issues)
- [ ] All images load correctly in articles
- [ ] Dark mode toggle affects sidebar and article colors

### Design Integration
- [ ] Sidebar matches Safari aesthetic (minimalist, light gray background)
- [ ] Active article highlighted in sidebar (blue background)
- [ ] Hover states work on sidebar items and article list
- [ ] Animations smooth (fadeIn, transitions)
- [ ] No layout shift when toggling sidebar
- [ ] Header remains aligned and functional

### Content
- [ ] All three blog posts load with content
- [ ] Article titles render correctly
- [ ] Dates display properly
- [ ] Hero images appear in both list and article view
- [ ] HTML content renders without escaping
- [ ] Spacing and typography looks professional

---

## Customization

### Add More Blog Posts
Edit `src/constants/safari.ts`:
```typescript
const blogPosts: BlogPost[] = [
  // ... existing posts ...
  {
    id: 4,
    date: "Aug 1, 2025",
    title: "Your New Article Title",
    image: "/images/blog4.png",
    content: `
      <p>Your article content here...</p>
      <h4>Section Title</h4>
      <p>More content...</p>
    `,
  },
]
```

### Change Sidebar Width
Modify `Safari.tsx`:
```tsx
{!isMobile && showSidebar && (
  <aside className="w-72 border-r ...">  {/* Change w-64 to w-72 */}
```

### Customize Article Styling
Update prose classes in Safari.tsx:
```tsx
<div className="prose prose-sm dark:prose-invert ...">
  {/* Adjust: prose-lg, prose-base, prose-sm, etc. */}
```

---

## Performance Notes

- **No external requests**: Blog content is bundled in app (no network overhead)
- **Sidebar rendered conditionally**: Only on desktop, hidden on mobile (less DOM)
- **Lazy article loading**: Article content loaded on click, not pre-rendered
- **Dark mode optimized**: CSS variables used throughout for instant theme switching

---

## Rollback Plan

If issues arise:
1. Revert `src/constants/safari.ts` to original (remove `content` field)
2. Revert `src/windows/Safari.tsx` to original version (remove sidebar logic)

**Zero impact on other windows or features.**

---

## Next Steps After Implementation

1. Test on multiple devices (mobile, tablet, desktop)
2. Gather user feedback on sidebar usability
3. Consider adding article search/filter in sidebar
4. Add social share buttons in article view
5. Consider adding reading time estimate
6. Monitor performance with Lighthouse

