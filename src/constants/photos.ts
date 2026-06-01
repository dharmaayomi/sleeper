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
  // --- Library & Places ---
  {
    id: 1,
    img: "/images/gal1.png",
    name: "Cool Lake",
    categoryIds: [1, 3],
  },
  {
    id: 2,
    img: "/images/gal2.png",
    name: "Madagascar",
    categoryIds: [1, 3],
  },
  {
    id: 3,
    img: "/images/gal3.png",
    name: "Death Valley",
    categoryIds: [1, 3],
  },
  {
    id: 4,
    img: "/images/gal4.png",
    name: "Flowers",
    categoryIds: [1],
  },

  // --- Memories & People ---
  {
    id: 5,
    img: "/images/adrian.jpg",
    name: "Adrian Portrait",
    categoryIds: [2, 4],
  },
  {
    id: 6,
    img: "/images/adrian-2.jpg",
    name: "Adrian Hiking",
    categoryIds: [2],
  },
  {
    id: 7,
    img: "/images/adrian-3.jpeg",
    name: "Adrian Scenic",
    categoryIds: [2],
  },
  {
    id: 8,
    img: "/images/omi.jpeg",
    name: "Omi's Portrait",
    categoryIds: [2, 4],
  },

  // --- Favorites (macOS Wallpapers) ---
  {
    id: 9,
    img: "/images/wallpaper-1.webp",
    name: "macOS Ventura",
    categoryIds: [5],
  },
  {
    id: 10,
    img: "/images/wallpaper-2.webp",
    name: "macOS Sonoma",
    categoryIds: [5],
  },
  {
    id: 11,
    img: "/images/wallpaper-3.webp",
    name: "macOS Sequoia",
    categoryIds: [5],
  },
  {
    id: 12,
    img: "/images/wallpaper-4.webp",
    name: "macOS Big Sur",
    categoryIds: [5],
  },
  {
    id: 13,
    img: "/images/wallpaper.webp",
    name: "macOS Classic Bloom",
    categoryIds: [5],
  },
];

export { photosLinks, gallery };
export type { PhotosLink, GalleryImage };
