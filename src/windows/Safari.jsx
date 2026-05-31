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
const Safari = () => {
  const { containerRef, headerRef } = useWindow("safari");

  return (
    <section ref={containerRef} id="safari" className="window">
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
              className="flex-1"
            />
          </div>
        </div>
        <div className="flex items-center gap-5">
          <Share className="icon" />
          <Plus className="icon" />
          <Copy className="icon" />
        </div>
      </div>
      <div className="blog">
        <h2>My Blog</h2>

        <div className="space-y-5">
          {blogPosts.map((post) => (
            <div key={post.id} className="blog-post">
              <div className="col-span-2">
                <img src={post.image} alt={post.title} />
              </div>
              <div className="content">
                <p>{post.date}</p>
                <h3>{post.title}</h3>
                <a href={post.link} target="_blank" rel="noreferrer">
                  Read More
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
