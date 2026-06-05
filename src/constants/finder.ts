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
          name: "Laundry Web App – Bubblify.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          position: "top-5 left-10",
          subtitle: "Group Project — Team of 3 | Bootcamp | Jun–Jul 2025",
          description: [
            `A multi-role e-commerce laundry platform with real-time order tracking and role-based workflows. The system handles <span class="bg-blue-100 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 px-1.5 py-0.5 rounded font-medium">5 distinct roles</span> — customer, admin, driver, worker, and outlet — all connected through a <span class="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 px-1.5 py-0.5 rounded font-medium">single transaction flow</span>.`,
            `<strong class="font-semibold text-zinc-900 dark:text-white">What I built:</strong><br/>Attendance tracking system with daily check-in/check-out, role-specific dashboards, <span class="bg-purple-100 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 px-1.5 py-0.5 rounded font-medium">single-task enforcement logic</span> to prevent drivers from handling multiple orders simultaneously, washing/ironing/packing station workflows with input verification, admin-approved bypass mechanism for edge cases, and job history logs per user.`,
            `<strong class="font-semibold text-zinc-900 dark:text-white">Role:</strong> Full Stack Developer — Driver & Worker Management`,
            `<strong class="font-semibold text-zinc-900 dark:text-white">Tech Stack:</strong><br/><div class="flex flex-wrap gap-2 mt-1.5"><span class="px-2.5 py-0.5 text-xs font-medium rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-700/50">Next.js</span><span class="px-2.5 py-0.5 text-xs font-medium rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-700/50">Node.js</span><span class="px-2.5 py-0.5 text-xs font-medium rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-700/50">Express.js</span><span class="px-2.5 py-0.5 text-xs font-medium rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-700/50">PostgreSQL</span><span class="px-2.5 py-0.5 text-xs font-medium rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-700/50">Tailwind CSS</span></div>`,
          ],
        },
        {
          id: 2,
          name: "bubblify.png",
          icon: "/images/image.png",
          kind: "file",
          fileType: "img",
          imageUrl: "/images/bubblify-driver-1.webp",
          position: "top-10 right-20",
        },
        {
          id: 3,
          name: "final-presentation.pdf",
          icon: "/images/pdf.png",
          kind: "file",
          fileType: "pdfviewer",
          pdfUrl: "/files/bubblify.pdf",
          position: "top-60 right-50",
        },
        {
          id: 4,
          name: "bubblify.png",
          icon: "/images/image.png",
          kind: "file",
          fileType: "img",
          position: "top-52 right-90",
          imageUrl: "/images/bubblify-driver-1.webp",
        },
        {
          id: 5,
          name: "bubblify-1.png",
          icon: "/images/image.png",
          kind: "file",
          fileType: "img",
          imageUrl: "/images/bubblify-driver.webp",
          position: "top-60 right-10",
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
          name: "Event Management Platform – Eventure.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          position: "top-5 right-10",
          subtitle: "Group Project — Team of 2 | Bootcamp | Mar–Apr 2025",
          description: [
            `A full-stack event management platform with <span class="bg-blue-100 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 px-1.5 py-0.5 rounded font-medium">role-based access</span> for customers and organizers, built end-to-end with dynamic event creation, transaction flow, and a <span class="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 px-1.5 py-0.5 rounded font-medium">referral-reward system</span>.`,
            `<strong class="font-semibold text-zinc-900 dark:text-white">What I built:</strong><br/>Authentication and protected routes, event creation update transaction system, checking of proof upload, and status updates, referral system with <span class="bg-purple-100 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 px-1.5 py-0.5 rounded font-medium">reward points and coupon discounts</span> including expiration logic, organizer dashboard for event and transaction management, homepage.`,
            `<strong class="font-semibold text-zinc-900 dark:text-white">Role:</strong> Full Stack Developer — Frontend lead, shared Backend`,
            `<strong class="font-semibold text-zinc-900 dark:text-white">Tech Stack:</strong><br/><div class="flex flex-wrap gap-2 mt-1.5"><span class="px-2.5 py-0.5 text-xs font-medium rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-700/50">Next.js</span><span class="px-2.5 py-0.5 text-xs font-medium rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-700/50">Node.js</span><span class="px-2.5 py-0.5 text-xs font-medium rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-700/50">Express.js</span><span class="px-2.5 py-0.5 text-xs font-medium rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-700/50">PostgreSQL</span><span class="px-2.5 py-0.5 text-xs font-medium rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-700/50">Tailwind CSS</span></div>`,
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
          name: "3D Furniture Configurator.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          position: "top-5 left-10",
          subtitle: "Work Assignment — Solo | 2025–Present",
          description: [
            `A web-based custom furniture configurator built for a real client, inspired by <strong class="font-semibold text-zinc-900 dark:text-white">IKEA's Pax Planner</strong>. Users can customize furniture dimensions, materials, and configurations with a <span class="bg-blue-100 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 px-1.5 py-0.5 rounded font-medium">live 3D preview</span> before purchasing.`,
            `<strong class="font-semibold text-zinc-900 dark:text-white">What I built:</strong><br/>End-to-end — backend architecture, order management system, product configuration logic, and a <span class="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 px-1.5 py-0.5 rounded font-medium">4-phase payment flow</span> tied to production progress. The 3D layer is built with <span class="bg-purple-100 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 px-1.5 py-0.5 rounded font-medium">Three.js</span> and actively in development.`,
            `<strong class="font-semibold text-zinc-900 dark:text-white">Role:</strong> Full Stack Developer — handled everything from database design to frontend rendering, <em class="text-zinc-800 dark:text-zinc-200">solo, no senior guidance</em>.`,
            `<strong class="font-semibold text-zinc-900 dark:text-white">Tech Stack:</strong><br/><div class="flex flex-wrap gap-2 mt-1.5"><span class="px-2.5 py-0.5 text-xs font-medium rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-700/50">React</span><span class="px-2.5 py-0.5 text-xs font-medium rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-700/50">Three.js</span><span class="px-2.5 py-0.5 text-xs font-medium rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-700/50">Node.js</span><span class="px-2.5 py-0.5 text-xs font-medium rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-700/50">Express.js</span><span class="px-2.5 py-0.5 text-xs font-medium rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-700/50">PostgreSQL</span></div>`,
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
          id: 3,
          name: "custom.mkv",
          icon: "/images/quicktime.png",
          kind: "file",
          fileType: "video",
          position: "top-32 left-56",
          videoUrl: "/videos/custom.mkv",
          posterUrl: "/images/project-3.png",
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
          name: "Meatlovers – Web Series.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          position: "top-5 left-10",
          subtitle: "Class Assignment | Sep 2022–Jan 2023",
          description: [
            `A three-episode psychological thriller web series following a college student who lures victims through <span class="bg-blue-100 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 px-1.5 py-0.5 rounded font-medium">dating apps</span>. Built around themes of <span class="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 px-1.5 py-0.5 rounded font-medium">trauma, obsession, and moral ambiguity</span> — the horror is almost entirely <span class="bg-purple-100 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 px-1.5 py-0.5 rounded font-medium">implied rather than shown</span>.`,
            `<strong class="font-semibold text-zinc-900 dark:text-white">What I did:</strong><br/>Developed the full narrative concept and character arcs across all three episodes, wrote all scripts, conducted research for character psychology and authenticity, and handled casting — selecting actors to match characters whose impact depended entirely on how they were played.`,
            `<strong class="font-semibold text-zinc-900 dark:text-white">Role:</strong><br/><div class="flex flex-wrap gap-2 mt-1.5"><span class="px-2.5 py-0.5 text-xs font-medium rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-700/50">Scriptwriter</span><span class="px-2.5 py-0.5 text-xs font-medium rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-700/50">Casting</span></div>`,
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
      name: "at-purwadhika.png",
      icon: "/images/image.png",
      kind: "file",
      fileType: "img",
      position: "top-52 left-80",
      imageUrl: "/images/at-purwadhika.jpeg",
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
