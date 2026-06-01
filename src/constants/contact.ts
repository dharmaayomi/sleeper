interface Social {
  id: number;
  text: string;
  icon: string;
  bg: string;
  link: string;
}

const socials: Social[] = [
  {
    id: 1,
    text: "Github",
    icon: "/icons/github.svg",
    bg: "#f4656b",
    link: "https://github.com/dharmaayomi",
  },
  {
    id: 2,
    text: "Platform",
    icon: "/icons/atom.svg",
    bg: "#4bcb63",
    link: "https://portofoliomi.vercel.app/",
  },

  {
    id: 3,
    text: "LinkedIn",
    icon: "/icons/linkedin.svg",
    bg: "#05b6f6",
    link: "https://www.linkedin.com/in/dharma-ayomi-ramadhani/",
  },
];

export { socials };
export type { Social };
