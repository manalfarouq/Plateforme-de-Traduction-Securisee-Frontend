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

  const [messagesQueue, setMessagesQueue] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [direction, setDirection] = useState<"FR->EN" | "EN->FR">("FR->EN");
  const [error, setError] = useState<string | null>(null);

  const [initializedMessagesCount, setInitializedMessagesCount] = useState(0);

  useEffect(() => {
    if (isChecking) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
  }, [isChecking, isAuthenticated, router]);

  const isTutorialFinished = initializedMessagesCount >= MESSAGES.ZORO_TUTORIAL.length;

  const advanceTutorial = useCallback(() => {
    setInitializedMessagesCount((prev) => prev + 1);
  }, []);

  const enqueueMessage = (msg: Message) => {
    setMessagesQueue((prev) => [...prev, msg]);
  };

  // --- Affichage séquentiel ---
  useEffect(() => {
    if (!currentMessage && messagesQueue.length > 0) {
      const [next, ...rest] = messagesQueue;
      setCurrentMessage(next);
      setMessagesQueue(rest);
    }
  }, [currentMessage, messagesQueue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");

    enqueueMessage({ type: "user", text: `> ${username.toUpperCase()}: ${userMessage}` });

    // Commandes spéciales
    if (userMessage === "/swap") {
      const newDirection = direction === "FR->EN" ? "EN->FR" : "FR->EN";
      setDirection(newDirection);
      enqueueMessage({ type: "zoro", text: `>>> ZORO: [MODE INVERSÉ: ${newDirection}]` });
      return;
    }
    if (userMessage === "/clear") {
      setMessagesQueue([]);
      setDisplayedMessages([]);
      setCurrentMessage(null);
      return;
    }
    if (userMessage === "/help") {
      enqueueMessage({
        type: "zoro",
        text: ">>> ZORO: Commandes: /swap (inverser) | /clear (effacer) | /help (aide)",
      });
      return;
    }

    setIsLoading(true);
    enqueueMessage({ type: "zoro", text: ">>> ZORO: [ANALYSE SÉMANTIQUE...]" });
    await new Promise((r) => setTimeout(r, 500));

    try {
      const translation = await apiService.translate(userMessage, direction);
      enqueueMessage({
        type: "zoro",
        text:
          translation && translation !== userMessage
            ? `>>> ZORO: ${translation}`
            : `>>> ZORO: [Aucune traduction nécessaire]`,
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Impossible de traduire";
      setError(errorMsg);
      enqueueMessage({ type: "zoro", text: `>>> ZORO: [ERREUR] ${errorMsg}` });
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

        {/* Messages animés utilisateur et Zoro */}
        {displayedMessages.map((msg, idx) => (
          <div key={`disp-${idx}`} className={`terminal-line ${msg.type === "zoro" ? "zoro" : ""}`}>
            {msg.text}
          </div>
        ))}

        {currentMessage && (
          <TypewriterLine
            key={currentMessage.text + Math.random()}
            text={currentMessage.text}
            delay={0}
            className={currentMessage.type === "zoro" ? "zoro" : ""}
            onComplete={() => {
              setDisplayedMessages((prev) => [...prev, currentMessage]);
              setCurrentMessage(null);
            }}
          />
        )}
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
