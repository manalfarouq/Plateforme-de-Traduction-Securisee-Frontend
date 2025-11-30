"use client";

import { useState, useEffect } from "react";
import { MESSAGES, getCurrentUsername } from "@/lib/constants";
import "@/styles/terminal.css";

// Fonction helper pour initialiser le username côté client
function getInitialUsername() {
  if (typeof window === "undefined") return "GUEST_1337";
  return getCurrentUsername();
}

// Fonction helper pour initialiser le role côté client
function getInitialUserRole() {
  if (typeof window === "undefined") return "user";
  
  try {
    const session = localStorage.getItem("user_session");
    if (session) {
      const user = JSON.parse(session);
      return user.role || "user";
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du rôle:", error);
  }
  
  return "user";
}

export default function TranslatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [easterEgg, setEasterEgg] = useState<string | null>(null);
  const [username, setUsername] = useState<string>(getInitialUsername);
  const [userRole, setUserRole] = useState<string>(getInitialUserRole);

  // Écouter les changements de storage pour mettre à jour en temps réel
  useEffect(() => {
    const handleStorageChange = () => {
      setUsername(getCurrentUsername());
      setUserRole(getInitialUserRole());
    };

    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
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

  return (
    <div className="terminal-layout fullscreen">
      {easterEgg && <div className="easter-egg">{easterEgg}</div>}
      
      <header className="terminal-header">
        <span className="terminal-status">zoro v2.47</span>
        <span className="terminal-user">
          USER: {username.toUpperCase()} | STATUS: CONNECTED
          {userRole === "admin" && (
            <span style={{ color: "#ff00ff", marginLeft: "8px" }}>
              [ADMIN]
            </span>
          )}
        </span>
      </header>

      <main className="terminal-main fullscreen">{children}</main>
    </div>
  );
}