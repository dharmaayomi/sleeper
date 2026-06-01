import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { Navbar, Welcome, Dock, Home } from "#components";
import {
  Terminal,
  Safari,
  Resume,
  Finder,
  Text,
  Image,
  Contact,
  Photos,
} from "#windows";
import useWallpaperStore from "#store/Wallpaper";

gsap.registerPlugin(Draggable);

const App = () => {
  const wallpaper = useWallpaperStore((state) => state.wallpaper);

  return (
    <main
      style={{
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Navbar />
      <Welcome />
      <Dock />
      <Terminal />
      <Safari />
      <Resume />
      <Finder />
      <Text />
      <Image />
      <Contact />
      <Home />
      <Photos />
    </main>
  );
};

export default App;
