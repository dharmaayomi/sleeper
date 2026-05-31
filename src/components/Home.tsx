import { locations } from "#constants";
import useLocationStore from "#store/Location";
import useWindowStore from "#store/Window";
import { useGSAP } from "@gsap/react";
import clsx from "clsx";
import { Draggable } from "gsap/Draggable";
import { FolderItem } from "../types";

const projects = (locations.work?.children ?? []) as FolderItem[];

const Home = () => {
  const { setActiveLocation } = useLocationStore();
  const { openWindow } = useWindowStore();

  const handleOpenProjectFinder = (project: FolderItem) => {
    setActiveLocation(project);
    openWindow("finder");
  };

  useGSAP(() => {
    Draggable.create(".folder");
  }, []);

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
