"use client";

import { useEffect, useRef } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import DocumentHandling from "@/components/DocumentHandling";
import Technology from "@/components/Technology";
import Process from "@/components/Process";
import Achievement from "@/components/Achievement";
import CaseStudy from "@/components/CaseStudy";
import Cases from "@/components/Cases";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

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

      const sections = Array.from(el.querySelectorAll("section"));
      const currentScroll = el.scrollTop;
      const windowH = el.clientHeight;

      // 현재 보이는 섹션 인덱스 계산
      const currentIndex = Math.round(currentScroll / windowH);
      const nextIndex =
        e.deltaY > 0
          ? Math.min(currentIndex + 1, sections.length - 1)
          : Math.max(currentIndex - 1, 0);

      el.scrollTo({
        top: nextIndex * windowH,
        behavior: "smooth",
      });

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
      const sections = Array.from(el.querySelectorAll("section"));
      const currentIndex = Math.round(el.scrollTop / el.clientHeight);
      const nextIndex =
        dy > 0
          ? Math.min(currentIndex + 1, sections.length - 1)
          : Math.max(currentIndex - 1, 0);

      el.scrollTo({ top: nextIndex * el.clientHeight, behavior: "smooth" });
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
