import { FolderItem } from "../types";

const WORK_LOCATION: FolderItem = {
  id: 1,
  type: "work",
  name: "Work",
  icon: "/icons/work.svg",
  kind: "folder",
  children: [
    // ▶ Project 1
    {
      id: 5,
      name: "Bubblify Web App",
      icon: "/images/folder.png",
      kind: "folder",
      position: "top-10 left-5", // icon position inside Finder
      windowPosition: "top-[5vh] left-5", // optional: Finder window position
      children: [
        {
          id: 1,
          name: "Bubblify Project.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          position: "top-5 left-10",
          description: [
            "Bubblify is a mobile-first e-commerce platform that allows users to request laundry pickup and delivery based on their location.",
            " It supports five user roles: customer, super admin, outlet admin, worker, and driver.",
            "I was responsible for developing operational features for workers and drivers, including task management, job history, and daily attendance tracking with integrated admin reporting.",
          ],
        },
        {
          id: 2,
          name: "bubblify.com",
          icon: "/images/safari.png",
          kind: "file",
          fileType: "url",
          href: "https://youtu.be/fZdTYswuZjU?si=Awjl-pIst9e09_UU",
          position: "top-10 right-20",
        },
        {
          id: 4,
          name: "bubblify.png",
          icon: "/images/image.png",
          kind: "file",
          fileType: "img",
          position: "top-52 right-80",
          imageUrl: "/images/project-1.png",
        },
        {
          id: 5,
          name: "Design.fig",
          icon: "/images/plain.png",
          kind: "file",
          fileType: "fig",
          href: "https://google.com",
          position: "top-60 right-20",
        },
      ],
    },

    // ▶ Project 2
    {
      id: 6,
      name: "Eventure Web App",
      icon: "/images/folder.png",
      kind: "folder",
      position: "top-52 left-60",
      windowPosition: "top-[20vh] left-5",
      children: [
        {
          id: 1,
          name: "Eventure Project.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          position: "top-5 right-10",
          description: [
            "Eventure is a web-based event management platform that allows organizers to create and promote events while enabling attendees to browse and register for them. ",
            "It supports two user roles: customer and event organizer. ",
            "I was responsible for developing core features related to user authentication, referral system, and organizer dashboard",
            " including role-based access, referral reward logic, profile management, and transaction monitoring with real-time status updates and automatic point/voucher handling.",
          ],
        },
        {
          id: 2,
          name: "eventure.com",
          icon: "/images/safari.png",
          kind: "file",
          fileType: "url",
          href: "https://youtu.be/iYOz165wGkQ?si=R1hs8Legl200m0Cl",
          position: "top-20 left-20",
        },
        {
          id: 3,
          name: "eventure-1.png",
          icon: "/images/image.png",
          kind: "file",
          fileType: "img",
          position: "top-52 left-80",
          imageUrl: "/images/eventure-2.webp",
        },
        {
          id: 4,
          name: "eventure.png",
          icon: "/images/image.png",
          kind: "file",
          fileType: "img",
          position: "top-72 left-40",
          imageUrl: "/images/eventure-1.webp",
        },
        {
          id: 5,
          name: "Design.fig",
          icon: "/images/plain.png",
          kind: "file",
          fileType: "fig",
          href: "https://google.com",
          position: "top-60 left-5",
        },
      ],
    },

    // ▶ Project 3
    {
      id: 8,
      name: "Custom Furniture Web App",
      icon: "/images/folder.png",
      kind: "folder",
      position: "top-10 left-80",
      windowPosition: "top-[35vh] left-5",
      children: [
        {
          id: 1,
          name: "Custom Furniture App Project.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          position: "top-5 left-10",
          description: [
            "Our Food Delivery App is a fast and convenient way to order meals from your favorite restaurants.",
            "Instead of making calls or waiting in line, you can browse menus, customize orders, and track deliveries in real time.",
            "Think of it like having your favorite restaurants in your pocket—ready to deliver anytime, anywhere.",
            "It’s built with React Native, so it works smoothly on both iOS and Android with a clean, modern design.",
          ],
        },
        {
          id: 2,
          name: "custom-furniture.com",
          icon: "/images/safari.png",
          kind: "file",
          fileType: "url",
          href: "https://custom-furniture-eight.vercel.app/",
          position: "top-10 right-20",
        },
        {
          id: 4,
          name: "custom-furniture.png",
          icon: "/images/image.png",
          kind: "file",
          fileType: "img",
          position: "top-52 right-80",
          imageUrl: "/images/project-3.png",
        },
        {
          id: 5,
          name: "Design.fig",
          icon: "/images/plain.png",
          kind: "file",
          fileType: "fig",
          href: "https://google.com",
          position: "top-60 right-20",
        },
      ],
    },

    // ▶ Project 4
    {
      id: 9,
      name: "Meatlover Webseries",
      icon: "/images/folder.png",
      kind: "folder",
      position: "top-52 left-0",
      windowPosition: "top-[50vh] left-5",
      children: [
        {
          id: 1,
          name: "Meatlover Webseries Project.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          position: "top-5 left-10",
          description: [
            "Meatlover Webseries is an interactive video streaming and community platform dedicated to meat enthusiasts, featuring recipe webseries, culinary masterclasses, and cooking tutorials.",
            "Developed the fully responsive video streaming portal, optimized video delivery, and integrated interactive comment sections and live forums for viewers.",
            "Designed the database schema, user subscription flows, and built a custom admin dashboard for content creators to manage video uploads, analytics, and community moderation.",
          ],
        },
        {
          id: 2,
          name: "meatlover-webseries.com",
          icon: "/images/safari.png",
          kind: "file",
          fileType: "url",
          href: "https://www.youtube.com/playlist?list=PLJUXa3eR-4GbOXUQD7iE-r4D4Q--jMx7Z",
          position: "top-10 right-20",
        },

        {
          id: 4,
          name: "meatlover.png",
          icon: "/images/image.png",
          kind: "file",
          fileType: "img",
          position: "top-52 right-80",
          imageUrl: "/images/project-4.png",
        },
        {
          id: 5,
          name: "Script.celtx",
          icon: "/images/pdf.png",
          kind: "file",
          fileType: "pdfviewer",
          position: "top-60 right-20",
        },
      ],
    },
  ],
};

