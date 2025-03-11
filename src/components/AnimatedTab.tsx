"use client"; // @NOTE: Add in case you are using Next.js

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const TABS = [
  { label: "Home", href: "/" },
  { label: "Controles", href: "/controles" },
  { label: "Cadastros", href: "/cadastros" },
  { label: "Ponto", href: "/ponto" },
];

export function AnimatedTabs() {
  const [activeTab, setActiveTab] = useState(TABS[0].label);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (container && activeTab) {
      const activeTabElement = activeTabRef.current;

      if (activeTabElement) {
        const { offsetLeft, offsetWidth } = activeTabElement;

        const clipLeft = offsetLeft;
        const clipRight = offsetLeft + offsetWidth;

        container.style.clipPath = `inset(0 ${Number(100 - (clipRight / container.offsetWidth) * 100).toFixed()}% 0 ${Number((clipLeft / container.offsetWidth) * 100).toFixed()}% round 17px)`;
      }
    }
  }, [activeTab, activeTabRef, containerRef]);

  const handleTabClick = (label: string) => {
    setActiveTab(label);
  };

  return (
    <div className="relative mx-auto flex w-fit flex-col items-center rounded-full mt-5">
      <div
        ref={containerRef}
        className="absolute z-10 w-full overflow-hidden [clip-path:inset(0px_75%_0px_0%_round_17px)] [transition:clip-path_0.25s_ease]"
      >
        <div className="relative flex w-full justify-center bg-black dark:bg-white">
          {TABS.map((tab, index) => (
            <Link key={index} href={tab.href}>
              <div
                onClick={() => handleTabClick(tab.label)}
                className="flex h-8 items-center rounded-full p-3 text-sm font-bold text-white dark:text-black"
                tabIndex={-1}
              >
                {tab.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="relative flex w-full justify-center">
        {TABS.map(({ label, href }, index) => {
          const isActive = activeTab === label;

          return (
            <Link key={index} href={href}>
              <div
                ref={isActive ? activeTabRef : null}
                onClick={() => handleTabClick(label)}
                className="flex h-8 items-center rounded-full p-3 text-sm font-bold text-neutral-500 dark:text-neutral-300"
              >
                {label}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}