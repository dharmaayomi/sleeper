import { WindowControls } from "#components";
import { techStack } from "#constants";
import { useWindow } from "#hooks/useWindow";
import { Check, Flag } from "lucide-react";
import useDevice from "#hooks/useDevice";

const Terminal = () => {
  const { containerRef, headerRef } = useWindow("terminal");
  const { isMobile } = useDevice();

  return (
    <section ref={containerRef} id="terminal" className="window">
      {/* Responsive Header */}
      <div
        ref={headerRef}
        id="window-header"
        className="relative flex items-center justify-between "
      >
        <WindowControls target="terminal" />
        <h2 className="text-black font-semibold text-[16px] font-inter absolute left-1/2 pointer-events-none -translate-x-1/2">
          Skills
        </h2>
        <div className="w-[30px]" />
      </div>

      {/* Retro Terminal Content */}
      <div className="techstack h-[calc(100%-2.75rem)] overflow-y-auto p-5 pb-12">
        <p className="font-roboto-mono text-sm">
          <span className="font-bold text-[#00A154]">@omi % </span>show tech
          stack
        </p>

        {!isMobile && (
          <div className="label">
            <p className="w-32 font-bold text-gray-500">Category</p>
            <p className="font-bold text-gray-500">Technologies</p>
          </div>
        )}

        <ul className={`content ${isMobile ? "!my-3 !py-3 space-y-4" : ""}`}>
          {techStack.map(({ category, items }) => (
            <li
              key={category}
              className={`flex ${isMobile ? "flex-col items-start gap-2 border-b border-gray-100 pb-3" : "items-center"}`}
            >
              <div className="flex items-center gap-1.5">
                <Check className="check text-[#00A154]" size={16} />
                <h3
                  className={`font-semibold text-[#00A154] font-roboto-mono text-xs md:text-sm ${isMobile ? "!ms-1 !w-auto" : "w-32 ms-5"}`}
                >
                  {category}
                </h3>
              </div>
              <ul
                className={`flex flex-wrap items-center gap-2 ${isMobile ? "ps-5 text-[11px]" : "text-sm"}`}
              >
                {items.map((item, index) => (
                  <li
                    key={item}
                    className={
                      isMobile
                        ? "bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded text-[10px] text-gray-700 font-roboto-mono font-medium"
                        : ""
                    }
                  >
                    {item}
                    {!isMobile && index < items.length - 1 ? ", " : ""}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <div className="footnote font-roboto-mono text-xs md:text-sm space-y-1">
          <p className="flex items-center gap-1.5">
            <Check size={16} className="text-[#00A154]" />
            <span>5 of 5 stacks loaded successfully (100%)</span>
          </p>
          <p className="text-gray-500 flex items-center gap-1.5">
            <Flag size={13} fill="currentColor" />
            <span>Render time: 6 ms</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Terminal;