const ABOUT_LOCATION: FolderItem = {
  id: 2,
  type: "about",
  name: "About me",
  icon: "/icons/info.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "me.png",
      icon: "/images/image.png",
      kind: "file",
      fileType: "img",
      position: "top-10 left-5",
      imageUrl: "/images/omi-1.webp",
    },
    {
      id: 2,
      name: "casual-me.png",
      icon: "/images/image.png",
      kind: "file",
      fileType: "img",
      position: "top-28 right-72",
      imageUrl: "/images/omi.jpeg",
    },
    {
      id: 3,
      name: "conference-me.png",
      icon: "/images/image.png",
      kind: "file",
      fileType: "img",
      position: "top-52 left-80",
      imageUrl: "/images/adrian-3.jpeg",
    },
    {
      id: 4,
      name: "about-me.txt",
      icon: "/images/txt.png",
      kind: "file",
      fileType: "txt",
      position: "top-60 left-5",
      subtitle: "Meet the Developer Behind the Code",
      image: "/images/omi-1.webp",
      description: [
        "Hey! I’m omi 👋, a web developer who enjoys building sleek, interactive websites that actually work well.",
        "Full-Stack Web Developer with hands-on experience building scalable web applications using React, Node.js, and modern frameworks. ",
        "Combines technical expertise with strong design background to deliver user-centric solutions through collaborative development approaches. Eager to grow as a developer while bringing a strong sense of design and detail to every project.",
      ],
    },
  ],
};

const RESUME_LOCATION: FolderItem = {
  id: 3,
  type: "resume",
  name: "Resume",
  icon: "/icons/file.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "Resume.pdf",
      icon: "/images/pdf.png",
      kind: "file",
      fileType: "pdf",
      // you can add `href` if you want to open a hosted resume
      // href: "/your/resume/path.pdf",
    },
  ],
};

const TRASH_LOCATION: FolderItem = {
  id: 4,
  type: "trash",
  name: "Trash",
  icon: "/icons/trash.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "trash1.png",
      icon: "/images/image.png",
      kind: "file",
      fileType: "img",
      position: "top-10 left-10",
      imageUrl: "/images/trash-1.png",
    },
    {
      id: 2,
      name: "trash2.png",
      icon: "/images/image.png",
      kind: "file",
      fileType: "img",
      position: "top-40 left-80",
      imageUrl: "/images/trash-2.png",
    },
  ],
};

const locations = {
  work: WORK_LOCATION,
  about: ABOUT_LOCATION,
  resume: RESUME_LOCATION,
  trash: TRASH_LOCATION,
};

export {
  WORK_LOCATION,
  ABOUT_LOCATION,
  RESUME_LOCATION,
  TRASH_LOCATION,
  locations,
};
