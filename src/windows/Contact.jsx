import { WindowControls } from "#components";
import { socials } from "#constants";
import { useWindow } from "#hooks/useWindow";

const Contact = () => {
  const { containerRef, headerRef } = useWindow("contact");

  return (
    <section ref={containerRef} id="contact" className="window">
      <div ref={headerRef} id="window-header">
        <WindowControls target="contact" />
        <h2>Contact</h2>
      </div>
      <div className="p-5 space-y-5">
        <img
          src="/images/user-icon.png"
          alt="omi"
          className="w-20 rounded-full"
        />
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
