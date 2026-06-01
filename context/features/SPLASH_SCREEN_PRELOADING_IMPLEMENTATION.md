# Implementation Plan - Splash Screen & Asset Preloading

Implement an **authentic macOS-style splash screen** that displays during initial app load, with **background asset preloading** to ensure smooth performance after the splash screen closes.

This is a **performance-focused feature** — improves perceived performance and actual UX.

---

## User Review Required

> [!IMPORTANT]
> - A new `Splash.tsx` component will be created in `src/components/` to replace the existing `Welcome.tsx`
> - A new `useAssetPreloader.ts` hook will be created in `src/hooks/` to handle background asset loading
> - A new `SplashLogo.svg` (or `.png`) asset will be created in `public/images/`
> - `src/main.tsx` will wrap `<App />` with `<Splash>` component conditionally
> - Preloading strategy: Critical assets load during splash (images, PDFs), secondary assets lazy-load after
> - Zero changes to existing window/dock/navbar logic

---

## Design Reference

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│         [LOGO + ANIMATION]      │  ← macOS Apple logo (or your logo)
│                                 │
│         ░░░░░░░░░ 45%           │  ← Loading progress bar
│                                 │
│                                 │
└─────────────────────────────────┘

Fullscreen dark/black background
Centered logo (fade + scale animation)
Smooth progress bar (0% → 100%)
Duration: 2-4 seconds (depending on asset size)
```

---

## Proposed Changes

### Assets

#### [NEW] `public/images/splash-logo.png`
Your macOS-style logo (or Apple logo if using Porto as-is). Requirements:
- **Dimensions:** 100x100px to 150x150px (square)
- **Format:** PNG with transparency, or SVG
- **Color:** White or light color (on dark background)
- **File size:** < 20kb

> Agent/Designer: Use the uploaded image as reference. Create a clean SVG or optimize PNG.

#### [NEW] `public/images/splash-logo@2x.png` (Optional)
High-DPI version for retina displays (2x scale).

---

### Hooks

#### [NEW] `src/hooks/useAssetPreloader.ts`
A custom hook that preloads all critical assets in the background while splash screen is visible.

```typescript
import { useEffect, useState } from 'react'

interface PreloadProgress {
  loaded: number
  total: number
  percentage: number
}

export const useAssetPreloader = () => {
  const [progress, setProgress] = useState<PreloadProgress>({
    loaded: 0,
    total: 0,
    percentage: 0,
  })
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const preloadAssets = async () => {
      // List of critical assets to preload
      const criticalAssets = [
        // Images
        '/images/wallpaper.jpg',
        '/images/blog1.png',
        '/images/blog2.png',
        // Add other important images
        
        // PDFs
        '/files/resume.pdf',
        
        // Icons (optional, usually small)
        // '/icons/*.svg' or just let them load naturally
      ]

      const total = criticalAssets.length
      setProgress({ loaded: 0, total, percentage: 0 })

      // Preload each asset
      for (let i = 0; i < criticalAssets.length; i++) {
        try {
          await preloadAsset(criticalAssets[i])
          const loaded = i + 1
          const percentage = Math.round((loaded / total) * 100)
          setProgress({ loaded, total, percentage })
        } catch (error) {
          console.warn(`Failed to preload: ${criticalAssets[i]}`, error)
          // Continue even if one fails
          setProgress((prev) => ({
            ...prev,
            loaded: prev.loaded + 1,
          }))
        }
      }

      // Minimum splash duration (e.g., 2.5 seconds for better UX)
      await new Promise((resolve) => setTimeout(resolve, 2500))
      setIsComplete(true)
    }

    preloadAssets()
  }, [])

  return { progress, isComplete }
}

/**
 * Helper function to preload a single asset
 * Returns a promise that resolves when asset is loaded
 */
function preloadAsset(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (url.endsWith('.pdf')) {
      // For PDFs, just fetch headers to verify availability
      fetch(url, { method: 'HEAD' })
        .then(() => resolve())
        .catch(reject)
    } else {
      // For images, use Image API
      const img = new Image()
      img.onload = () => resolve()
      img.onerror = () => reject(new Error(`Failed to load: ${url}`))
      img.src = url
    }
  })
}
```

---

### Components

#### [NEW] `src/components/Splash.tsx`
The macOS-style splash screen shown during asset preloading.

```tsx
import { useAssetPreloader } from '#hooks/useAssetPreloader'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

