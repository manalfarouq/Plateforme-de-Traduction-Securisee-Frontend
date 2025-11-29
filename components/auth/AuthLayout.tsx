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
  const [username, setUsername] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    
    // Charger les données initiales
    const currentUsername = getCurrentUsername();
    const auth = localStorage.getItem("isAuthenticated") === "true";
    setUsername(currentUsername);
    setIsConnected(auth);

    // Écouter les changements de localStorage (autres onglets)
    const handleStorageChange = () => {
      const newUsername = getCurrentUsername();
      const auth = localStorage.getItem("isAuthenticated") === "true";
      setUsername(newUsername);
      setIsConnected(auth);
    };

    // Vérifier le username et le statut de connexion
    const checkUsername = () => {
      const currentUsername = getCurrentUsername();
      const auth = localStorage.getItem("isAuthenticated") === "true";
      setUsername(currentUsername);
      setIsConnected(auth);
    };

    // Vérifier toutes les 500ms pour les changements locaux
    const interval = setInterval(checkUsername, 500);

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // Afficher un easter egg aléatoire toutes les 30 secondes
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        const eggs = MESSAGES.EASTER_EGGS;
        const egg = eggs[Math.floor(Math.random() * eggs.length)];
        setEasterEgg(egg);

        setTimeout(() => setEasterEgg(null), 4000);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Ne rien afficher côté serveur pour éviter hydration mismatch
  if (!isMounted) {
    return (
      <div className="terminal-layout">
        <header className="terminal-header">
          <span className="terminal-status"></span>
          <span className="terminal-user"></span>
        </header>
        <main className="terminal-main">{children}</main>
      </div>
    );
  }

  return (
    <div className="terminal-layout">
      <header className="terminal-header">
        <span className="terminal-status">
          {/* Vide à gauche */}
        </span>
        
        {/* Afficher à DROITE */}
        {!isConnected && (
          <span className="terminal-user">
            STATUS: DISCONNECTED
          </span>
        )}
        
        {isConnected && username && (
          <span className="terminal-user">
            USER: {username.toUpperCase()} | STATUS: CONNECTED
          </span>
        )}
      </header>

      {easterEgg && <div className="easter-egg">{easterEgg}</div>}

      <main className="terminal-main">{children}</main>
    </div>
  );
}