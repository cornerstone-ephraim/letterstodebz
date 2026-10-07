"use client";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  type MotionValue,
} from "motion/react";
import type { Letter } from "@/data/letters";

export function LetterReader({
  letter,
  progress,
  nextDate,
  onNext,
}: {
  letter: Letter;
  progress: MotionValue<number>;
  nextDate?: string;
  onNext: () => void;
}) {
  const [activePassage, setActivePassage] = useState(0);
  const reduced = useReducedMotion();
  const scrollContainer = useRef<HTMLElement>(null);
  const scrollContent = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  const { scrollYProgress } = useScroll({ container: scrollContainer });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    progress.set(value);
    setActivePassage(
      Math.min(
        letter.passages.length - 1,
        Math.round(value * (letter.passages.length - 1)),
      ),
    );
  });

  useEffect(() => {
    progress.set(0);
    heading.current?.focus({ preventScroll: true });
    if (reduced || !scrollContainer.current || !scrollContent.current) return;
    const scrolling = new Lenis({
      wrapper: scrollContainer.current,
      content: scrollContent.current,
      autoRaf: true,
      smoothWheel: true,
      syncTouch: false,
      lerp: 0.1,
      wheelMultiplier: 0.8,
    });
    return () => scrolling.destroy();
  }, [progress, reduced]);

  return (
    <article
      ref={scrollContainer}
      className="letter-scroll"
      aria-label={`${letter.date} letter from Keniye to Debz`}
      tabIndex={0}
    >
      <div ref={scrollContent}>
        {letter.passages.map((_, index) => (
          <div className="letter-chapter" key={index} aria-hidden="true" />
        ))}
      </div>
      <div className="letter-copy-stage" aria-live="polite" aria-atomic="true">
        <AnimatePresence mode="wait">
          <motion.section
            key={activePassage}
            className="love-letter"
            aria-label={`Passage ${activePassage + 1} of ${letter.passages.length}`}
            initial={{
              opacity: 0,
              transform: reduced ? "none" : "translateY(18px)",
            }}
            animate={{
              opacity: 1,
              transform: reduced ? "none" : "translateY(0px)",
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: reduced ? 0.15 : 0.35,
              ease: [0.23, 1, 0.32, 1],
            }}
          >
            {activePassage === 0 && (
              <>
                <p className="letter-date">{letter.date}</p>
                <h1 id="letter-greeting" ref={heading} tabIndex={-1}>
                  {letter.greeting}
                </h1>
              </>
            )}
            {letter.passages[activePassage].map((paragraph, index) => (
              <p className="letter-paragraph" key={index}>
                {paragraph}
              </p>
            ))}
            {activePassage === letter.passages.length - 1 && (
              <p className="letter-signoff">
                {letter.signoff}
                <br />
                {letter.closing}
                <span>{letter.signature}</span>
              </p>
            )}
            {activePassage === letter.passages.length - 1 && (
              <button className="next-letter" onClick={onNext}>
                {nextDate ? `Read ${nextDate} →` : "Back to December 2025 →"}
              </button>
            )}
            {activePassage === 0 && (
              <p className="scroll-invitation">Scroll to unfold the letter ↓</p>
            )}
          </motion.section>
        </AnimatePresence>
      </div>
    </article>
  );
}
