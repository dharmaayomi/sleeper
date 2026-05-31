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
}

const gallery: GalleryImage[] = [
  {
    id: 1,
    img: "/images/gal1.png",
    name: "Cool Lake",
  },
  {
    id: 2,
    img: "/images/gal2.png",
    name: "Madagascar",
  },
  {
    id: 3,
    img: "/images/gal3.png",
    name: "Death Valley",
  },
  {
    id: 4,
    img: "/images/gal4.png",
    name: "Flowers",
  },
];

export { photosLinks, gallery };
export type { PhotosLink, GalleryImage };
