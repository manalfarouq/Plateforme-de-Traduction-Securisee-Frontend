"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MESSAGES, TIMINGS } from "@/lib/constants";
import { apiService } from "@/lib/apiService";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  type: "user" | "zoro";
  text: string;
}

export default function TranslatorPage() {
  const router = useRouter();
  
  const { username, isChecking, isAuthenticated } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [direction, setDirection] = useState<"FR->EN" | "EN->FR">("FR->EN");
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isChecking) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setIsInitialized(true);
  }, [isChecking, isAuthenticated, router]);

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

  // Afficher le username en majuscules
  setMessages((prev) => [...prev, { type: "user", text: `> ${username.toUpperCase()}: ${userMessage}` }]);

  // Gestion des commandes spéciales
  if (userMessage === "/swap") {
    const newDirection = direction === "FR->EN" ? "EN->FR" : "FR->EN";
    setDirection(newDirection);
    setMessages((prev) => [
      ...prev,
      {
        type: "zoro",
        text: `>>> ZORO: [MODE INVERSÉ: ${newDirection}]`,
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
        text: ">>> ZORO: Commandes: /swap (inverser) | /clear (effacer) | /help (aide)",
      },
    ]);
    return;
  }

  // Appeler la traduction
  setIsLoading(true);

  // Afficher "Analyse sémantique"
  setMessages((prev) => [
    ...prev,
    { type: "zoro", text: ">>> ZORO: [ANALYSE SÉMANTIQUE...]" },
  ]);

  await new Promise((r) => setTimeout(r, 500));

  try {
    const translation = await apiService.translate(userMessage, direction);

    if (translation && translation !== userMessage) {
      // Afficher la traduction
      const result = `>>> ZORO: ${translation}`;
      setMessages((prev) => [...prev, { type: "zoro", text: result }]);
    } else if (translation === userMessage) {
      // Texte identique (pas de traduction)
      setMessages((prev) => [
        ...prev,
        {
          type: "zoro",
          text: `>>> ZORO: [Aucune traduction nécessaire]`,
        },
      ]);
    }
  } catch (err) {
    // Erreur
    const errorMsg = err instanceof Error ? err.message : "Impossible de traduire";
    setError(errorMsg);
    setMessages((prev) => [
      ...prev,
      {
        type: "zoro",
        text: `>>> ZORO: [ERREUR] ${errorMsg}`,
      },
    ]);
  } finally {
    setIsLoading(false);
  }
};

  const handleDisconnect = () => {
    const confirmed = window.confirm(MESSAGES.TRANSLATOR.CONFIRM_LOGOUT);
    if (confirmed) {
      localStorage.removeItem("user_session");
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("isAuthenticated");
      router.push("/");
    }
  };

  if (isChecking) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <div className="terminal-line" style={{ animation: "blink 1s infinite" }}>
          INITIALISATION...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
  <>
    <div className="terminal-line">
      zoro v2.47 | {direction} | {username.toUpperCase()}
    </div>

      {error && (
        <div
          style={{
            color: "#ff6b6b",
            marginTop: "10px",
            padding: "10px",
            border: "1px solid #ff6b6b",
            borderRadius: "3px",
            fontSize: "12px",
          }}
        >
          Erreur: {error}
        </div>
      )}

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
        Commandes: /swap /clear /help | Status: {isLoading ? "Traduction..." : "Prêt"}
      </div>

      <button className="disconnect-btn" onClick={handleDisconnect}>
        {MESSAGES.TRANSLATOR.DISCONNECT}
      </button>
    </>
  );
}