import { navIcons, navLinks } from "#constants";
import React from "react";
import dayjs from "dayjs";
import useWindowStore from "#store/Window";

const Navbar = () => {
  const { openWindow } = useWindowStore();

  return (
    <nav>
      <div>
        <img src="/images/logo.svg" />
        <p className="font-bold">Omi's Portfolio</p>

        <ul>
          {navLinks.map(({ id, name, type }) => (
            <li key={id} onClick={() => openWindow(type)}>
              <p>{name}</p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <ul>
          {navIcons.map(({ id, img }) => (
            <li key={id}>
              <img src={img} className="icon-hover" alt={`${id}`} />
            </li>
          ))}
        </ul>

        <time>{dayjs().format("ddd MMM D h:mm A")}</time>
      </div>
    </nav>
  );
};

export default Navbar;
