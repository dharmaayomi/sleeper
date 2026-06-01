interface BlogPost {
  id: number;
  date: string;
  title: string;
  image: string;
  link?: string; // Optional for future external links
  content: string; // New: Full article content (HTML string)
}

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
];

export { blogPosts };
export type { BlogPost };
