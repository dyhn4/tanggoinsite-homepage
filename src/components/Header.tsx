"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronDown, Menu, X,
  GitBranch, PenLine, ScanSearch, Braces, Layers, BrainCircuit,
  Building2, Clock, Wrench, FileText, MessageCircle, HelpCircle,
  Zap, Languages,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

type NavSubItem = {
  label: string;
  href: string;
  sub?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  color?: string;
  badge?: string;
  disabled?: boolean;
};

type NavItem = {
  label: string;
  items: NavSubItem[];
};

// 각 값은 src/app/page.tsx <section> 순서의 인덱스. 섹션을 추가/삭제하면 이 배열도 맞춰서 갱신해야 함.
const darkIndexes = [0, 1, 8, 10];

export default function Header() {
  const { lang, setLang } = useLanguage();
  const t = translations[lang].nav;

  const navItems: NavItem[] = [
    {
      label: t.companyLabel,
      items: [
        { label: t.companyOverview, href: "/company",  icon: Building2, color: "from-blue-600 to-sky-400" },
        { label: t.companyHistory,  href: "/history",  icon: Clock,      color: "from-indigo-600 to-blue-400" },
      ],
    },
    {
      label: t.servicesLabel,
      items: [
        { label: t.servicesGuide,  href: "/services", icon: FileText, color: "from-sky-600 to-cyan-400" },
        { label: t.servicesApply,  href: "/apply",    icon: Wrench,   color: "from-blue-600 to-violet-500" },
      ],
    },
    {
      label: t.solutionsLabel,
      items: [
        { label: "Tango Workflow",   href: "/solutions#tango-workflow",   sub: lang === "ko" ? "통합 워크플로우"    : "Integrated Workflow",    icon: GitBranch,    color: "from-blue-700 to-sky-400" },
        { label: "MooN Editor",      href: "/solutions#moon-editor",      sub: lang === "ko" ? "문서 교정·편집"     : "Document Editing",       icon: PenLine,      color: "from-violet-600 to-blue-500" },
        { label: "MooN AI OCR",      href: "/solutions#moon-ai-ocr",      sub: lang === "ko" ? "AI 문자 인식"       : "AI Text Recognition",    icon: ScanSearch,   color: "from-sky-600 to-cyan-400" },
        { label: "Tango XML(JSON)",  href: "/solutions#tango-xml",        sub: lang === "ko" ? "구조화 변환"        : "Structured Conversion",  icon: Braces,       color: "from-emerald-600 to-teal-400" },
        { label: "Tango Batch",      href: "/solutions#tango-batch",      sub: lang === "ko" ? "대량 일괄 처리"     : "Bulk Processing",        icon: Layers,       color: "from-orange-500 to-amber-400" },
        { label: "Tango PDF",        href: "/solutions#tango-pdf",        sub: lang === "ko" ? "TOC 구조화 PDF"    : "Structured PDF",         icon: FileText,     color: "from-rose-600 to-pink-400" },
        { label: "MooN AI Explorer", href: "/solutions#moon-ai-explorer", sub: lang === "ko" ? "AI 탐색·번역"       : "AI Exploration",         icon: BrainCircuit, color: "from-indigo-600 to-blue-400" },
      ],
    },
    {
      label: t.supportLabel,
      items: [
        { label: t.contactUs, href: "/contact", icon: MessageCircle, color: "from-blue-600 to-sky-400" },
        { label: t.faq,       href: "/faq",     icon: HelpCircle,    color: "from-violet-600 to-blue-500" },
      ],
    },
    {
      label: t.demoLabel,
      items: [
        { label: t.demoOcr,       href: "https://ai.tangoinsight.kr", sub: t.demoOcrSub,       icon: Zap,       color: "from-cyan-500 to-blue-500" },
        { label: t.demoTranslate, href: "/demo/translate",  sub: t.demoTranslateSub, icon: Languages, color: "from-violet-500 to-purple-400", badge: t.demoBadge, disabled: true },
      ],
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    const handleScroll = () => {
      const idx = Math.round(main.scrollTop / main.clientHeight);
      setIsDark(darkIndexes.includes(idx));
    };
    main.addEventListener("scroll", handleScroll);
    return () => main.removeEventListener("scroll", handleScroll);
  }, []);

  const router = useRouter();

  const openMenu = (label: string) => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setActiveMenu(label);
  };
  const scheduleClose = () => {
    closeTimeout.current = setTimeout(() => setActiveMenu(null), 120);
  };
  const cancelClose = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
  };

  const handleNavClick = (href: string) => {
    setActiveMenu(null);
    setIsOpen(false);
    setOpenMobileMenu(null);
    if (href.startsWith("/")) {
      router.push(href);
      return;
    }
    const main = document.querySelector("main");
    const target = document.querySelector(href);
    if (main && target) {
      const windowH = main.clientHeight;
      const sections = Array.from(main.querySelectorAll("section"));
      const idx = sections.indexOf(target.closest("section") as HTMLElement);
      if (idx !== -1) main.scrollTo({ top: idx * windowH, behavior: "smooth" });
    }
  };

  const textColor = isDark
    ? "text-white/90 hover:text-sky-300"
    : "text-slate-700 hover:text-blue-700";
  const logoColor = isDark ? "text-white" : "text-slate-900";
  const bgStyle = isDark
    ? "bg-transparent"
    : "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100";
  const mobileIconColor = isDark
    ? "text-white hover:bg-white/10"
    : "text-slate-700 hover:bg-slate-100";

  const activeItem = navItems.find((i) => i.label === activeMenu);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bgStyle}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* 로고 */}
          <a
            href="#"
            onClick={() => document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center"
          >
            <span
              className={`text-xl font-black tracking-tight transition-colors select-none ${logoColor}`}
              style={{ fontFamily: "'Sora', 'Pretendard', sans-serif", letterSpacing: "-0.02em" }}
            >
              <span className={`bg-gradient-to-r ${isDark ? "from-blue-400 to-sky-300" : "from-blue-600 to-sky-500"} bg-clip-text text-transparent`}>
                Tango
              </span>
              <span className={isDark ? "text-white" : "text-slate-900"}>Insight</span>
            </span>
          </a>

          {/* 데스크탑 네비 */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <div
                key={item.label}
                onMouseEnter={() => openMenu(item.label)}
                onMouseLeave={scheduleClose}
              >
                <button
                  className={`inline-flex items-center gap-1 text-sm font-medium transition-colors ${textColor}`}
                >
                  {item.label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${activeMenu === item.label ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            ))}

            {/* KO / EN 토글 */}
            <div className={`flex items-center rounded-full border text-xs font-bold overflow-hidden ${isDark ? "border-white/20" : "border-slate-200"}`}>
              <button
                onClick={() => setLang("ko")}
                className={`px-3 py-1.5 transition-colors ${
                  lang === "ko"
                    ? "bg-blue-600 text-white"
                    : isDark ? "text-white/50 hover:text-white/80" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                KO
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1.5 transition-colors ${
                  lang === "en"
                    ? "bg-blue-600 text-white"
                    : isDark ? "text-white/50 hover:text-white/80" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                EN
              </button>
            </div>

            <Link
              href="/contact"
              className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium transition-colors"
            >
              {t.freeConsult}
            </Link>
          </nav>

          {/* 모바일 햄버거 */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${mobileIconColor}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="메뉴"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── 전체 너비 메가 패널 (데스크탑) ── */}
      <div
        className={`hidden md:block absolute left-0 right-1.5 top-full transition-all duration-200 ${
          activeItem
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-1 pointer-events-none"
        }`}
        style={{ background: "rgba(10,18,40,0.97)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      >
        <div className="max-w-6xl mx-auto px-6 py-5">
          {activeItem && (
            <>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-4 text-right">
                {activeItem.label}
              </p>
              <div className={`flex flex-wrap gap-x-2 gap-y-2 justify-end ${activeItem.items.length >= 5 ? "max-w-5xl" : ""}`}>
                {activeItem.items.map((sub) => {
                  const Icon = sub.icon;
                  const inner = (
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group/item min-w-[200px] ${sub.disabled ? "cursor-not-allowed opacity-60" : "hover:bg-white/8 cursor-pointer"}`}>
                      {Icon && (
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br ${sub.color} flex items-center justify-center`}>
                          <Icon size={14} className="text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-semibold leading-tight whitespace-nowrap ${sub.disabled ? "text-white/60" : "text-white/90 group-hover/item:text-sky-300 transition-colors"}`}>
                            {sub.label}
                          </p>
                          {sub.badge && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 leading-none whitespace-nowrap">
                              {sub.badge}
                            </span>
                          )}
                        </div>
                        {sub.sub && (
                          <p className="text-[11px] text-white/40 leading-tight mt-0.5 whitespace-nowrap">
                            {sub.sub}
                          </p>
                        )}
                      </div>
                    </div>
                  );

                  if (sub.disabled) {
                    return <div key={sub.label}>{inner}</div>;
                  }
                  if (sub.href.startsWith("http")) {
                    return (
                      <a key={sub.label} href={sub.href} target="_blank" rel="noopener noreferrer" onClick={() => setActiveMenu(null)}>
                        {inner}
                      </a>
                    );
                  }
                  return sub.href.startsWith("/") ? (
                    <Link key={sub.label} href={sub.href} onClick={() => setActiveMenu(null)}>
                      {inner}
                    </Link>
                  ) : (
                    <button key={sub.label} onClick={() => handleNavClick(sub.href)} className="block text-left">
                      {inner}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
          <nav className="flex flex-col px-4 py-4 gap-2">
            {navItems.map((item) => (
              <div key={item.label}>
                <button
                  onClick={() => setOpenMobileMenu(openMobileMenu === item.label ? null : item.label)}
                  className="flex items-center justify-between w-full px-3 py-3 text-slate-700 font-medium rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  {item.label}
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${openMobileMenu === item.label ? "rotate-180" : ""}`}
                  />
                </button>

                {openMobileMenu === item.label && (
                  <div className="ml-3 mt-1 border-l border-blue-100 pl-3">
                    {item.items.map((subItem) => {
                      const Icon = subItem.icon;
                      const mobileInner = (
                        <div className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm">
                          {Icon && (
                            <div className={`flex-shrink-0 w-5 h-5 rounded-md bg-gradient-to-br ${subItem.color} flex items-center justify-center`}>
                              <Icon size={10} className="text-white" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5">
                              <p className="font-medium leading-tight">{subItem.label}</p>
                              {subItem.badge && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-600 border border-amber-200 leading-none">
                                  {subItem.badge}
                                </span>
                              )}
                            </div>
                            {subItem.sub && <p className="text-xs text-slate-400">{subItem.sub}</p>}
                          </div>
                        </div>
                      );

                      if (subItem.disabled) {
                        return <div key={subItem.label} className="opacity-60 cursor-not-allowed text-slate-400 rounded-lg">{mobileInner}</div>;
                      }
                      if (subItem.href.startsWith("http")) {
                        return (
                          <a
                            key={subItem.label}
                            href={subItem.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => { setIsOpen(false); setOpenMobileMenu(null); }}
                            className="text-slate-600 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors block"
                          >
                            {mobileInner}
                          </a>
                        );
                      }
                      return subItem.href.startsWith("/") ? (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          onClick={() => { setIsOpen(false); setOpenMobileMenu(null); }}
                          className="text-slate-600 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors block"
                        >
                          {mobileInner}
                        </Link>
                      ) : (
                        <button
                          key={subItem.label}
                          onClick={() => handleNavClick(subItem.href)}
                          className="text-slate-600 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        >
                          {mobileInner}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {/* 모바일 언어 토글 */}
            <div className="flex items-center gap-2 px-3 py-2">
              <span className="text-xs text-slate-400 font-medium">Language:</span>
              <div className="flex items-center rounded-full border border-slate-200 text-xs font-bold overflow-hidden">
                <button
                  onClick={() => setLang("ko")}
                  className={`px-3 py-1.5 transition-colors ${lang === "ko" ? "bg-blue-600 text-white" : "text-slate-400"}`}
                >KO</button>
                <button
                  onClick={() => setLang("en")}
                  className={`px-3 py-1.5 transition-colors ${lang === "en" ? "bg-blue-600 text-white" : "text-slate-400"}`}
                >EN</button>
              </div>
            </div>

            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="mt-2 px-4 py-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-medium transition-colors text-center block"
            >
              {t.freeConsult}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