interface SplashProps {
  children: ReactNode
  minDuration?: number // Minimum time to show splash (ms)
  logoSrc?: string
}

export default function Splash({
  children,
  minDuration = 2500,
  logoSrc = '/images/splash-logo.png',
}: SplashProps) {
  const { progress, isComplete } = useAssetPreloader()
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (isComplete) {
      // Add small delay for smooth transition
      const timer = setTimeout(() => setShowContent(true), 300)
      return () => clearTimeout(timer)
    }
  }, [isComplete])

  if (!showContent) {
    return (
      <div className="splash-screen">
        <div className="splash-container">
          {/* Logo */}
          <div className="splash-logo-wrapper">
            <img
              src={logoSrc}
              alt="Loading"
              className="splash-logo"
              width={120}
              height={120}
            />
          </div>

          {/* Progress Bar */}
          <div className="splash-progress">
            <div
              className="splash-progress-bar"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>

          {/* Optional: Loading text */}
          <p className="splash-text">
            {progress.percentage === 100 ? 'Ready...' : `${progress.percentage}%`}
          </p>
        </div>
      </div>
    )
  }

  // Fade out and show content
  return <div className="splash-fade-out">{children}</div>
}
```

#### [MODIFY] `src/components/index.ts`
Export the new component:

```diff
export { default as WindowControls } from './WindowControls'
export { default as Navbar } from './Navbar'
export { default as Dock } from './Dock'
export { default as Welcome } from './Welcome'
export { default as Home } from './Home'
export { default as ThemePanel } from './ThemePanel'
+export { default as Splash } from './Splash'
```

---

### Entry Point

#### [MODIFY] `src/main.tsx`
Wrap `<App />` with `<Splash>` component:

```diff
+import { Splash } from '#components'
 import App from './App'
 import './index.css'

 ReactDOM.createRoot(document.getElementById('root')).render(
   <React.StrictMode>
     <ThemeProvider
       attribute="class"
       defaultTheme="system"
       enableSystem
       disableTransitionOnChange={false}
     >
+      <Splash minDuration={2500} logoSrc="/images/splash-logo.png">
         <App />
+      </Splash>
     </ThemeProvider>
   </React.StrictMode>
 )
```

---

### Styling

#### [MODIFY] `src/index.css`
Add splash screen styles:

```css
/* === SPLASH SCREEN === */
.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000; /* Dark background like macOS boot */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: none; /* Full black, no blur */
}

.splash-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  text-align: center;
}

.splash-logo-wrapper {
  animation: splashLogoFade 0.6s ease-out forwards;
}

.splash-logo {
  width: 120px;
  height: 120px;
  object-fit: contain;
  filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.1));
}

@keyframes splashLogoFade {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Progress Bar */
.splash-progress {
  width: 120px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.splash-progress-bar {
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 2px;
  transition: width 0.3s ease-out;
  animation: splashProgressGlow 1.5s ease-in-out infinite;
}

@keyframes splashProgressGlow {
  0%, 100% {
    filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.6));
  }
  50% {
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
  }
}

