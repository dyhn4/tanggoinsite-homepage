"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Cpu, Gift, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

const featureIcons = [Sparkles, BookOpen, Cpu];

export default function Hero() {
  const { lang } = useLanguage();
  const t = translations[lang].hero;

  const scrollToServices = () => {
    const mainEl = document.querySelector("main");
    const target = document.querySelector("#services");
    if (!mainEl || !target) return;
    const sections = Array.from(mainEl.querySelectorAll(":scope > section"));
    const idx = sections.findIndex((s) => s.contains(target));
    if (idx !== -1) {
      mainEl.scrollTo({ top: idx * mainEl.clientHeight, behavior: "smooth" });
    }
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = 120;
    type Particle = {
      x: number; y: number;
      vx: number; vy: number;
      r: number; opacity: number;
    };

    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height * 0.4 + Math.random() * canvas.height * 0.6,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 1,
      opacity: Math.random() * 0.6 + 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.35;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 179, 237, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 210, 250, ${p.opacity})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < canvas.height * 0.35 || p.y > canvas.height) p.vy *= -1;
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-slate-900 via-slate-900/80 to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 pt-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-[fadeUp_0.9s_ease-out_both]">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-semibold mb-6 backdrop-blur-sm">
              <Sparkles size={16} className="text-sky-400" />
              {t.badge}
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-6 tracking-tight">
              {t.title[0]}
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-300 bg-clip-text text-transparent">
                {t.title[1]}
              </span>
              <br />
              {t.title[2]}
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed mb-10 max-w-xl">
              {t.desc}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-200 shadow-xl shadow-blue-900/40 hover:-translate-y-0.5"
              >
                {t.cta1}
                <ArrowRight size={18} />
              </Link>

              <button
                onClick={scrollToServices}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold transition-all duration-200 backdrop-blur-md"
              >
                {t.cta2}
              </button>
            </div>

            <Link
              href="/apply"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-sky-300 hover:text-sky-200 transition-colors"
            >
              <Gift size={16} />
              {translations[lang].cta.sampleLink}
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="hidden lg:block">
            <div className="relative animate-[float_4s_ease-in-out_infinite]">
              <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-r from-blue-500/25 via-sky-400/20 to-cyan-400/20 blur-2xl animate-pulse" />

              <div className="relative bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-6 shadow-2xl shadow-blue-950/40">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-3 h-3 rounded-full bg-blue-400" />
                  <div className="w-3 h-3 rounded-full bg-sky-400" />
                  <div className="w-3 h-3 rounded-full bg-cyan-400" />
                  <span className="text-slate-400 text-xs ml-2 font-mono">
                    heritage-ai.scan / live
                  </span>
                </div>

                <div className="space-y-3 mb-5">
                  {[
                    ["w-16", "w-32", "w-20"],
                    ["w-24", "w-28", "w-16"],
                    ["w-20", "w-36", "w-12"],
                    ["w-28", "w-20", "w-24"],
                  ].map((row, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      {row.map((width, i) => (
                        <div
                          key={i}
                          className={`${width} h-3 rounded-full bg-blue-300/25 animate-pulse`}
                          style={{ animationDelay: `${index * 0.25 + i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                <div className="relative h-56 rounded-2xl overflow-hidden border border-white/10 bg-slate-950/45">
                  <div className="absolute inset-0 p-5 text-slate-300/80 leading-8 text-lg">
                    訓民正音 國之語音 異乎中國
                    <br />
                    與文字不相流通 故愚民有所欲言
                    <br />
                    而終不得伸其情者多矣
                    <br />
                    予爲此憫然 新制二十八字
                  </div>

                  <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-sky-400/25 to-transparent animate-[scan_2.4s_ease-in-out_infinite]" />

                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 border border-white rounded-2xl p-4 shadow-lg backdrop-blur-md">
                    <div className="text-blue-700 text-xs font-bold mb-1">
                      {t.ocrLabel}
                    </div>
                    <div className="text-slate-900 text-sm font-semibold">
                      {t.ocrResult}
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-blue-900/40">
                {t.liveTag}
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white/95 text-slate-800 text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                {t.heritageTag}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {t.features.map((item, i) => {
            const Icon = featureIcons[i];
            return (
              <div
                key={item.tag}
                className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-blue-400/30 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-500/30 flex items-center justify-center">
                  <Icon size={22} className="text-sky-400" />
                </div>
                <div>
                  <div className="text-lg font-black text-white tracking-tight">
                    {item.tag}
                  </div>
                  <div className="text-sm text-slate-200 font-semibold leading-snug">
                    {item.label}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
        @keyframes scan {
          0% { transform: translateY(-80px); }
          50% { transform: translateY(240px); }
          100% { transform: translateY(-80px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
