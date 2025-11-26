"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MESSAGES, TIMINGS } from "@/lib/constants";

interface Message {
  type: "user" | "zoro";
  text: string;
}

export default function TranslatorPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [direction, setDirection] = useState<"FR->EN" | "EN->FR">("FR->EN");
  const [isInitialized, setIsInitialized] = useState(false);
  
//   eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Récupérer le username depuis localStorage
    const session = localStorage.getItem("user_session");
    if (session) {
      try {
        const user = JSON.parse(session);
        setUsername(user.username);
      } catch {
        router.push("/login");
        return;
      }
    } else {
      router.push("/login");
      return;
    }

    setIsInitialized(true);
  }, [router]);

  // Afficher le tutoriel quand initialisé
  useEffect(() => {
    if (!isInitialized) return;

    const tutorial = async () => {
      for (const msg of MESSAGES.ZORO_TUTORIAL) {
        await new Promise((r) => setTimeout(r, TIMINGS.MESSAGE_DELAY));
        setMessages((prev) => [...prev, { type: "zoro", text: msg }]);
      }
    };

    tutorial();
  }, [isInitialized]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");

    // Ajouter le message utilisateur
    setMessages((prev) => [...prev, { type: "user", text: `> user: ${userMessage}` }]);

    // Gestion des commandes spéciales
    if (userMessage === "/swap") {
      setDirection(direction === "FR->EN" ? "EN->FR" : "FR->EN");
      setMessages((prev) => [
        ...prev,
        {
          type: "zoro",
          text: `[MODE INVERSÉ: ${direction === "FR->EN" ? "EN->FR" : "FR->EN"}]`,
        },
      ]);
      return;
    }

    if (userMessage === "/clear") {
      setMessages([]);
      return;
    }

    if (userMessage === "/help") {
      setMessages((prev) => [
        ...prev,
        {
          type: "zoro",
          text: "Commandes: /swap (inverser) | /clear (effacer) | /help (aide)",
        },
      ]);
      return;
    }

    // Simuler une traduction
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    setMessages((prev) => [
      ...prev,
      { type: "zoro", text: "zoro: [ANALYSE SÉMANTIQUE...]" },
    ]);

    await new Promise((r) => setTimeout(r, 800));

    // Simuler une traduction (en production, appeler une API)
    const simulated = `zoro: [Traduction simulée de: "${userMessage}"]`;
    setMessages((prev) => [...prev, { type: "zoro", text: simulated }]);
    setIsLoading(false);
  };

  const handleDisconnect = () => {
    const confirmed = window.confirm(MESSAGES.TRANSLATOR.CONFIRM_LOGOUT);
    if (confirmed) {
      localStorage.removeItem("user_session");
      router.push("/");
    }
  };

  return (
    <>
      <div className="terminal-line">
        zoro v2.47 | {direction} | User: {username}
      </div>

      <div style={{ marginTop: "20px", flexGrow: 1, overflow: "auto" }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`terminal-line ${msg.type === "zoro" ? "zoro" : ""}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="terminal-input-group">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Entrez votre texte..."
          disabled={isLoading}
          autoFocus
        />
      </form>

      <div style={{ fontSize: "12px", marginTop: "10px", opacity: 0.7 }}>
        Commandes: /swap /clear /help
      </div>

      <button className="disconnect-btn" onClick={handleDisconnect}>
        {MESSAGES.TRANSLATOR.DISCONNECT}
      </button>
    </>
  );
}