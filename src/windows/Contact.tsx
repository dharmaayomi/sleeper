import { WindowControls } from "#components";
import { socials } from "#constants";
import { useWindow } from "#hooks/useWindow";

const Contact = () => {
  const { containerRef, headerRef } = useWindow("contact");

  return (
    <section ref={containerRef} id="contact" className="window">
      {/* Responsive Header */}
      <div
        ref={headerRef}
        id="window-header"
        className="relative flex items-center justify-between select-none"
      >
        <WindowControls target="contact" />
        <h2 className="text-black dark:text-zinc-100 font-semibold text-[15px] font-inter absolute left-1/2 -translate-x-1/2 pointer-events-none">
          Contact
        </h2>
        <div className="w-[30px]" />
      </div>
      <div className="p-5 space-y-5">
        <div className="w-20 h-20 overflow-hidden rounded-full shadow-lg">
          <img
            src="/images/omi-1.webp"
            alt="omi"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <h3 className="font-inter">Let's Connect!</h3>
        <p className="font-inter">
          Got an Idea? A Bug to solve? Or just wanna say hi? Shoot me a message!
        </p>

        <p className="text-sm font-bold font-inter">
          officialomicumi@gmail.com
        </p>

        <ul>
          {socials.map(({ id, bg, link, icon, text }) => (
            <li key={id} style={{ backgroundColor: bg }}>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                title={text}
              >
                <img src={icon} alt={text} className="size-5" />
                <p className="font-inter">{text}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Contact;
