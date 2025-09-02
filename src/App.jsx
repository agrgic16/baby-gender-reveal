import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const PINKS = ["#fecdd3", "#fda4af", "#fb7185", "#f472b6", "#fbcfe8"]; // soft → vibrant

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function useInterval(callback, delay) {
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay == null) return;
    const id = setInterval(() => savedCallback.current?.(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

function Balloon({ leftPct, size, duration, delay, color }) {
  const style = {
    left: `${leftPct}%`,
    width: size,
    height: size * 1.25,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.85), ${color})`,
  };
  return (
    <div className="absolute bottom-[-20%] pointer-events-none" style={{ left: style.left }} aria-hidden>
      <div
        className="relative rounded-full shadow-md balloon"
        style={{
          width: style.width,
          height: style.height,
          animationDuration: style.animationDuration,
          animationDelay: style.animationDelay,
          background: style.background,
        }}
      >
        <div
          className="absolute left-1/2 -bottom-[6px] -translate-x-1/2 w-2 h-2 rounded-[2px]"
          style={{ backgroundColor: color }}
        />
      </div>
      <div
        className="mx-auto w-[2px] h-16 opacity-70"
        style={{ background: `linear-gradient(${color}, transparent)` }}
      />
    </div>
  );
}

export default function GenderRevealApp() {
  const [phase, setPhase] = useState("idle");
  const [label, setLabel] = useState("Ready?");
  const [flashMs, setFlashMs] = useState(120);
  const [flashes, setFlashes] = useState(0);
  const flipRef = useRef(0);

  const balloons = useMemo(() => {
    if (phase !== "revealed") return [];
    return Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      leftPct: randomBetween(2, 98),
      size: randomBetween(36, 88),
      duration: randomBetween(8, 14),
      delay: randomBetween(0, 6),
      color: pick(PINKS),
    }));
  }, [phase]);

  useInterval(
    () => {
      flipRef.current = flipRef.current ^ 1;
      setLabel(flipRef.current ? "GIRL" : "BOY");
      setFlashes((c) => c + 1);
    },
    phase === "flashing" ? flashMs : null
  );

  useEffect(() => {
    if (phase !== "flashing") return;
    const totalFlashes = Math.floor(randomBetween(16, 28));
    const stopAt = setTimeout(() => {
      setPhase("revealed");
      setLabel("GIRL");
      setFlashes(0);
    }, totalFlashes * flashMs);
    return () => clearTimeout(stopAt);
  }, [phase, flashMs]);

  const startReveal = () => {
    flipRef.current = 0;
    setPhase("flashing");
    setLabel("BOY");
    setFlashes(0);
  };

  const reset = () => {
    setPhase("idle");
    setLabel("Ready?");
    setFlashes(0);
  };

  const isRevealed = phase === "revealed";

  return (
    <div
      className={[
        "min-h-screen w-full overflow-hidden transition-colors duration-700",
        isRevealed ? "bg-pink-50" : "bg-slate-50",
      ].join(" ")}
    >
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: isRevealed
            ? "radial-gradient(80% 60% at 50% 30%, rgba(255,192,203,0.55), transparent)"
            : "radial-gradient(80% 60% at 50% 30%, rgba(100,116,139,0.08), transparent)",
        }}
      />

      <main className="relative z-[1] flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-3xl">
          <div className="rounded-2xl shadow-xl bg-white/80 backdrop-blur p-10 border border-white/60">
            <div className="flex flex-col items-center gap-8 text-center">
              {phase === "flashing" ? (
                <h1
                  className={[
                    "text-6xl md:text-7xl font-extrabold tracking-tight",
                    label === "GIRL" ? "text-pink-600" : label === "BOY" ? "text-sky-600" : "text-slate-700",
                  ].join(" ")}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {label}
                </h1>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={label}
                    initial={{ scale: 0.7, opacity: 0, rotate: -3 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.7, opacity: 0, rotate: 3 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                    className={[
                      "text-6xl md:text-7xl font-extrabold tracking-tight",
                      label === "GIRL" ? "text-pink-600" : label === "BOY" ? "text-sky-600" : "text-slate-700",
                    ].join(" ")}
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {label}
                  </motion.h1>
                </AnimatePresence>
              )}

              <p className="text-slate-600 max-w-prose">
                Click the button to run the reveal!
              </p>

              <div className="flex items-center gap-3 flex-wrap justify-center">
                <button
                  onClick={isRevealed ? reset : startReveal}
                  disabled={phase === "flashing"}
                  className={[
                    "px-6 py-3 rounded-2xl text-lg font-semibold shadow",
                    "transition-transform active:scale-[.98]",
                    phase === "flashing"
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-slate-900 text-white hover:bg-slate-800",
                  ].join(" ")}
                >
                  {phase === "idle" && "Reveal!"}
                  {phase === "flashing" && "Revealing…"}
                  {phase === "revealed" && "Again!"}
                </button>

                {phase === "revealed" && (
                  <button
                    onClick={reset}
                    className="px-5 py-3 rounded-2xl text-lg font-medium bg-white border border-pink-200 text-pink-700 hover:bg-pink-50"
                  >
                    Reset
                  </button>
                )}
              </div>

              {phase === "flashing" && (
                <div className="text-sm text-slate-500" aria-hidden>
                  Shuffling… {flashes}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="pointer-events-none fixed inset-0 z-0"
            aria-hidden
          >
            <div className="relative w-full h-full">
              {balloons.map((b) => (
                <Balloon key={b.id} {...b} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function nextLabel(prev) {
  return prev === "BOY" ? "GIRL" : "BOY";
}
