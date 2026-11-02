"use client";

import { useEffect, useRef } from "react";
import Header from "@/components/Header";
import SideNav from "@/components/SideNav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import DocumentHandling from "@/components/DocumentHandling";
import Technology from "@/components/Technology";
import ModelCompare from "@/components/ModelCompare";
import Security from "@/components/Security";
import Process from "@/components/Process";
import Achievement from "@/components/Achievement";
import CaseStudy from "@/components/CaseStudy";
import Cases from "@/components/Cases";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { stepScroll } from "@/lib/snapScroll";

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    let isScrolling = false;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isScrolling) return;

      isScrolling = true;

      stepScroll(el, e.deltaY > 0 ? 1 : -1);

      // 스크롤 쿨다운 (애니메이션 완료 후 해제)
      setTimeout(() => {
        isScrolling = false;
      }, 800);
    };

    // 모바일 터치 스냅 스크롤
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling) return;
      const dy = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 50) return; // 50px 미만 스와이프는 무시

      isScrolling = true;
      stepScroll(el, dy > 0 ? 1 : -1);
      setTimeout(() => { isScrolling = false; }, 800);
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <>
      <Header />
      <SideNav />

      <main
        ref={mainRef}
        className="h-screen overflow-y-auto scroll-smooth"
        style={{ scrollSnapType: "none" }}
      >
        <section className="min-h-screen">
          <Hero />
        </section>

        <section className="min-h-screen">
          <Achievement />
        </section>

        <section className="min-h-screen">
          <CaseStudy />
        </section>

        <section className="min-h-screen">
          <Cases />
        </section>

        <section className="min-h-screen">
          <About />
        </section>

        <section className="min-h-screen">
          <Services />
        </section>

        <section className="min-h-screen">
          <DocumentHandling />
        </section>

        <section className="min-h-screen">
          <Technology />
        </section>

        <section className="min-h-screen">
          <ModelCompare />
        </section>

        <section className="min-h-screen">
          <Security />
        </section>

        <section className="min-h-screen">
          <Process />
        </section>

        <section className="min-h-screen">
          <Testimonials />
        </section>

        <section>
          <Footer />
        </section>
      </main>
    </>
  );
}