.splash-text {
  margin-top: 20px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

/* Fade out transition */
.splash-fade-out {
  animation: splashFadeOut 0.5s ease-out forwards;
}

@keyframes splashFadeOut {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## Asset Preloading Strategy

### Critical Assets (Load During Splash)
✅ Load during splash screen (user sees progress):
- Wallpaper image
- Blog post thumbnails
- Resume PDF
- Gallery images (first batch)
- App icons in dock

### Secondary Assets (Lazy Load After)
⚡ Load in background after splash closes:
- Additional gallery images (infinite scroll)
- Large window content
- Optional: Font families (already cached by browser usually)

### Implementation in `useAssetPreloader.ts`

```typescript
// Critical assets list (shown in splash progress)
const criticalAssets = [
  '/images/wallpaper.jpg',        // ~200-500kb
  '/images/blog1.png',
  '/images/blog2.png',
  '/files/resume.pdf',             // ~1-3mb
  // Add based on your actual assets
]

// Secondary assets load after via separate hook
// (not blocking splash completion)
```

---

## Performance Optimizations

### 1. Image Optimization
Before adding to preload list:
```bash
# Use optimized formats
jpegoptim wallpaper.jpg --max=85
# or
imagemin wallpaper.jpg --out-dir=optimized

# For PNG
pngquant wallpaper.png
```

**Target sizes:**
- Wallpaper: < 500kb (JPEG 80-85% quality)
- Blog thumbnails: < 50kb each
- Icons: < 10kb each

### 2. PDF Optimization
Compress resume.pdf before adding:
```bash
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 \
   -dPDFSETTINGS=/ebook \
   -dNOPAUSE -dQUIET -dBATCH \
   -sOutputFile=resume-optimized.pdf resume.pdf
```

**Target:** < 2mb

### 3. HTTP Caching Headers
Set in web server config (Vercel, Netlify, etc.):
```
# Cache images for 1 month
images/*: max-age=2592000, immutable

# Cache PDFs for 1 week
files/*: max-age=604800

# Don't cache HTML
*.html: max-age=3600, must-revalidate
```

### 4. Lazy Load Secondary Assets
After splash closes, use React Suspense + dynamic imports:

```tsx
const Photos = lazy(() => import('#windows/Photos'))
const Image = lazy(() => import('#windows/Image'))

// Automatically lazy-loads when window opens
```

---

## File Structure Impact

```
public/
├── images/
│   ├── splash-logo.png       ← NEW
│   ├── splash-logo@2x.png    ← NEW (optional)
│   └── (existing images)
└── (existing public files)

src/
├── components/
│   ├── Splash.tsx            ← NEW
│   └── index.ts              ← +1 export
├── hooks/
│   ├── useAssetPreloader.ts  ← NEW
│   └── (existing hooks)
├── main.tsx                  ← MODIFY (wrap with <Splash>)
├── index.css                 ← MODIFY (+splash styles)
└── (existing files unchanged)
```

---

## Verification Plan

### Pre-Implementation
- [ ] All image assets optimized (sizes checked)
- [ ] PDFs compressed
- [ ] Logo ready (splash-logo.png)

### Build & Performance
```bash
npm run build                          # Check bundle size
npm run preview                        # Test splash locally
```

Check DevTools:
- [ ] Lighthouse Performance score > 80
- [ ] Splash shows for 2.5+ seconds
- [ ] Images load during splash (Network tab)
- [ ] No console errors

### Functional Testing
- [ ] Splash appears on page load
- [ ] Logo animation smooth (0.6s fade-in)
- [ ] Progress bar animates smoothly (0-100%)
- [ ] After completion, app content fades in
- [ ] All assets loaded (no broken images after splash)

### User Experience
- [ ] Splash duration feels natural (not too fast, not too slow)
- [ ] App responsive after splash closes
- [ ] No layout shift or content flash
- [ ] Dock icons visible and responsive
- [ ] Windows open smoothly (no lag)

### Mobile Testing
- [ ] Splash fullscreen on mobile
- [ ] Progress bar visible and readable
- [ ] Assets preload even on slower connections
- [ ] Timeout fallback works (shows content even if slow)

---

## Customization Options

### Adjust Splash Duration

In `src/main.tsx`:
```tsx
<Splash minDuration={3000}>  {/* 3 seconds instead of 2.5 */}
  <App />
</Splash>
```

### Change Logo
```tsx
<Splash logoSrc="/images/your-custom-logo.png">
  <App />
</Splash>
```

### Add Loading Text

Modify `Splash.tsx`:
```tsx
<p className="splash-text">Loading your portfolio...</p>
```

### Custom Background Color

Modify `index.css`:
```css
.splash-screen {
  background: linear-gradient(135deg, #000, #1a1a1a);
}
```

---

## Why This Approach?

| Aspect | Benefit |
|---|---|
| **Splash during preload** | Hides loading time, improves perceived performance |
| **Background preloading** | Critical assets ready when windows open |
| **Progress bar** | Shows users something is happening (perceived performance) |
| **Minimum duration** | Ensures splash is visible long enough to feel intentional |
| **Lazy loading** | Secondary assets load after splash closes (no blocking) |
| **Asset optimization** | Keeps bundle and load times reasonable |

---

## Rollback Plan

If issues:
1. Remove `<Splash>` wrapper from `src/main.tsx`
2. Delete `src/components/Splash.tsx` and `src/hooks/useAssetPreloader.ts`
3. Delete `/public/images/splash-logo*.png`
4. Remove splash CSS from `src/index.css`

**Zero impact on existing features.**

---

## Next Steps After Implementation

1. Monitor Lighthouse scores and adjust asset list
2. Gather user feedback on splash duration
3. Consider A/B testing different splash durations (2s vs 3s)
4. Add splash skip option for returning users (optional)
5. Track preload success rate (analytics)

