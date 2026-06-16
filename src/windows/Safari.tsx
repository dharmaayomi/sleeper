import { useState } from "react";
import { WindowControls } from "#components";
import { useWindow } from "#hooks/useWindow";
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
  ShieldCheck,
  Globe,
  Folder,
  Image as ImageIcon,
  Terminal as TerminalIcon,
  Mail,
  ArrowRight,
  PenTool,
} from "lucide-react";
import { blogPosts, BlogPost } from "#constants";
import useDevice from "#hooks/useDevice";
import useWindowStore from "#store/Window";
import clsx from "clsx";

const GithubIcon = ({ className, size = 20 }: { className?: string; size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className, size = 20 }: { className?: string; size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Safari = () => {
  const { containerRef, headerRef } = useWindow("safari");
  const { isMobile } = useDevice();
  const { openWindow } = useWindowStore();

  // New state for sidebar & internal article reading
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

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
            <Search size={12} className="text-gray-400 shrink-0" />
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
                <span>🏠 Start Page</span>
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

              {blogPosts.length === 0 && (
                <li className="px-3 py-4 text-center text-[10px] text-gray-400 dark:text-zinc-500 font-inter leading-relaxed select-none">
                  No articles yet
                </li>
              )}
            </ul>
          </aside>
        )}

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-6 pb-16 bg-white dark:bg-zinc-900">
          <div className="max-w-2xl mx-auto">
            
            {/* ARTICLE VIEW */}
            {activePost ? (
              <article className="animate-fadeIn font-inter">
                {/* Back button for mobile */}
                {isMobile && (
                  <button
                    onClick={() => setActivePost(null)}
                    className="text-xs font-semibold text-blue-600 mb-4 inline-flex items-center gap-1 cursor-pointer"
                  >
                    &larr; Back to Start Page
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
              
              /* MACOS SAFARI START PAGE */
              <div className="animate-fadeIn font-inter py-2">
                
                {/* Favorites Section */}
                <div className="mb-10">
                  <h2 className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2 select-none">
                    <Globe size={13} className="text-blue-500" /> Favorites
                  </h2>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 justify-items-center">
                    {/* Favorite Item: Finder (Portfolio) */}
                    <button
                      onClick={() => openWindow("finder")}
                      className="group flex flex-col items-center gap-2 focus:outline-none cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl bg-neutral-50 dark:bg-zinc-800/80 flex items-center justify-center shadow-sm border border-neutral-200/60 dark:border-zinc-700/60 group-hover:scale-105 group-active:scale-95 transition-all duration-200">
                        <Folder size={20} className="text-blue-500 dark:text-blue-400" />
                      </div>
                      <span className="text-[11px] font-medium text-gray-600 dark:text-zinc-400 text-center truncate w-16 select-none">
                        Portfolio
                      </span>
                    </button>

                    {/* Favorite Item: Photos (Gallery) */}
                    <button
                      onClick={() => openWindow("photos")}
                      className="group flex flex-col items-center gap-2 focus:outline-none cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl bg-neutral-50 dark:bg-zinc-800/80 flex items-center justify-center shadow-sm border border-neutral-200/60 dark:border-zinc-700/60 group-hover:scale-105 group-active:scale-95 transition-all duration-200">
                        <ImageIcon size={20} className="text-rose-500 dark:text-rose-400" />
                      </div>
                      <span className="text-[11px] font-medium text-gray-600 dark:text-zinc-400 text-center truncate w-16 select-none">
                        Gallery
                      </span>
                    </button>

                    {/* Favorite Item: Contact */}
                    <button
                      onClick={() => openWindow("contact")}
                      className="group flex flex-col items-center gap-2 focus:outline-none cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl bg-neutral-50 dark:bg-zinc-800/80 flex items-center justify-center shadow-sm border border-neutral-200/60 dark:border-zinc-700/60 group-hover:scale-105 group-active:scale-95 transition-all duration-200">
                        <Mail size={20} className="text-emerald-500 dark:text-emerald-400" />
                      </div>
                      <span className="text-[11px] font-medium text-gray-600 dark:text-zinc-400 text-center truncate w-16 select-none">
                        Contact
                      </span>
                    </button>

                    {/* Favorite Item: Terminal (Skills) */}
                    <button
                      onClick={() => openWindow("terminal")}
                      className="group flex flex-col items-center gap-2 focus:outline-none cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl bg-neutral-50 dark:bg-zinc-800/80 flex items-center justify-center shadow-sm border border-neutral-200/60 dark:border-zinc-700/60 group-hover:scale-105 group-active:scale-95 transition-all duration-200">
                        <TerminalIcon size={20} className="text-zinc-700 dark:text-zinc-300" />
                      </div>
                      <span className="text-[11px] font-medium text-gray-600 dark:text-zinc-400 text-center truncate w-16 select-none">
                        Skills
                      </span>
                    </button>

                    {/* Favorite Item: GitHub */}
                    <a
                      href="https://github.com/dharmaayomi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center gap-2 focus:outline-none cursor-pointer text-decoration-none"
                    >
                      <div className="w-12 h-12 rounded-xl bg-neutral-50 dark:bg-zinc-800/80 flex items-center justify-center shadow-sm border border-neutral-200/60 dark:border-zinc-700/60 group-hover:scale-105 group-active:scale-95 transition-all duration-200">
                        <GithubIcon className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />
                      </div>
                      <span className="text-[11px] font-medium text-gray-600 dark:text-zinc-400 text-center truncate w-16 select-none">
                        GitHub
                      </span>
                    </a>

                    {/* Favorite Item: LinkedIn */}
                    <a
                      href="https://www.linkedin.com/in/dharma-ayomi-ramadhani/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center gap-2 focus:outline-none cursor-pointer text-decoration-none"
                    >
                      <div className="w-12 h-12 rounded-xl bg-neutral-50 dark:bg-zinc-800/80 flex items-center justify-center shadow-sm border border-neutral-200/60 dark:border-zinc-700/60 group-hover:scale-105 group-active:scale-95 transition-all duration-200">
                        <LinkedinIcon className="w-5 h-5 text-[#0A66C2]" />
                      </div>
                      <span className="text-[11px] font-medium text-gray-600 dark:text-zinc-400 text-center truncate w-16 select-none">
                        LinkedIn
                      </span>
                    </a>
                  </div>
                </div>

                {/* Privacy Report Section */}
                <div className="mb-10">
                  <h2 className="text-xs font-bold text-gray-400 font-inter dark:text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2 select-none">
                    <ShieldCheck size={13} className="text-emerald-500" /> Privacy Report
                  </h2>
                  <div className="bg-neutral-50 dark:bg-zinc-800/30 border border-neutral-200/60 dark:border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100/50 dark:bg-emerald-950/20 flex items-center justify-center shrink-0">
                        <ShieldCheck size={20} className="text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-800 dark:text-zinc-200">
                          Safari prevented 47 trackers from profiling you on this portfolio.
                        </p>
                        <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-0.5">
                          Your connection is encrypted. Privacy report data is generated locally.
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold cursor-default hover:underline flex items-center gap-1 shrink-0">
                      Details
                    </div>
                  </div>
                </div>

                {/* Reading List / Blog Posts Section */}
                <div>
                  <h2 className="text-xs font-bold text-gray-400 font-inter dark:text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2 select-none">
                    <BookOpen size={13} className="text-indigo-500" /> Reading List
                  </h2>

                  {blogPosts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {blogPosts.map((post) => (
                        <div
                          key={post.id}
                          className="group cursor-pointer p-3 rounded-xl bg-neutral-50 dark:bg-zinc-800/30 hover:bg-neutral-100/60 dark:hover:bg-zinc-800/60 border border-neutral-200/60 dark:border-zinc-800 hover:border-neutral-300 dark:hover:border-zinc-700 transition-all duration-200 flex gap-4 items-center"
                          onClick={() => setActivePost(post)}
                        >
                          <div className="w-16 h-12 overflow-hidden rounded-lg bg-gray-100 dark:bg-zinc-700 shrink-0">
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-gray-400 mb-0.5">{post.date}</p>
                            <h3 className="font-semibold text-xs text-gray-800 dark:text-zinc-200 truncate group-hover:text-blue-600 transition-colors">
                              {post.title}
                            </h3>
                          </div>
                          <ArrowRight size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors mr-1 shrink-0" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* macOS-style Empty Condition */
                    <div className="flex flex-col items-center justify-center text-center p-8 bg-neutral-50/30 dark:bg-zinc-800/10 border border-dashed border-neutral-200 dark:border-zinc-800/60 rounded-2xl animate-fadeIn">
                      <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-zinc-800/60 flex items-center justify-center mb-3">
                        <PenTool size={18} className="text-gray-400 dark:text-zinc-500" />
                      </div>
                      <h3 className="text-xs font-semibold text-gray-800 dark:text-zinc-200 mb-1 select-none">
                        No Articles Published
                      </h3>
                      <p className="text-[11px] text-gray-400 dark:text-zinc-500 max-w-[280px] leading-relaxed select-none">
                        The author hasn't written any articles yet. When tutorials or blog updates are published, they'll appear here.
                      </p>
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default Safari;
