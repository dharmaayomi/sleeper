import { locations } from "#constants";
import useLocationStore from "#store/Location";
import useWindowStore from "#store/Window";
import { useGSAP } from "@gsap/react";
import clsx from "clsx";
import { Draggable } from "gsap/Draggable";
import useDevice from "#hooks/useDevice";
import { FolderItem } from "../types";

const projects = (locations.work?.children ?? []) as FolderItem[];

const Home = () => {
  const { setActiveLocation } = useLocationStore();
  const { openWindow } = useWindowStore();
  const { isMobile } = useDevice();

  const handleOpenProjectFinder = (project: FolderItem) => {
    setActiveLocation(project);
    openWindow("finder");
  };

  useGSAP(() => {
    if (!isMobile) {
      Draggable.create(".folder");
    }
  }, [isMobile]);

  // Mobile desktop shortcuts: Skills and Resume in a row
  if (isMobile) {
    return (
      <section
        id="home"
        className="!block absolute top-[14dvh] left-1/2 -translate-x-1/2 z-0 select-none w-full max-w-sm px-6"
      >
        <ul className="flex items-center justify-center gap-12 w-full">
          {/* Skills (Terminal) shortcut */}
          <li
            className="!relative group flex flex-col items-center cursor-pointer transition-transform active:scale-90"
            onClick={() => openWindow("terminal")}
          >
            <div className="w-20 h-20 flex items-center justify-center   ">
              <img
                src="/images/terminal.png"
                alt="Skills"
                className="w-full h-full object-contain"
              />
            </div>
          </li>

          {/* Resume shortcut */}
          <li
            className="!relative group flex flex-col items-center cursor-pointer transition-transform active:scale-90"
            onClick={() => openWindow("resume")}
          >
            <div className="w-20 h-20 flex items-center justify-center  ">
              <img
                src="/images/notes.png"
                alt="Resume"
                className="w-full h-full object-contain"
              />
            </div>
          </li>
        </ul>
      </section>
    );
  }

  // Desktop / Tablet layout
  return (
    <section id="home">
      <ul>
        {projects.map((project) => (
          <li
            key={project.id}
            className={clsx("group folder", project.windowPosition)}
            onClick={() => handleOpenProjectFinder(project as FolderItem)}
          >
            <img src="/images/folder.png" alt={project.name} />
            <p className="font-inter text-xs">{project.name}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Home;
