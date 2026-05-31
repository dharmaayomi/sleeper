export interface FileItem {
  id: number;
  name: string;
  icon: string;
  kind: "file";
  fileType: string;
  position?: string;
  imageUrl?: string;
  image?: string;
  href?: string;
  subtitle?: string;
  description?: string[];
}

export interface FolderItem {
  id: number;
  name: string;
  icon: string;
  kind: "folder";
  type?: string;
  position?: string;
  windowPosition?: string;
  children: (FileItem | FolderItem)[];
}

export type LocationItem = FolderItem;

export interface WindowState {
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized?: boolean;
  zIndex: number;
  data: any;
}

export interface WindowConfig {
  [key: string]: WindowState;
}
