interface TechStackItem {
  category: string;
  items: string[];
}

const techStack: TechStackItem[] = [
  {
    category: "Frontend",
    items: ["Astro.js", "Next.js", "TypeScript"],
  },

  {
    category: "Styling",
    items: ["Tailwind CSS", "Sass", "CSS"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express"],
  },
  {
    category: "Database",
    items: ["PostgreSQL"],
  },
  {
    category: "Dev Tools",
    items: ["Git", "GitHub", "Docker"],
  },
];

export { techStack };
export type { TechStackItem };
