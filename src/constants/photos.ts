interface PhotosLink {
  id: number;
  icon: string;
  title: string;
}

const photosLinks: PhotosLink[] = [
  {
    id: 1,
    icon: "/icons/gicon1.svg",
    title: "Library",
  },
  {
    id: 2,
    icon: "/icons/gicon2.svg",
    title: "Memories",
  },
  {
    id: 3,
    icon: "/icons/file.svg",
    title: "Places",
  },
  {
    id: 4,
    icon: "/icons/gicon4.svg",
    title: "People",
  },
  {
    id: 5,
    icon: "/icons/gicon5.svg",
    title: "Favorites",
  },
];

interface GalleryImage {
  id: number;
  img: string;
  name: string;
  categoryIds: number[];
}

const gallery: GalleryImage[] = [
  // --- Category 1: Library ---
  {
    id: 1,
    img: "/images/omi.webp",
    name: "Omi",
    categoryIds: [1],
  },
  {
    id: 2,
    img: "/images/bubblify-driver-1.webp",
    name: "Bubblify App",
    categoryIds: [1],
  },
  {
    id: 3,
    img: "/images/bubblify-driver.webp",
    name: "Bubblify Driver",
    categoryIds: [1],
  },

  // --- Category 2: Memories ---
  {
    id: 4,
    img: "/images/gal2.webp",
    name: "It's A Wrap!",
    categoryIds: [2],
  },
  {
    id: 5,
    img: "/images/eventure-1.webp",
    name: "Eventure",
    categoryIds: [2],
  },
  {
    id: 6,
    img: "/images/eventure-2.webp",
    name: "Eventure Platform",
    categoryIds: [2],
  },

  // --- Category 3: Places ---
  {
    id: 7,
    img: "/images/at-purwadhika.jpeg",
    name: "At Purwadhika",
    categoryIds: [3],
  },
  {
    id: 8,
    img: "/images/custom-furniture.webp",
    name: "Custom Furniture",
    categoryIds: [3],
  },
  {
    id: 9,
    img: "/images/meatlover.webp",
    name: "Meatlover Series",
    categoryIds: [3],
  },

  // --- Category 4: People ---
  {
    id: 10,
    img: "/images/omi-1.webp",
    name: "Omi's Portrait",
    categoryIds: [4],
  },
  {
    id: 11,
    img: "/images/omi-1.webp",
    name: "omi",
    categoryIds: [4],
  },
  {
    id: 12,
    img: "/images/omi.jpeg",
    name: "Omi Casual",
    categoryIds: [4],
  },

  // --- Category 5: Favorites (macOS Wallpapers) ---
  {
    id: 13,
    img: "/images/wallpaper-1.webp",
    name: "macOS Ventura",
    categoryIds: [5],
  },
  {
    id: 14,
    img: "/images/wallpaper-2.webp",
    name: "macOS Sonoma",
    categoryIds: [5],
  },
  {
    id: 15,
    img: "/images/wallpaper-3.webp",
    name: "macOS Sequoia",
    categoryIds: [5],
  },
  {
    id: 16,
    img: "/images/wallpaper-4.webp",
    name: "macOS Big Sur",
    categoryIds: [5],
  },
  {
    id: 17,
    img: "/images/wallpaper.webp",
    name: "macOS Classic Bloom",
    categoryIds: [5],
  },
];

export { photosLinks, gallery };
export type { PhotosLink, GalleryImage };
