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
  
  const [username, setUsername] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return getCurrentUsername();
    }
    return "GUEST_1337";
  });

  const [isConnected, setIsConnected] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("isAuthenticated");
      return auth === "true";
    }
    return false;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const newUsername = getCurrentUsername();
      const auth = localStorage.getItem("isAuthenticated") === "true";
      setUsername(newUsername);
      setIsConnected(auth);
    };

    const checkUsername = () => {
      const currentUsername = getCurrentUsername();
      const auth = localStorage.getItem("isAuthenticated") === "true";
      setUsername(currentUsername);
      setIsConnected(auth);
    };

    checkUsername();
    const interval = setInterval(checkUsername, 500);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
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
    <div className="terminal-layout"> {/* MODE CENTRÉ */}
      <header className="terminal-header">
        <span className="terminal-status">
          zoro v2.47
        </span>
        
        {!isConnected && (
          <span className="terminal-user disconnected">
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

      <main className="terminal-main">{children}</main> {/* MODE COMPACT */}
    </div>
  );
}