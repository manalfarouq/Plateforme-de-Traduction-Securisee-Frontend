"use client";

import { useState, useEffect } from "react";
import { MESSAGES, getCurrentUsername } from "@/lib/constants";
import "@/styles/terminal.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [easterEgg, setEasterEgg] = useState<string | null>(null);
  // Initialiser directement avec getCurrentUsername (safe car exécuté côté client)
  const [username, setUsername] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return getCurrentUsername();
    }
    return "GUEST_1337";
  });

  useEffect(() => {
    // Écouter les changements de localStorage
    const handleStorageChange = () => {
      setUsername(getCurrentUsername());
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Vérifier aussi toutes les 2 secondes (au cas où le storage change dans la même page)
    const checkInterval = setInterval(() => {
      const currentUser = getCurrentUsername();
      setUsername((prev) => {
        // Ne mettre à jour que si différent pour éviter les re-renders inutiles
        return prev !== currentUser ? currentUser : prev;
      });
    }, 2000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(checkInterval);
    };
  }, []);

  useEffect(() => {
    // Afficher un easter egg aléatoire toutes les 30 secondes
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% de chance
        const eggs = MESSAGES.EASTER_EGGS;
        const egg = eggs[Math.floor(Math.random() * eggs.length)];
        setEasterEgg(egg);

        // Disparaître après 4 secondes
        setTimeout(() => setEasterEgg(null), 4000);
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
          {MESSAGES.TERMINAL.getHeaderUser(username)}
        </span>
      </header>

      {easterEgg && <div className="easter-egg">{easterEgg}</div>}

      <main className="terminal-main">{children}</main>
    </div>
  );
}