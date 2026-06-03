import { WindowConfig } from "../types";

interface NavLink {
  id: number;
  name: string;
  type: string;
}

const navLinks: NavLink[] = [
  {
    id: 1,
    name: "Projects",
    type: "finder",
  },
  {
    id: 3,
    name: "Contact",
    type: "contact",
  },
  {
    id: 4,
    name: "Resume",
    type: "resume",
  },
];

interface NavIcon {
  id: number;
  img: string;
}

const navIcons: NavIcon[] = [
  {
    id: 1,
    img: "/icons/wifi.svg",
  },
  {
    id: 2,
    img: "/icons/search.svg",
  },
  {
    id: 3,
    img: "/icons/user.svg",
  },
  {
    id: 4,
    img: "/icons/mode.svg",
  },
];

interface DockApp {
  id: string;
  name: string;
  icon: string;
  canOpen: boolean;
}

const dockApps: DockApp[] = [
  {
    id: "finder",
    name: "Portfolio", // was "Finder"
    icon: "finder.png",
    canOpen: true,
  },
  {
    id: "safari",
    name: "Articles", // was "Safari"
    icon: "safari.png",
    canOpen: true,
  },
  {
    id: "photos",
    name: "Gallery", // was "Photos"
    icon: "photos.png",
    canOpen: true,
  },
  {
    id: "contact",
    name: "Contact", // or "Get in touch"
    icon: "contact.png",
    canOpen: true,
  },
  {
    id: "terminal",
    name: "Skills", // was "Terminal"
    icon: "terminal.png",
    canOpen: true,
  },
  {
    id: "trash",
    name: "Trash", // was "Trash"
    icon: "trash.png",
    canOpen: true,
  },
];

const INITIAL_Z_INDEX = 1000;

const WINDOW_CONFIG: WindowConfig = {
  finder: {
    isOpen: false,
    isMinimized: false,
    zIndex: INITIAL_Z_INDEX,
    data: null,
  },
  contact: {
    isOpen: false,
    isMinimized: false,
    zIndex: INITIAL_Z_INDEX,
    data: null,
  },
  resume: {
    isOpen: false,
    isMinimized: false,
    zIndex: INITIAL_Z_INDEX,
    data: null,
  },
  safari: {
    isOpen: false,
    isMinimized: false,
    zIndex: INITIAL_Z_INDEX,
    data: null,
  },
  photos: {
    isOpen: false,
    isMinimized: false,
    zIndex: INITIAL_Z_INDEX,
    data: null,
  },
  terminal: {
    isOpen: false,
    isMinimized: false,
    zIndex: INITIAL_Z_INDEX,
    data: null,
  },
  txtfile: {
    isOpen: false,
    isMinimized: false,
    zIndex: INITIAL_Z_INDEX,
    data: null,
  },
  imgfile: {
    isOpen: false,
    isMinimized: false,
    zIndex: INITIAL_Z_INDEX,
    data: null,
  },
  pdfviewerfile: {
    isOpen: false,
    isMinimized: false,
    zIndex: INITIAL_Z_INDEX,
    data: null,
  },
  videofile: {
    isOpen: false,
    isMinimized: false,
    zIndex: INITIAL_Z_INDEX,
    data: null,
  },
};

export { navLinks, navIcons, dockApps, INITIAL_Z_INDEX, WINDOW_CONFIG };
