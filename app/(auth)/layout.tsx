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
  
  // Initialiser avec le username actuel
  const [username, setUsername] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return getCurrentUsername();
    }
    return "GUEST_1337";
  });

  // Vérifier si l'utilisateur est vraiment connecté
  const [isConnected, setIsConnected] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("isAuthenticated");
      return auth === "true";
    }
    return false;
  });

  useEffect(() => {
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

    // Vérifier immédiatement au montage
    checkUsername();

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
          {/* Vide à gauche ou tu peux mettre quelque chose */}
        </span>
        
        {/* ✅ Afficher à DROITE */}
        {!isConnected && (
          <span className="terminal-user">
            STATUS: DISCONNECTED
          </span>
        )}
        
        {isConnected && (
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