"use client";

import { useState, useLayoutEffect } from "react";
import { MESSAGES } from "@/lib/constants";
import "@/styles/trap.css";

interface TrapPageProps {
  onStart: (text: string) => void;
}

interface PixelPos {
  left: number;
  top: number;
}

export default function TrapPage({ onStart }: TrapPageProps) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [hasGlitch, setHasGlitch] = useState(false);
  const [pixelPos, setPixelPos] = useState<PixelPos | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // useLayoutEffect s'exécute AVANT le paint
  // setState ici est nécessaire pour éviter hydration mismatch// eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    // Générer la position aléatoire UNIQUEMENT côté client
    setPixelPos({
      left: Math.random() * 80 + 10,
      top: Math.random() * 80 + 10,
    });

    setIsMounted(true);
  }, []);

  // Configurer les glitches aléatoires
  useLayoutEffect(() => {
    if (!isMounted) return;

    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.05) {
        setHasGlitch(true);
      }
    }, 3000);

    return () => {
      clearInterval(glitchInterval);
    };
  }, [isMounted]);

  // Réinitialiser le glitch après 200ms
  useLayoutEffect(() => {
    if (!hasGlitch) return;

    const timeoutId = setTimeout(() => {
      setHasGlitch(false);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [hasGlitch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      setError(MESSAGES.TRAP_PAGE.ERROR);
      return;
    }

    setError("");
    onStart(text);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  // Ne pas afficher le pixel tant qu'on n'est pas hydraté
  if (!isMounted || !pixelPos) {
    return (
      <div className="trap-page-container">
        <div className={`trap-page-content ${hasGlitch ? "glitch-active" : ""}`}>
          <h1 className="trap-title">{MESSAGES.TRAP_PAGE.TITLE}</h1>
          <p className="trap-subtitle">{MESSAGES.TRAP_PAGE.SUBTITLE}</p>

          <form onSubmit={handleSubmit} className="trap-form">
            <div className="form-group">
              <label htmlFor="textarea">
                {MESSAGES.TRAP_PAGE.LABEL}
              </label>
              <textarea
                id="textarea"
                value={text}
                onChange={handleTextChange}
                placeholder={MESSAGES.TRAP_PAGE.PLACEHOLDER}
                className="trap-textarea"
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="trap-button">
              {MESSAGES.TRAP_PAGE.BUTTON}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="trap-page-container">
      {/* Dead Pixel Effect */}
      <div
        className="dead-pixel"
        style={{
          left: `${pixelPos.left}%`,
          top: `${pixelPos.top}%`,
        }}
      />

      <div className={`trap-page-content ${hasGlitch ? "glitch-active" : ""}`}>
        <h1 className="trap-title">{MESSAGES.TRAP_PAGE.TITLE}</h1>
        <p className="trap-subtitle">{MESSAGES.TRAP_PAGE.SUBTITLE}</p>

        <form onSubmit={handleSubmit} className="trap-form">
          <div className="form-group">
            <label htmlFor="textarea">
              {MESSAGES.TRAP_PAGE.LABEL}
            </label>
            <textarea
              id="textarea"
              value={text}
              onChange={handleTextChange}
              placeholder={MESSAGES.TRAP_PAGE.PLACEHOLDER}
              className="trap-textarea"
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="trap-button">
            {MESSAGES.TRAP_PAGE.BUTTON}
          </button>
        </form>
      </div>
    </div>
  );
}