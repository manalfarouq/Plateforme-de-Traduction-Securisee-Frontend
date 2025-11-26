"use client";

import { useState, useEffect } from "react";
import { MESSAGES } from "@/lib/constants";
import "@/styles/terminal.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [easterEgg, setEasterEgg] = useState<string | null>(null);

  useEffect(() => {
    // Afficher un easter egg aléatoire toutes les 30 secondes
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% de chance
        const eggs = MESSAGES.EASTER_EGGS;
        const egg = eggs[Math.floor(Math.random() * eggs.length)];
        setEasterEgg(egg);

        // Disparaître après 4 secondes
        const timeout = setTimeout(() => setEasterEgg(null), 4000);
        return () => clearTimeout(timeout);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="terminal-layout">
      <header className="terminal-header">
        <span className="terminal-status">
          {MESSAGES.TERMINAL.HEADER_STATUS}
        </span>
        <span className="terminal-user">
          {MESSAGES.TERMINAL.HEADER_USER}
        </span>
      </header>

      {easterEgg && <div className="easter-egg">{easterEgg}</div>}

      <main className="terminal-main">{children}</main>
    </div>
  );
}