"use client";

import dynamic from "next/dynamic";
import {
  Component,
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useMotionValue, useReducedMotion } from "motion/react";
import { atmosphereFor, atmospheres } from "./scene-palette";
import { letters } from "@/data/letters";
import { LetterReader } from "./letter-reader";
import { HeartGate } from "./heart-gate";
import { NightSky } from "./night-sky";
import { SceneFallback } from "./scene-fallback";
import "./letters.css";
import { Pause, Play } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const LondonScene = dynamic(() => import("./london-scene"), { ssr: false });
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function LettersExperience() {
  const [open, setOpen] = useState(false);
  const [pauseOverride, setPauseOverride] = useState<boolean | null>(null);
  const [selected, setSelected] = useState(0);
  const letter = letters[selected];
  const atmosphere = atmosphereFor(letter.id);
  const sky = atmospheres[atmosphere];
  const theme = {
    "--evening": sky.sky,
    "--horizon": sky.horizon,
    "--ink": sky.ink,
    "--muted-ink": sky.muted,
    "--love": sky.accent,
  } as CSSProperties;
  const scrollYProgress = useMotionValue(0);
  function selectLetter(index: number) {
    scrollYProgress.set(0);
    setSelected(index);
  }
  const reduced = useReducedMotion();
  // Respect the device preference initially, but let an explicit Play override it.
  const paused = pauseOverride ?? !!reduced;
  const showLiveScene = !reduced || pauseOverride !== null;

  useEffect(() => {
    if (open) return;

    const previous = document.body.style.overflow;
    const restoration = window.history.scrollRestoration;

    window.history.scrollRestoration = "manual";
    document.body.style.overflow = "hidden";

    window.scrollTo({ top: 0, behavior: "instant" });

    return () => {
      document.body.style.overflow = previous;
      window.history.scrollRestoration = restoration;
    };
  }, [open]);

  return (
    <main
      className={`letters-experience ${open ? "is-open" : "is-sealed"}`}
      style={theme}
      data-atmosphere={atmosphere}
      data-season={letter.season}
      data-world-motion={paused ? "paused" : "playing"}
    >
      <div className="letter-stage" inert={!open} aria-hidden={!open}>
        <header className="letter-header">
          <span>
            Debz <i>&</i> Keni
          </span>
          <span className="header-dedication">
            A little world, just for you.
          </span>
        </header>
        <nav className="letter-months" aria-label="Choose a letter">
          <label htmlFor="letter-month">A letter for</label>
          <Select
            value={String(selected)}
            onValueChange={(value) => selectLetter(Number(value))}
          >
            <SelectTrigger id="letter-month" className="letter-month-trigger">
              <SelectValue>{letter.date}</SelectValue>
            </SelectTrigger>
            <SelectContent
              className="letter-month-popup"
              style={theme}
              data-season={letter.season}
              alignItemWithTrigger={false}
              sideOffset={8}
            >
              <SelectGroup>
                <SelectLabel>Select a month</SelectLabel>
                {letters.map((item, index) => (
                  <SelectItem key={item.id} value={String(index)}>
                    {item.date}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </nav>
        <NightSky scrollYProgress={scrollYProgress} atmosphere={atmosphere} />
        {open && (
          <LetterReader
            key={letter.id}
            letter={letter}
            progress={scrollYProgress}
            nextDate={letters[selected + 1]?.date}
            onNext={() => selectLetter((selected + 1) % letters.length)}
          />
        )}
        <div
          className="london-landscape"
          role="img"
          aria-label={`${sky.description} in London, with Tower Bridge, moving traffic and rippling water.`}
        >
          <SceneFallback atmosphere={atmosphere} />
          {showLiveScene && (
            <SceneBoundary>
              <LondonScene
                atmosphere={atmosphere}
                season={letter.season}
                progress={scrollYProgress}
                paused={paused || !open}
              />
            </SceneBoundary>
          )}
        </div>
        {letter.season === "winter" && (
          <div
            className="snowfall"
            aria-hidden="true"
            style={{
              animationPlayState: paused || !open ? "paused" : "running",
            }}
          >
            {Array.from({ length: 48 }, (_, i) => (
              <span
                key={i}
                style={{
                  left: `${(i * 37) % 101}%`,
                  width: `${2 + (i % 3)}px`,
                  height: `${2 + (i % 3)}px`,
                  animationDuration: `${12 + (i % 13)}s`,
                  animationDelay: `${-((i * 7) % 25)}s`,
                }}
              />
            ))}
          </div>
        )}
        <footer className="letter-footer">
          <WorldControl paused={paused} setPaused={setPauseOverride} />
        </footer>
      </div>
      {!open && <HeartGate onOpen={() => setOpen(true)} />}
    </main>
  );
}

const WorldControl = ({
  paused,
  setPaused,
}: {
  paused: boolean;
  setPaused: (paused: boolean) => void;
}) => {
  return (
    <button
      onClick={() => setPaused(!paused)}
      aria-pressed={paused}
      aria-label={paused ? "Play the world" : "Pause the world"}
    >
      {paused ? (
        <span className="flex items-center justify-center gap-2">
          <Play className="w-3" />
          Play the world
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <Pause className="w-3" />
          Pause the world
        </span>
      )}
    </button>
  );
};
