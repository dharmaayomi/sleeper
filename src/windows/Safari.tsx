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
} from "lucide-react";
import { blogPosts, BlogPost } from "#constants";
import useDevice from "#hooks/useDevice";
import clsx from "clsx";

const Safari = () => {
  const { containerRef, headerRef } = useWindow("safari");
  const { isMobile } = useDevice();

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
                    className="text-xs font-semibold text-blue-600 mb-4 inline-flex items-center gap-1 cursor-pointer"
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
                          ? "flex flex-col gap-3 cursor-pointer"
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
  );
};

export default Safari;
