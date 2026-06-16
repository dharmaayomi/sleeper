interface BlogPost {
  id: number;
  date: string;
  title: string;
  image: string;
  link?: string; // Optional for future external links
  content: string; // New: Full article content (HTML string)
}

const blogPosts: BlogPost[] = [
  // {
  //   id: 1,
  //   date: "Jun 12, 2026",
  //   title: "How I Built My Interactive macOS Portfolio",
  //   image: "/images/blog1.png",
  //   content: `
  //     <p>This is a custom article describing the development process of this high-fidelity macOS simulation.</p>
  //     <h4>Technologies Used</h4>
  //     <p>Built with React, TypeScript, TailwindCSS, and GSAP for animations.</p>
  //   `,
  // }
];

export { blogPosts };
export type { BlogPost };

