"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MESSAGES } from "@/lib/constants";
import { apiService } from "@/lib/apiService";
import { useAuth } from "@/hooks/useAuth";
import TypewriterLine from "@/components/ui/TypewriterLine";

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
  const [error, setError] = useState<string | null>(null);

  // Tutoriel : compteur pour suivre le nombre de messages affichés
  const [initializedMessagesCount, setInitializedMessagesCount] = useState(0);

  useEffect(() => {
    if (isChecking) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
  }, [isChecking, isAuthenticated, router]);

  const isTutorialFinished = initializedMessagesCount >= MESSAGES.ZORO_TUTORIAL.length;

  // --- Avancer le tutoriel ---
  const advanceTutorial = useCallback(() => {
    setInitializedMessagesCount((prev) => prev + 1);
  }, []);

  // --- Gestion de la soumission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");

    // Ajouter le message utilisateur avec animation
    setMessages((prev) => [
      ...prev,
      { type: "user", text: `> ${username.toUpperCase()}: ${userMessage}` },
    ]);

    // Commandes spéciales
    if (userMessage === "/swap") {
      const newDirection = direction === "FR->EN" ? "EN->FR" : "FR->EN";
      setDirection(newDirection);
      setMessages((prev) => [
        ...prev,
        { type: "zoro", text: `>>> ZORO: [MODE INVERSÉ: ${newDirection}]` },
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

    // Appel API traduction
    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      { type: "zoro", text: ">>> ZORO: [ANALYSE SÉMANTIQUE...]" },
    ]);
    await new Promise((r) => setTimeout(r, 500));

    try {
      const translation = await apiService.translate(userMessage, direction);
      if (translation && translation !== userMessage) {
        setMessages((prev) => [
          ...prev,
          { type: "zoro", text: `>>> ZORO: ${translation}` },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { type: "zoro", text: `>>> ZORO: [Aucune traduction nécessaire]` },
        ]);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Impossible de traduire";
      setError(errorMsg);
      setMessages((prev) => [
        ...prev,
        { type: "zoro", text: `>>> ZORO: [ERREUR] ${errorMsg}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    if (window.confirm(MESSAGES.TRANSLATOR.CONFIRM_LOGOUT)) {
      localStorage.removeItem("user_session");
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("isAuthenticated");
      router.push("/");
    }
  };

  return (
    <>
      <div className="terminal-line">
        zoro v2.47 | {direction} | {username?.toUpperCase()}
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
        {/* Messages tutoriel terminés */}
        {MESSAGES.ZORO_TUTORIAL.slice(0, initializedMessagesCount).map((msg, idx) => (
          <div key={`tut-done-${idx}`} className="terminal-line zoro">
            {msg}
          </div>
        ))}

        {/* Message tutoriel en cours */}
        {!isTutorialFinished && (
          <TypewriterLine
            key={`tut-${initializedMessagesCount}`}
            text={MESSAGES.ZORO_TUTORIAL[initializedMessagesCount]}
            delay={0}
            className="zoro"
            onComplete={advanceTutorial}
          />
        )}

        {/* Messages utilisateur et traductions avec animation */}
        {isTutorialFinished &&
          messages.map((msg, idx) => (
            <TypewriterLine
              key={`msg-${idx}`}
              text={msg.text}
              delay={0}
              className={msg.type === "zoro" ? "zoro" : ""}
            />
          ))}
      </div>

      <form onSubmit={handleSubmit} className="terminal-input-group">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Entrez votre texte..."
          disabled={isLoading || !isTutorialFinished}
          autoFocus
        />
      </form>

      <div style={{ fontSize: "12px", marginTop: "10px", opacity: 0.7 }}>
        Commandes: /swap /clear /help | Status: {isLoading ? "Traduction..." : "Prêt"}
      </div>

      <button className="disconnect-btn" onClick={handleDisconnect} disabled={!isTutorialFinished}>
        {MESSAGES.TRANSLATOR.DISCONNECT}
      </button>
    </>
  );
}
