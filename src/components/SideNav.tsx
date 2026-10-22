"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { homeSections } from "@/lib/sections";

export default function SideNav() {
  const { lang } = useLanguage();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    const onScroll = () => setActive(Math.round(main.scrollTop / main.clientHeight));
    onScroll();
    main.addEventListener("scroll", onScroll);
    return () => main.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (idx: number) => {
    const main = document.querySelector("main");
    main?.scrollTo({ top: idx * main.clientHeight, behavior: "smooth" });
  };

  const dark = homeSections[active]?.dark ?? false;

  return (
    <nav
      aria-label="섹션 이동"
      className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col items-start gap-0.5"
    >
      {homeSections.map((s, i) =>
        s.nav ? (
          <button
            key={s.ko}
            onClick={() => goTo(i)}
            aria-label={lang === "ko" ? s.ko : s.en}
            aria-current={active === i}
            className="group flex items-center gap-3 py-1.5 pr-3"
          >
            <span
              className={`block rounded-full transition-all duration-200 ${
                active === i
                  ? "w-5 h-5 bg-blue-500 ring-4 ring-blue-500/30 shadow-lg shadow-blue-500/40"
                  : `w-3.5 h-3.5 border-2 ${dark ? "bg-white/50 border-white/70 group-hover:bg-white" : "bg-slate-400 border-slate-500/60 group-hover:bg-blue-500 group-hover:border-blue-600"}`
              }`}
            />
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                active === i
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
              } ${dark ? "bg-white/15 text-white backdrop-blur-sm" : "bg-slate-900/85 text-white"}`}
            >
              {lang === "ko" ? s.ko : s.en}
            </span>
          </button>
        ) : null
      )}
    </nav>
  );
}
