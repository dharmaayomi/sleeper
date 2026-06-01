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
} from "lucide-react";
import { blogPosts } from "#constants";
import useDevice from "#hooks/useDevice";

const Safari = () => {
  const { containerRef, headerRef } = useWindow("safari");
  const { isMobile } = useDevice();

  return (
    <section ref={containerRef} id="safari" className="window">
      {/* Responsive Header Toolbar */}
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
              articles.com
            </span>
          </div>
        </div>
      ) : (
        <div ref={headerRef} id="window-header">
          <WindowControls target="safari" />

          <PanelLeft className="ml-10 icon" />

          <div className="flex items-center gap-1 ml-5">
            <ChevronLeft className="icon" />
            <ChevronRight className="icon" />
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

      {/* Safari Content */}
      <div className="blog h-[calc(100%-2.75rem)] overflow-y-auto p-6 pb-16 max-w-3xl mx-auto">
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
                  : "blog-post grid grid-cols-12 space-x-5"
              }
            >
              <div
                className={
                  isMobile ? "w-full rounded-lg overflow-hidden" : "col-span-2"
                }
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-40 md:h-full object-cover rounded-md"
                />
              </div>
              <div
                className={`content ${isMobile ? "space-y-1.5" : "col-span-10 space-y-3"}`}
              >
                <p className="text-[11px] font-inter text-gray-400">
                  {post.date}
                </p>
                <h3 className="font-semibold text-sm sm:text-base text-gray-800 leading-snug">
                  {post.title}
                </h3>
                <a
                  href={post.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 text-xs font-semibold hover:underline inline-flex items-center gap-1 mt-1"
                >
                  Read More &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Safari;
