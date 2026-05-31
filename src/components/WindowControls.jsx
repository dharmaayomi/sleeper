import useWindowStore from "#store/Window";

const WindowControls = ({ target }) => {
  const { closeWindow, minimizeWindow, maximizeWindow, windows } =
    useWindowStore();

  // Ambil status maximize dari window terkait menggunakan prop target (windowKey)
  const isMaximized = windows[target]?.isMaximized ?? false;

  return (
    <div id="window-controls">
      <div className="close" onClick={() => closeWindow(target)} />
      <div
        className={`minimize ${isMaximized ? "opacity-30 pointer-events-none cursor-not-allowed bg-gray-400" : ""}`}
        onClick={() => !isMaximized && minimizeWindow(target)}
      />
      <div className="maximize" onClick={() => maximizeWindow(target)} />
    </div>
  );
};

export default WindowControls;
